
import React from "react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link to="/" className="text-xl font-bold mb-4 inline-block text-gradient animate-gradient bg-clip-text text-transparent">
              AnimaticHive
            </Link>
            <p className="text-muted-foreground mt-2">
              The premier platform connecting talented 2D animators with clients looking for quality animation work.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Animators</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/projects" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Projects
                </Link>
              </li>
              <li>
                <Link to="/create-profile" className="text-muted-foreground hover:text-foreground transition-colors">
                  Create Profile
                </Link>
              </li>
              <li>
                <Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">
                  Resources
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4">For Clients</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/animators" className="text-muted-foreground hover:text-foreground transition-colors">
                  Find Animators
                </Link>
              </li>
              <li>
                <Link to="/post-project" className="text-muted-foreground hover:text-foreground transition-colors">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How it Works
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} AnimaticHive. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="/terms" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Terms
            </Link>
            <Link to="/privacy" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Privacy
            </Link>
            <Link to="/contact" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
