
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Plus, BriefcaseBusiness } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Project } from "@/types";

const Projects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get all open projects
        const q = query(
          collection(db, "projects"),
          where("status", "==", "open"),
          orderBy("createdAt", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        
        const fetchedProjects: Project[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProjects.push({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt.toDate(),
            deadline: doc.data().deadline?.toDate() || null
          } as Project);
        });
        
        setProjects(fetchedProjects);
        setFilteredProjects(fetchedProjects);
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProjects(projects);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = projects.filter(project => 
      project.title.toLowerCase().includes(query) || 
      project.description.toLowerCase().includes(query) ||
      project.category.some(cat => cat.toLowerCase().includes(query))
    );
    
    setFilteredProjects(filtered);
  }, [searchQuery, projects]);

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleCreateProject = () => {
    // If user is not logged in, redirect to login
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    // If user is logged in but doesn't have a role yet, redirect to create profile
    if (!userProfile?.role) {
      navigate("/create-profile");
      return;
    }
    
    // Navigate to create project page
    navigate("/post-project");
  };

  return (
    <div className="container max-w-6xl px-4 py-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Animation Projects</h1>
          <p className="text-muted-foreground">Find animation projects to work on</p>
        </div>
        
        <Button onClick={handleCreateProject}>
          <Plus className="h-4 w-4 mr-2" />
          Post a Project
        </Button>
      </div>
      
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Projects</TabsTrigger>
          <TabsTrigger value="2d-animation">2D Animation</TabsTrigger>
          <TabsTrigger value="character-design">Character Design</TabsTrigger>
          <TabsTrigger value="motion-graphics">Motion Graphics</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="overflow-hidden animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-muted rounded mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-muted rounded-full"></div>
                    <div className="h-4 bg-muted rounded w-24"></div>
                  </div>
                  <div className="h-6 bg-muted rounded w-16"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2">
          {filteredProjects.map((project) => (
            <Link to={`/projects/${project.id}`} key={project.id}>
              <Card className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer h-full">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-medium">{project.title}</h3>
                    <Badge>{project.budget.currency} {project.budget.min}-{project.budget.max}</Badge>
                  </div>
                  
                  {project.category.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.category.map((cat, index) => (
                        <Badge variant="outline" key={index}>{cat}</Badge>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">{project.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={project.clientPhoto || undefined} />
                        <AvatarFallback>{getInitials(project.clientName)}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{project.clientName}</span>
                    </div>
                    
                    {project.deadline && (
                      <div className="text-sm text-muted-foreground">
                        Due: {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(project.deadline)}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <BriefcaseBusiness className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            {searchQuery 
              ? "No projects match your search criteria. Try with different keywords." 
              : "There are no projects available right now. Check back later or create your own project."}
          </p>
          <Button onClick={handleCreateProject}>Post a Project</Button>
        </div>
      )}
    </div>
  );
};

export default Projects;
