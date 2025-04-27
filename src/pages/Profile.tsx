
import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { MessageCircle, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { UserProfile, Project } from "@/types";

const Profile = () => {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const isOwnProfile = profile?.uid === currentUser?.uid;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        
        // Try to find by username first
        const usernameRef = doc(db, "usernames", username?.toLowerCase() || "");
        const usernameSnap = await getDoc(usernameRef);
        
        let userId = "";
        
        if (usernameSnap.exists()) {
          userId = usernameSnap.data().uid;
        } else {
          // If not found by username, try direct UID
          userId = username || "";
        }
        
        if (!userId) {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        // Get user profile
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        
        if (!userSnap.exists()) {
          toast({
            title: "Error",
            description: "User not found",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        
        setProfile(userSnap.data() as UserProfile);
        
        // If user is a freelancer, fetch their projects
        if (userSnap.data().role === "freelancer") {
          const projectsQuery = query(
            collection(db, "projects"),
            where("hiredFreelancer", "==", userId)
          );
          const projectsSnap = await getDocs(projectsQuery);
          
          const projectsData: Project[] = [];
          projectsSnap.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() } as Project);
          });
          
          setProjects(projectsData);
        }
        
        // If user is a client, fetch their posted projects
        if (userSnap.data().role === "client") {
          const projectsQuery = query(
            collection(db, "projects"),
            where("clientId", "==", userId)
          );
          const projectsSnap = await getDocs(projectsQuery);
          
          const projectsData: Project[] = [];
          projectsSnap.forEach((doc) => {
            projectsData.push({ id: doc.id, ...doc.data() } as Project);
          });
          
          setProjects(projectsData);
        }
        
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [username, toast]);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-24 h-24 bg-muted rounded-full"></div>
          <div className="h-8 w-48 bg-muted rounded-md"></div>
          <div className="h-4 w-64 bg-muted rounded-md"></div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <p className="text-muted-foreground mb-6">The user you are looking for doesn't exist or has been removed.</p>
          <Link to="/">
            <Button>Return to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container max-w-4xl px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="flex flex-col items-center md:items-start">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile.photoURL || undefined} />
            <AvatarFallback className="text-2xl">{getInitials(profile.displayName || profile.username)}</AvatarFallback>
          </Avatar>
          
          {isOwnProfile && (
            <Link to="/edit-profile">
              <Button variant="outline" size="sm" className="mt-4">
                <Pencil className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          )}
          
          {!isOwnProfile && (
            <Link to={`/messages/${profile.uid}`}>
              <Button size="sm" className="mt-4">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </Link>
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
            <div>
              <h1 className="text-3xl font-bold">{profile.displayName || profile.username}</h1>
              <p className="text-muted-foreground">@{profile.username}</p>
            </div>
            <Badge variant={profile.role === "freelancer" ? "default" : "secondary"} className="self-start md:self-auto">
              {profile.role === "freelancer" ? "Animator" : "Client"}
            </Badge>
          </div>
          
          {profile.bio && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">About</h2>
              <p className="text-muted-foreground">{profile.bio}</p>
            </div>
          )}
          
          {profile.role === "freelancer" && profile.skills && profile.skills.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium mb-2">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge variant="outline" key={index}>{skill}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-10">
        <Tabs defaultValue="portfolio" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="portfolio">
              {profile.role === "freelancer" ? "Portfolio" : "Projects"}
            </TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>
          
          <TabsContent value="portfolio" className="mt-6">
            {profile.role === "freelancer" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.portfolio && profile.portfolio.length > 0 ? (
                  profile.portfolio.map((item, index) => (
                    <Card key={index} className="overflow-hidden card-hover">
                      <CardContent className="p-0">
                        <img 
                          src={item} 
                          alt={`Portfolio item ${index + 1}`}
                          className="w-full h-[200px] object-cover"
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-12">
                    <p className="text-muted-foreground">No portfolio items yet</p>
                  </div>
                )}
                
                {isOwnProfile && (
                  <Link to="/edit-portfolio">
                    <Card className="h-[200px] border-dashed flex items-center justify-center hover:border-primary hover:text-primary transition-colors cursor-pointer">
                      <CardContent>
                        <div className="text-center">
                          <p className="font-medium">Add Portfolio Item</p>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {projects.length > 0 ? (
                  projects.map((project) => (
                    <Link to={`/projects/${project.id}`} key={project.id}>
                      <Card className="cursor-pointer hover:bg-accent/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium">{project.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                                {project.description}
                              </p>
                            </div>
                            <Badge 
                              variant={
                                project.status === "open" 
                                  ? "default" 
                                  : project.status === "in-progress" 
                                    ? "secondary" 
                                    : "outline"
                              }
                            >
                              {project.status}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No projects yet</p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="activity" className="mt-6">
            <div className="text-center py-12">
              <p className="text-muted-foreground">No recent activity</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
