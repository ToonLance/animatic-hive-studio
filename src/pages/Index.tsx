
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowRight, 
  ArrowRight as ArrowRightIcon,
  Video, 
  Brush, 
  Layers, 
  MessageCircle, 
  Briefcase, 
  Users, 
  Check, 
  Star 
} from "lucide-react";

const Index = () => {
  const { currentUser, userProfile } = useAuth();
  
  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Connect with the best <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">2D animators</span> around the world
              </h1>
              <p className="text-lg text-muted-foreground">
                AnimaticHive is the premier platform connecting talented 2D animators with clients looking for quality animation work.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild className="px-8" size="lg">
                  <Link to="/projects">Find Projects</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/animators">Hire Animators</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] flex items-center justify-center">
              <div className="absolute w-[300px] h-[300px] bg-primary/20 rounded-full filter blur-3xl animate-pulse"></div>
              <Card className="w-[280px] h-[280px] backdrop-blur-sm bg-black/50 border-primary/50 p-2 rotate-3 animate-float">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                  {/* Replace with animation showcase image */}
                  <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                    <Video className="h-16 w-16 text-primary/70" />
                  </div>
                </CardContent>
              </Card>
              <Card className="absolute bottom-10 right-0 w-[200px] h-[180px] backdrop-blur-sm bg-black/50 border-secondary/50 p-2 -rotate-6 animate-float">
                <CardContent className="p-0 h-full rounded-lg overflow-hidden">
                  {/* Replace with another animation showcase image */}
                  <div className="w-full h-full bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                    <Brush className="h-12 w-12 text-secondary/70" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-accent/10">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why AnimaticHive?</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Our platform is specifically designed for 2D animation projects, ensuring that both clients and animators have the tools they need to succeed.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Brush className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Specialized Platform</h3>
              <p className="text-muted-foreground">
                Built specifically for 2D animation, not a generic freelancing site.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-muted-foreground">
                Message and collaborate with animators and clients in real-time.
              </p>
            </div>
            <div className="flex flex-col items-center text-center p-6 rounded-lg bg-card shadow-sm">
              <div className="p-3 rounded-full bg-primary/10 mb-4">
                <Layers className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Portfolio Showcase</h3>
              <p className="text-muted-foreground">
                Animators can showcase their best work to attract quality clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-16 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How it Works</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              Getting started on AnimaticHive is simple, whether you're looking to hire an animator or find animation projects.
            </p>
          </div>
          
          {/* For Clients */}
          <div className="mb-16">
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <Briefcase className="mr-3 h-6 w-6 text-primary" />
              For Clients
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Post Your Project</h4>
                    <p className="text-muted-foreground text-sm">
                      Describe your animation needs, budget, and timeline to attract the right talent.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Review Applicants</h4>
                    <p className="text-muted-foreground text-sm">
                      Browse animator profiles, portfolios, and reviews to find the perfect match.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-primary text-primary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Collaborate & Complete</h4>
                    <p className="text-muted-foreground text-sm">
                      Work directly with your chosen animator through our platform until project completion.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild>
                <Link to="/post-project">
                  Post a Project <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          
          {/* For Animators */}
          <div>
            <h3 className="text-2xl font-semibold mb-8 flex items-center">
              <Brush className="mr-3 h-6 w-6 text-secondary" />
              For Animators
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-secondary text-secondary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  1
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Create Your Profile</h4>
                    <p className="text-muted-foreground text-sm">
                      Showcase your skills, experience, and portfolio to stand out to potential clients.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-secondary text-secondary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  2
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Browse Projects</h4>
                    <p className="text-muted-foreground text-sm">
                      Find animation projects that match your skills, interests, and availability.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-0 -mt-2 rounded-full bg-secondary text-secondary-foreground w-8 h-8 flex items-center justify-center font-bold">
                  3
                </div>
                <Card className="pt-8">
                  <CardContent>
                    <h4 className="font-semibold mb-2">Apply & Deliver</h4>
                    <p className="text-muted-foreground text-sm">
                      Submit proposals for projects you're interested in and deliver exceptional work.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="secondary">
                <Link to="/projects">
                  Find Projects <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-accent/10">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground max-w-3xl mx-auto">
              See how AnimaticHive has helped clients and animators achieve their goals.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Studio Animated</h4>
                    <p className="text-sm text-muted-foreground">Animation Studio</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "We've been able to find exceptional animation talent on AnimaticHive that perfectly suits our studio's style and project needs. The platform's focus on animation makes the hiring process much more efficient."
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="rounded-full bg-secondary/10 w-12 h-12 flex items-center justify-center">
                    <Brush className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Sarah K.</h4>
                    <p className="text-sm text-muted-foreground">Freelance Animator</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Since joining AnimaticHive, I've been able to focus on the types of animation projects I'm passionate about. The direct communication with clients and specialized platform has helped me grow my freelance animation business."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20">
        <div className="container px-4 md:px-6">
          <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-primary/80 to-secondary/80 p-10 text-center">
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(68,68,68,.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-shimmer"></div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to bring your animations to life?</h2>
            <p className="text-lg text-white/90 mb-6">
              Join AnimaticHive today and connect with the perfect animation talent for your project.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!currentUser ? (
                <>
                  <Button asChild size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                    <Link to="/signup">Sign Up Now</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/20">
                    <Link to="/projects">Browse Projects</Link>
                  </Button>
                </>
              ) : (
                <Button asChild size="lg" variant="default" className="bg-white text-primary hover:bg-white/90">
                  <Link to={userProfile?.role === "client" ? "/post-project" : "/projects"}>
                    {userProfile?.role === "client" ? "Post a Project" : "Find Projects"}
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
