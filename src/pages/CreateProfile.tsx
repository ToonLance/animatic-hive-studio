
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import type { UserRole } from "@/types";

const CreateProfile = () => {
  const { currentUser, userProfile, profileLoading, setUsername, setUserRole, updateUserProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: "",
    username: "",
    bio: "",
    role: null as UserRole | null, // Fixed: Initialize with null instead of empty string
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!profileLoading && userProfile) {
      setFormData({
        displayName: userProfile.displayName || "",
        username: userProfile.username || "",
        bio: userProfile.bio || "",
        role: userProfile.role || null, // Use null as fallback instead of empty string
      });
    }
  }, [userProfile, profileLoading]);

  if (profileLoading) {
    return (
      <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      role: value as UserRole,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.displayName || !formData.username || !formData.role) {
      toast({
        title: "Error",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Set username if it's changed or new
      if (!userProfile?.username || userProfile.username !== formData.username) {
        const usernameSet = await setUsername(formData.username);
        if (!usernameSet) {
          setLoading(false);
          return;
        }
      }
      
      // Set role if it's changed or new
      if (!userProfile?.role || userProfile.role !== formData.role) {
        await setUserRole(formData.role);
      }
      
      // Update other profile data
      await updateUserProfile({
        displayName: formData.displayName,
        bio: formData.bio,
      });
      
      toast({
        title: "Success",
        description: "Profile created successfully",
      });
      
      // Redirect based on role
      if (formData.role === "freelancer") {
        navigate("/freelancer-onboarding");
      } else {
        navigate("/client-dashboard");
      }
      
    } catch (error) {
      console.error("Error creating profile:", error);
      toast({
        title: "Error",
        description: "Failed to create profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-9rem)] items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Create Your Profile</CardTitle>
          <CardDescription className="text-center">
            Set up your personal information to get started
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                name="displayName"
                placeholder="Your full name"
                value={formData.displayName}
                onChange={handleInputChange}
                required
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center">
                <span className="bg-muted px-3 py-2 rounded-l-md border border-r-0 border-input">
                  @
                </span>
                <Input
                  id="username"
                  name="username"
                  placeholder="unique_username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="rounded-l-none"
                  required
                  disabled={loading || !!userProfile?.username}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                This will be your profile URL: animatichive.com/profile/@{formData.username || "username"}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself..."
                value={formData.bio || ""}
                onChange={handleInputChange}
                rows={4}
                disabled={loading}
              />
            </div>
            
            <div className="space-y-2">
              <Label>I am a:</Label>
              <RadioGroup value={formData.role || "freelancer"} onValueChange={handleRoleChange}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="freelancer" id="freelancer" disabled={loading} />
                  <Label htmlFor="freelancer" className="cursor-pointer">Animator / Freelancer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="client" disabled={loading} />
                  <Label htmlFor="client" className="cursor-pointer">Client / Hiring Manager</Label>
                </div>
              </RadioGroup>
            </div>
            
            <Button 
              type="submit" 
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : "Save Profile"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-xs text-muted-foreground text-center">
            You can update your profile information later in your account settings.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CreateProfile;
