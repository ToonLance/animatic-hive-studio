
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { 
  doc, 
  getDoc, 
  updateDoc, 
  arrayUnion, 
  arrayRemove,
  Timestamp 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, DollarSign, MessageCircle } from "lucide-react";
import { Project } from "@/types";

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const { currentUser, userProfile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const isOwner = currentUser?.uid === project?.clientId;
  const hasApplied = project?.applicants?.includes(currentUser?.uid || "");
  const isHired = project?.hiredFreelancer === currentUser?.uid;

  useEffect(() => {
    const fetchProject = async () => {
      try {
        if (!projectId) return;
        
        setLoading(true);
        const projectRef = doc(db, "projects", projectId);
        const projectSnap = await getDoc(projectRef);
        
        if (!projectSnap.exists()) {
          toast({
            title: "Error",
            description: "Project not found",
            variant: "destructive",
          });
          navigate("/projects");
          return;
        }
        
        const projectData = {
          id: projectSnap.id,
          ...projectSnap.data(),
          createdAt: projectSnap.data().createdAt.toDate(),
          deadline: projectSnap.data().deadline?.toDate() || null
        } as Project;
        
        setProject(projectData);
      } catch (error) {
        console.error("Error fetching project:", error);
        toast({
          title: "Error",
          description: "Failed to load project details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProject();
  }, [projectId, toast, navigate]);

  const handleApply = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    
    if (!userProfile) {
      navigate("/create-profile");
      return;
    }
    
    if (userProfile.role !== "freelancer") {
      toast({
        title: "Error",
        description: "Only freelancers can apply to projects",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setApplying(true);
      
      const projectRef = doc(db, "projects", projectId!);
      
      if (hasApplied) {
        // Withdraw application
        await updateDoc(projectRef, {
          applicants: arrayRemove(currentUser.uid)
        });
        
        toast({
          title: "Success",
          description: "Application withdrawn successfully",
        });
      } else {
        // Apply to project
        await updateDoc(projectRef, {
          applicants: arrayUnion(currentUser.uid)
        });
        
        toast({
          title: "Success",
          description: "Applied to project successfully",
        });
      }
      
      // Update local state
      setProject(prev => {
        if (!prev) return null;
        
        const updatedApplicants = hasApplied 
          ? prev.applicants?.filter(id => id !== currentUser.uid) || []
          : [...(prev.applicants || []), currentUser.uid];
          
        return {
          ...prev,
          applicants: updatedApplicants
        };
      });
      
    } catch (error) {
      console.error("Error applying to project:", error);
      toast({
        title: "Error",
        description: hasApplied ? "Failed to withdraw application" : "Failed to apply to project",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="container max-w-4xl px-4 py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4 mb-2"></div>
          <div className="h-6 bg-muted rounded w-1/2 mb-6"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <div className="h-32 bg-muted rounded mb-6"></div>
              <div className="h-6 bg-muted rounded w-1/4 mb-2"></div>
              <div className="h-20 bg-muted rounded mb-4"></div>
            </div>
            <div>
              <div className="h-40 bg-muted rounded mb-4"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container max-w-4xl px-4 py-6">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Project not found</h1>
          <p className="text-muted-foreground mb-6">
            The project you are looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/projects">View All Projects</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl px-4 py-6">
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-2">
          <h1 className="text-2xl font-bold">{project.title}</h1>
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
        
        <div className="flex flex-wrap gap-2 mb-4">
          {project.category.map((cat, index) => (
            <Badge variant="outline" key={index}>{cat}</Badge>
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Project Description</h2>
              <p className="text-muted-foreground whitespace-pre-line">{project.description}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <h2 className="text-lg font-medium mb-4">Requirements</h2>
              <p className="text-muted-foreground whitespace-pre-line">{project.requirements}</p>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Budget</p>
                  <p className="font-medium">
                    {project.budget.currency} {project.budget.min} - {project.budget.max}
                  </p>
                </div>
              </div>
              
              {project.deadline && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Deadline</p>
                    <p className="font-medium">
                      {new Intl.DateTimeFormat('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      }).format(project.deadline)}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Posted</p>
                  <p className="font-medium">
                    {new Intl.DateTimeFormat('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }).format(project.createdAt)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <p className="text-sm text-muted-foreground mb-2">Client</p>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={project.clientPhoto || undefined} />
                    <AvatarFallback>{getInitials(project.clientName)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{project.clientName}</p>
                    <Link 
                      to={`/messages/${project.clientId}`} 
                      className="text-xs text-primary flex items-center gap-1 mt-1 hover:underline"
                    >
                      <MessageCircle className="h-3 w-3" /> Contact
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {!isOwner && userProfile?.role === "freelancer" && (
            <Button 
              className="w-full" 
              variant={hasApplied ? "outline" : "default"}
              onClick={handleApply}
              disabled={applying || project.status !== "open"}
            >
              {applying
                ? "Processing..."
                : hasApplied
                  ? "Withdraw Application"
                  : "Apply for this Project"}
            </Button>
          )}
          
          {isHired && (
            <Badge className="w-full justify-center py-2 mt-4" variant="secondary">
              You've been hired for this project
            </Badge>
          )}
          
          {isOwner && (
            <Button asChild className="w-full" variant="outline">
              <Link to={`/manage-project/${project.id}`}>
                Manage Project
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
