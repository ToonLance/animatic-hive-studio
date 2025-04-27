
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Menu,
  X,
  User,
  MessageCircle,
  Search,
  BriefcaseBusiness,
  LogOut
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, userProfile, signOut } = useAuth();
  const navigate = useNavigate();

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
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

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold mr-10 text-gradient animate-gradient bg-clip-text text-transparent">
              AnimaticHive
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              <Link to="/explore" className="hover:text-primary transition-colors">
                Explore
              </Link>
              <Link to="/projects" className="hover:text-primary transition-colors">
                Projects
              </Link>
              <Link to="/animators" className="hover:text-primary transition-colors">
                Find Animators
              </Link>
            </nav>
          </div>

          {/* Desktop Right Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {currentUser ? (
              <>
                <Button variant="ghost" size="icon" className="relative" asChild>
                  <Link to="/messages">
                    <MessageCircle className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-4 h-4 text-xs flex items-center justify-center">
                      2
                    </span>
                  </Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.photoURL || undefined} />
                        <AvatarFallback>{getInitials(userProfile?.displayName || userProfile?.username)}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{userProfile?.displayName || userProfile?.username || "User"}</p>
                        <p className="text-xs leading-none text-muted-foreground">{userProfile?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate(`/profile/${userProfile?.username || currentUser.uid}`)}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/messages")}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Messages</span>
                    </DropdownMenuItem>
                    {userProfile?.role === "client" && (
                      <DropdownMenuItem onClick={() => navigate("/dashboard/projects")}>
                        <BriefcaseBusiness className="mr-2 h-4 w-4" />
                        <span>My Projects</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Log in</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">Sign up</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 space-y-4 py-4">
            <Link 
              to="/explore" 
              className="block hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Explore
            </Link>
            <Link 
              to="/projects" 
              className="block hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Projects
            </Link>
            <Link 
              to="/animators" 
              className="block hover:text-primary transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find Animators
            </Link>
            
            <div className="pt-4 border-t border-border">
              {currentUser ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={userProfile?.photoURL || undefined} />
                      <AvatarFallback>{getInitials(userProfile?.displayName || userProfile?.username)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{userProfile?.displayName || userProfile?.username || "User"}</p>
                      <p className="text-xs text-muted-foreground">{userProfile?.email}</p>
                    </div>
                  </div>
                  
                  <Link 
                    to={`/profile/${userProfile?.username || currentUser.uid}`} 
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                  
                  <Link 
                    to="/messages" 
                    className="flex items-center py-2 hover:text-primary"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Messages
                  </Link>
                  
                  {userProfile?.role === "client" && (
                    <Link 
                      to="/dashboard/projects" 
                      className="flex items-center py-2 hover:text-primary"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <BriefcaseBusiness className="mr-2 h-4 w-4" />
                      My Projects
                    </Link>
                  )}
                  
                  <button 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }} 
                    className="flex items-center py-2 hover:text-primary w-full text-left"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="grid gap-4">
                  <Button variant="outline" asChild>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Log in
                    </Link>
                  </Button>
                  <Button asChild>
                    <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>
                      Sign up
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};
