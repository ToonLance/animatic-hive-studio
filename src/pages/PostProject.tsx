
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

const ANIMATION_CATEGORIES = [
  "2D Character Animation",
  "Motion Graphics",
  "Explainer Videos",
  "Logo Animation",
  "UI/UX Animation",
  "Character Design",
  "Background Design",
  "Storyboarding",
  "GIF Animation",
  "Social Media Animation"
];

const PostProject = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    category: [] as string[],
    budgetMin: "",
    budgetMax: "",
    currency: "USD",
    deadline: ""
  });
  const [loading, setLoading] = useState(false);
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategorySelection = (value: string) => {
    if (formData.category.includes(value)) {
      setFormData(prev => ({
        ...prev,
        category: prev.category.filter(cat => cat !== value)
      }));
    } else {
      if (formData.category.length < 3) {
        setFormData(prev => ({
          ...prev,
          category: [...prev.category, value]
        }));
      } else {
        toast({
          title: "Limit reached",
          description: "You can select up to 3 categories",
          variant: "destructive",
        });
      }
    }
  };

  const handleCurrencyChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      currency: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to post a project",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
    
    if (!userProfile) {
      toast({
        title: "Error",
        description: "You must complete your profile first",
        variant: "destructive",
      });
      navigate("/create-profile");
      return;
    }
    
    if (
      !formData.title.trim() || 
      !formData.description.trim() || 
      !formData.requirements.trim() || 
      formData.category.length === 0 || 
      !formData.budgetMin || 
      !formData.budgetMax
    ) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const budgetMin = parseFloat(formData.budgetMin);
    const budgetMax = parseFloat(formData.budgetMax);
    
    if (isNaN(budgetMin) || isNaN(budgetMax)) {
      toast({
        title: "Error",
        description: "Please enter valid budget amounts",
        variant: "destructive",
      });
      return;
    }
    
    if (budgetMin > budgetMax) {
      toast({
        title: "Error",
        description: "Minimum budget cannot be greater than maximum budget",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      const projectData = {
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        category: formData.category,
        budget: {
          min: budgetMin,
          max: budgetMax,
          currency: formData.currency
        },
        clientId: currentUser.uid,
        clientName: userProfile.displayName || userProfile.username || "User",
        clientPhoto: userProfile.photoURL,
        status: "open",
        deadline: formData.deadline ? new Date(formData.deadline) : null,
        createdAt: serverTimestamp(),
        applicants: [],
        hiredFreelancer: null
      };
      
      const projectRef = await addDoc(collection(db, "projects"), projectData);
      
      toast({
        title: "Success",
        description: "Project posted successfully",
      });
      
      navigate(`/projects/${projectRef.id}`);
    } catch (error) {
      console.error("Error posting project:", error);
      toast({
        title: "Error",
        description: "Failed to post project",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Post a New Project</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
          <CardDescription>
            Provide clear details about your animation project to attract the right talent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., 2D Character Animation for Mobile Game"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail..."
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements">Project Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List specific requirements, deliverables, and expectations..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Project Categories (Select up to 3)</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {ANIMATION_CATEGORIES.map((category) => (
                  <div key={category} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={category}
                      checked={formData.category.includes(category)}
                      onChange={() => handleCategorySelection(category)}
                      disabled={loading || (formData.category.length >= 3 && !formData.category.includes(category))}
                      className="h-4 w-4 text-primary rounded border-muted focus:ring-primary"
                    />
                    <Label htmlFor={category} className="text-sm cursor-pointer">
                      {category}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin">Minimum Budget</Label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  placeholder="Min"
                  value={formData.budgetMin}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax">Maximum Budget</Label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  placeholder="Max"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select 
                  value={formData.currency} 
                  onValueChange={handleCurrencyChange}
                  disabled={loading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="EUR">EUR</SelectItem>
                    <SelectItem value="GBP">GBP</SelectItem>
                    <SelectItem value="CAD">CAD</SelectItem>
                    <SelectItem value="AUD">AUD</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="deadline">Project Deadline (Optional)</Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                disabled={loading}
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting Project...
                </>
              ) : "Post Project"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostProject;
