import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Register() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
  });

  const registerMutation = useMutation({
    mutationFn: (data: Omit<typeof formData, "confirmPassword">) => 
      apiRequest("POST", "/api/auth/register", data),
    onSuccess: () => {
      toast({
        title: "Registrierung erfolgreich",
        description: "Willkommen bei Novarix Studio!",
      });
      window.location.reload();
    },
    onError: (error: Error) => {
      toast({
        title: "Registrierung fehlgeschlagen",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Passwörter stimmen nicht überein",
        variant: "destructive",
      });
      return;
    }

    if (formData.password.length < 6) {
      toast({
        title: "Fehler",
        description: "Passwort muss mindestens 6 Zeichen lang sein",
        variant: "destructive",
      });
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    registerMutation.mutate(submitData);
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
            Registrieren Sie sich für ein neues Konto
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName" className="text-[#3c445c]">Vorname</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Max"
                  className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                />
              </div>
              <div>
                <Label htmlFor="lastName" className="text-[#3c445c]">Nachname</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Mustermann"
                  className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                />
              </div>
            </div>
            
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
            
            <div>
              <Label htmlFor="confirmPassword" className="text-[#3c445c]">Passwort bestätigen</Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-novarix-purple hover:bg-novarix-purple-dark"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? "Registrieren..." : "Registrieren"}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-novarix-muted">
              Bereits ein Account?{" "}
              <Link href="/login">
                <a className="text-novarix-purple hover:text-novarix-purple-light">
                  Anmelden
                </a>
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
