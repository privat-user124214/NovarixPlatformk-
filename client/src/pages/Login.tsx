import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { LandingHeader } from "@/components/LandingHeader";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      try {
        console.log('Attempting login with:', data.email);
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
          credentials: "include",
        });

        if (!response.ok) {
          const errorData = await response.text();
          throw new Error(`${response.status}: ${errorData}`);
        }

        const result = await response.json();
        console.log('Login result:', result);
        return result;
      } catch (error) {
        console.error('Login fetch error:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      // Redirect to dashboard after successful login
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 100);
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message.includes("Invalid credentials") ? "Ungültige Anmeldedaten" : error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-novarix">
      <LandingHeader />
      <div className="flex items-center justify-center mobile-spacing py-8 sm:py-12 px-4 sm:px-6 lg:px-8" style={{ minHeight: 'calc(100vh - 64px)' }}>
      <Card className="w-full max-w-md bg-novarix-secondary border-novarix">
        <CardHeader className="text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-white">Novarix Studio</CardTitle>
          <CardDescription className="text-[#3c445c] text-sm sm:text-base">
            Anmelden um fortzufahren
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4 mobile-form">
            <div>
              <Label htmlFor="email" className="text-[#3c445c]">E-Mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ihre@email.de"
                className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-[#3c445c]">Passwort</Label>
              <Input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-novarix-purple hover:bg-novarix-purple-dark"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Anmelden..." : "Anmelden"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-[#3c445c]">
              Noch kein Account?{" "}
              <Link href="/register">
                <a className="text-novarix-purple hover:text-novarix-purple-light">
                  Registrieren
                </a>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
