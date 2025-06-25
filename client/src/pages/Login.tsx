import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const loginMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      console.log('Attempting login with:', data.email);
      const result = await apiRequest("POST", "/api/auth/login", data);
      console.log('Login result:', result);
      return result;
    },
    onSuccess: (data) => {
      console.log('Login successful:', data);
      toast({
        title: "Erfolgreich angemeldet",
        description: "Willkommen zurück!",
      });
      setTimeout(() => {
        window.location.reload();
      }, 100);
    },
    onError: (error: Error) => {
      console.error('Login error:', error);
      toast({
        title: "Anmeldung fehlgeschlagen",
        description: error.message,
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
    <div className="min-h-screen bg-novarix flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-novarix-secondary border-novarix">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Novarix Studio</CardTitle>
          <CardDescription className="text-novarix-muted">
            Anmelden um fortzufahren
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="email" className="text-novarix-text">E-Mail</Label>
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
              <Label htmlFor="password" className="text-novarix-text">Passwort</Label>
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
  );
}
