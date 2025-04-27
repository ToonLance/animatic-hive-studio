
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Search, User, Users } from "lucide-react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { UserProfile } from "@/types";

const Animators = () => {
  const [animators, setAnimators] = useState<UserProfile[]>([]);
  const [filteredAnimators, setFilteredAnimators] = useState<UserProfile[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnimators = async () => {
      try {
        setLoading(true);
        
        // Get all users with role "freelancer"
        const q = query(
          collection(db, "users"),
          where("role", "==", "freelancer")
        );
        
        const querySnapshot = await getDocs(q);
        
        const animatorProfiles: UserProfile[] = [];
        querySnapshot.forEach((doc) => {
          animatorProfiles.push({
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
          } as UserProfile);
        });
        
        setAnimators(animatorProfiles);
        setFilteredAnimators(animatorProfiles);
      } catch (error) {
        console.error("Error fetching animators:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnimators();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredAnimators(animators);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = animators.filter(animator => 
      (animator.displayName?.toLowerCase().includes(query) || false) || 
      (animator.username?.toLowerCase().includes(query) || false) ||
      (animator.bio?.toLowerCase().includes(query) || false) ||
      animator.skills.some(skill => skill.toLowerCase().includes(query))
    );
    
    setFilteredAnimators(filtered);
  }, [searchQuery, animators]);

  const getInitials = (name: string | null) => {
    if (!name) return "A";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container max-w-6xl px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Find Animators</h1>
          <p className="text-muted-foreground">Discover talented 2D animators for your projects</p>
        </div>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skills, or keywords..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-muted rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-muted rounded w-1/2 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                  </div>
                </div>
                <div className="h-16 bg-muted rounded mb-4"></div>
                <div className="flex flex-wrap gap-2">
                  <div className="h-6 bg-muted rounded w-16"></div>
                  <div className="h-6 bg-muted rounded w-20"></div>
                  <div className="h-6 bg-muted rounded w-12"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAnimators.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnimators.map((animator) => (
            <Link to={`/profile/${animator.username || animator.uid}`} key={animator.uid}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={animator.photoURL || undefined} />
                      <AvatarFallback>{getInitials(animator.displayName || animator.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-xl font-medium">{animator.displayName || animator.username || "Animator"}</h3>
                      <p className="text-sm text-muted-foreground">@{animator.username || animator.uid.substring(0, 8)}</p>
                    </div>
                  </div>
                  
                  {animator.bio && (
                    <p className="text-muted-foreground mb-4 line-clamp-3">{animator.bio}</p>
                  )}
                  
                  {animator.skills && animator.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {animator.skills.map((skill, index) => (
                        <Badge variant="outline" key={index}>{skill}</Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No animators found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery 
              ? "No animators match your search criteria. Try with different keywords." 
              : "There are no animators registered yet."}
          </p>
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
        </div>
      )}
    </div>
  );
};

export default Animators;
