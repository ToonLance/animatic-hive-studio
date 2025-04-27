
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CreateProfile from "./pages/CreateProfile";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PostProject from "./pages/PostProject";
import Animators from "./pages/Animators";

// Layout
import MainLayout from "./components/layout/MainLayout";

// Firebase setup
import "./lib/firebase"; // Initialize Firebase

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/profile/:username" element={<Profile />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/messages/:recipientId" element={<Messages />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/post-project" element={<PostProject />} />
              <Route path="/animators" element={<Animators />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
