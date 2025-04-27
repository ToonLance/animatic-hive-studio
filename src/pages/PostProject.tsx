
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Calendar, DollarSign } from "lucide-react";
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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
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
        
        // Clear category error if any
        if (errors.category) {
          setErrors(prev => ({
            ...prev,
            category: ""
          }));
        }
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = "Project title is required";
    }
    
    if (!formData.description.trim()) {
      newErrors.description = "Project description is required";
    }
    
    if (!formData.requirements.trim()) {
      newErrors.requirements = "Project requirements are required";
    }
    
    if (formData.category.length === 0) {
      newErrors.category = "Please select at least one category";
    }
    
    const budgetMin = parseFloat(formData.budgetMin);
    const budgetMax = parseFloat(formData.budgetMax);
    
    if (!formData.budgetMin || isNaN(budgetMin)) {
      newErrors.budgetMin = "Please enter a valid minimum budget";
    }
    
    if (!formData.budgetMax || isNaN(budgetMax)) {
      newErrors.budgetMax = "Please enter a valid maximum budget";
    }
    
    if (budgetMin > budgetMax) {
      newErrors.budgetMin = "Minimum budget cannot be greater than maximum budget";
    }
    
    if (formData.deadline) {
      const selectedDate = new Date(formData.deadline);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        newErrors.deadline = "Deadline cannot be in the past";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
    
    if (!validateForm()) {
      toast({
        title: "Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      });
      return;
    }
    
    const budgetMin = parseFloat(formData.budgetMin);
    const budgetMax = parseFloat(formData.budgetMax);
    
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
      
      // Reset form
      setFormData({
        title: "",
        description: "",
        requirements: "",
        category: [],
        budgetMin: "",
        budgetMax: "",
        currency: "USD",
        deadline: ""
      });
      
      navigate(`/projects/${projectRef.id}`);
    } catch (error) {
      console.error("Error posting project:", error);
      toast({
        title: "Error",
        description: "Failed to post project. Please try again.",
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
              <Label htmlFor="title" className={errors.title ? "text-destructive" : ""}>Project Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="E.g., 2D Character Animation for Mobile Game"
                value={formData.title}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.title ? "border-destructive" : ""}
              />
              {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className={errors.description ? "text-destructive" : ""}>Project Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your project in detail..."
                value={formData.description}
                onChange={handleInputChange}
                rows={5}
                disabled={loading}
                className={errors.description ? "border-destructive" : ""}
              />
              {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="requirements" className={errors.requirements ? "text-destructive" : ""}>Project Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List specific requirements, deliverables, and expectations..."
                value={formData.requirements}
                onChange={handleInputChange}
                rows={3}
                disabled={loading}
                className={errors.requirements ? "border-destructive" : ""}
              />
              {errors.requirements && <p className="text-sm text-destructive">{errors.requirements}</p>}
            </div>
            
            <div className="space-y-2">
              <Label className={errors.category ? "text-destructive" : ""}>Project Categories (Select up to 3)</Label>
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
              {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="budgetMin" className={errors.budgetMin ? "text-destructive" : ""}>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" /> Minimum Budget
                  </div>
                </Label>
                <Input
                  id="budgetMin"
                  name="budgetMin"
                  type="number"
                  placeholder="Min"
                  value={formData.budgetMin}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.budgetMin ? "border-destructive" : ""}
                />
                {errors.budgetMin && <p className="text-sm text-destructive">{errors.budgetMin}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetMax" className={errors.budgetMax ? "text-destructive" : ""}>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1" /> Maximum Budget
                  </div>
                </Label>
                <Input
                  id="budgetMax"
                  name="budgetMax"
                  type="number"
                  placeholder="Max"
                  value={formData.budgetMax}
                  onChange={handleInputChange}
                  disabled={loading}
                  className={errors.budgetMax ? "border-destructive" : ""}
                />
                {errors.budgetMax && <p className="text-sm text-destructive">{errors.budgetMax}</p>}
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
              <Label htmlFor="deadline" className={errors.deadline ? "text-destructive" : ""}>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Project Deadline (Optional)
                </div>
              </Label>
              <Input
                id="deadline"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleInputChange}
                disabled={loading}
                className={errors.deadline ? "border-destructive" : ""}
              />
              {errors.deadline && <p className="text-sm text-destructive">{errors.deadline}</p>}
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
