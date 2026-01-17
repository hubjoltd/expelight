import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();
  const { login, isLoggingIn } = useAuth();
  const { mergeLocalCartToServer } = useCart();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast({ title: "Please fill in all fields", variant: "destructive" });
      return;
    }

    try {
      await login(formData);
      // Merge guest cart items to server after successful login
      await mergeLocalCartToServer();
      toast({ title: "Welcome back!" });
      setLocation("/");
    } catch (error: any) {
      toast({ 
        title: error?.message || "Login failed", 
        variant: "destructive" 
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505]" data-testid="login-page">
      <Header />

      <main className="pt-24 pb-20 flex items-center justify-center min-h-screen">
        <div className="w-full max-w-md mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-[#0a0a0a] border-zinc-800/30 p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-zinc-500">Sign in to your account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="username" className="text-zinc-400">
                    Username or Email
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    className="mt-1.5 bg-zinc-900 border-zinc-800 text-white"
                    placeholder="Enter your username or email"
                    autoComplete="username"
                    data-testid="input-username"
                  />
                </div>

                <div>
                  <Label htmlFor="password" className="text-zinc-400">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="mt-1.5 bg-zinc-900 border-zinc-800 text-white pr-10"
                      placeholder="Enter your password"
                      autoComplete="current-password"
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-1.5 text-zinc-500 hover:text-zinc-300"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 h-12"
                  disabled={isLoggingIn}
                  data-testid="button-login"
                >
                  {isLoggingIn ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-zinc-500">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline" data-testid="link-signup">
                    Sign up
                  </Link>
                </p>
              </div>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
