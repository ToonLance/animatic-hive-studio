
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, googleProvider, db } from "../lib/firebase";
import { useToast } from "@/components/ui/use-toast";

type UserRole = "freelancer" | "client" | null;

interface UserProfile {
  uid: string;
  username: string | null;
  role: UserRole;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  bio: string | null;
  skills: string[];
  portfolio: string[];
  createdAt: Date;
}

interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  userLoading: boolean;
  profileLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (role: UserRole) => Promise<void>;
  setUsername: (username: string) => Promise<boolean>;
  updateUserProfile: (profileData: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserLoading(false);

      if (user) {
        try {
          await fetchUserProfile(user.uid);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      } else {
        setUserProfile(null);
        setProfileLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUserProfile = async (uid: string) => {
    setProfileLoading(true);
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data() as UserProfile);
      } else {
        setUserProfile(null);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast({
        title: "Error",
        description: "Failed to load your profile",
        variant: "destructive",
      });
    } finally {
      setProfileLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user profile exists
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        // This is a new user, redirect to role selection
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          username: null,
          role: null,
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          bio: null,
          skills: [],
          portfolio: [],
          createdAt: new Date(),
        });
      }
      
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      console.error("Error signing in with Google:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in with Google",
        variant: "destructive",
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Success",
        description: "Signed in successfully",
      });
    } catch (error: any) {
      console.error("Error signing in with email:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign in",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;
      
      // Create new user profile
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        username: null,
        role,
        displayName: null,
        email: user.email,
        photoURL: null,
        bio: null,
        skills: [],
        portfolio: [],
        createdAt: new Date(),
      });
      
      toast({
        title: "Success",
        description: "Account created successfully",
      });
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      toast({
        title: "Success",
        description: "Signed out successfully",
      });
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const setUserRole = async (role: UserRole) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { role }, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, role } : null);
      
      toast({
        title: "Success",
        description: `Your role is now set as ${role}`,
      });
    } catch (error: any) {
      console.error("Error setting user role:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set user role",
        variant: "destructive",
      });
    }
  };

  const setUsername = async (username: string) => {
    if (!currentUser) return false;
    
    try {
      // Check if username is already taken
      const usernameQuery = doc(db, "usernames", username.toLowerCase());
      const usernameSnapshot = await getDoc(usernameQuery);
      
      if (usernameSnapshot.exists()) {
        toast({
          title: "Error",
          description: "This username is already taken",
          variant: "destructive",
        });
        return false;
      }
      
      // Set the username
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, { username }, { merge: true });
      
      // Reserve the username
      await setDoc(doc(db, "usernames", username.toLowerCase()), {
        uid: currentUser.uid
      });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, username } : null);
      
      toast({
        title: "Success",
        description: "Username set successfully",
      });
      return true;
    } catch (error: any) {
      console.error("Error setting username:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to set username",
        variant: "destructive",
      });
      return false;
    }
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, "users", currentUser.uid);
      await setDoc(userRef, profileData, { merge: true });
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, ...profileData } : null);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error: any) {
      console.error("Error updating user profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    userLoading,
    profileLoading,
    signInWithGoogle,
    signInWithEmail,
    signUp,
    signOut,
    setUserRole,
    setUsername,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
