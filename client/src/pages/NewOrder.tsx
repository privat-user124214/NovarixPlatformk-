import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CloudUpload, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface UserStats {
  thisMonth: number;
  active: number;
  completed: number;
}

export default function NewOrder() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    discordName: "",
    botName: "",
    description: "",
    acceptTerms: false,
  });

  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const createOrderMutation = useMutation({
    mutationFn: (data: typeof formData) => 
      apiRequest("POST", "/api/orders", data),
    onSuccess: () => {
      toast({
        title: "Auftrag erfolgreich eingereicht",
        description: "Sie werden zur Übersicht weitergeleitet.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/stats"] });
      setLocation("/orders");
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler beim Erstellen des Auftrags",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.acceptTerms) {
      toast({
        title: "Fehler",
        description: "Sie müssen die AGB und Datenschutzbestimmungen akzeptieren",
        variant: "destructive",
      });
      return;
    }

    if (formData.description.length < 50) {
      toast({
        title: "Fehler",
        description: "Die Beschreibung muss mindestens 50 Zeichen lang sein",
        variant: "destructive",
      });
      return;
    }

    createOrderMutation.mutate(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Check if user has reached monthly limit
  const hasReachedLimit = stats?.thisMonth >= 3;

  if (hasReachedLimit) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/20 border-red-500 max-w-2xl mx-auto">
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-white">Monatslimit erreicht</h3>
                <p className="text-novarix-text mt-1">
                  Sie haben bereits 3 Aufträge diesen Monat erstellt. Das ist das Maximum pro Monat.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-white mb-6">Neuen Bot-Auftrag erstellen</h2>
        
        {/* Monthly limit warning */}
        {stats && stats.thisMonth === 2 && (
          <Card className="mb-6 bg-yellow-500/20 border-yellow-500">
            <CardContent className="p-4">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />
                <p className="text-sm text-novarix-text">
                  Dies ist Ihr letzter verfügbarer Auftrag für diesen Monat (2/3 verwendet).
                </p>
              </div>
            </CardContent>
          </Card>
        )}
        
        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="discordName" className="text-novarix-text">Discord Name *</Label>
                  <Input
                    id="discordName"
                    name="discordName"
                    required
                    value={formData.discordName}
                    onChange={handleChange}
                    placeholder="@username#1234"
                    className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                  />
                </div>
                <div>
                  <Label htmlFor="botName" className="text-novarix-text">Bot Name *</Label>
                  <Input
                    id="botName"
                    name="botName"
                    required
                    value={formData.botName}
                    onChange={handleChange}
                    placeholder="Mein Awesome Bot"
                    className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="botLogo" className="text-novarix-text">Bot Logo/Icon</Label>
                <div className="flex items-center justify-center w-full mt-2">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-novarix border-dashed rounded-lg cursor-pointer bg-novarix-tertiary hover:bg-novarix">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <CloudUpload className="h-8 w-8 text-novarix-muted mb-2" />
                      <p className="mb-2 text-sm text-novarix-muted">
                        <span className="font-semibold">Klicken zum Hochladen</span> oder ziehen Sie die Datei hierher
                      </p>
                      <p className="text-xs text-novarix-muted">PNG, JPG oder GIF (MAX. 2MB)</p>
                    </div>
                    <input type="file" className="hidden" accept="image/*" />
                  </label>
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="text-novarix-text">
                  Ausführliche Funktionsbeschreibung * (mindestens 50 Zeichen)
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Beschreiben Sie detailliert die gewünschten Funktionen Ihres Bots (z.B. Security-System mit Auto-Moderation, Warn-System, Verifizierung, etc.)"
                  className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                />
                <p className="text-xs text-novarix-muted mt-1">
                  {formData.description.length}/50 Zeichen minimum
                </p>
              </div>

              <Card className="bg-novarix-tertiary border-novarix">
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-white">Wichtiger Hinweis</h4>
                      <p className="text-sm text-novarix-text mt-1">
                        Bei jedem Auftrag ist unsere Branding-Werbung verpflichtend und darf nicht entfernt werden.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="acceptTerms"
                  checked={formData.acceptTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, acceptTerms: checked === true }))
                  }
                  className="border-novarix data-[state=checked]:bg-novarix-purple"
                />
                <Label htmlFor="acceptTerms" className="text-sm text-novarix-text">
                  Ich akzeptiere die{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/legal")}
                    className="text-novarix-purple hover:text-novarix-purple-light underline"
                  >
                    AGB
                  </button>
                  {" "}und{" "}
                  <button
                    type="button"
                    onClick={() => setLocation("/legal")}
                    className="text-novarix-purple hover:text-novarix-purple-light underline"
                  >
                    Datenschutzbestimmungen
                  </button>
                </Label>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="border-novarix text-novarix-text hover:bg-novarix-tertiary"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  disabled={createOrderMutation.isPending || !formData.acceptTerms}
                  className="bg-novarix-purple hover:bg-novarix-purple-dark"
                >
                  {createOrderMutation.isPending ? "Wird eingereicht..." : "Auftrag einreichen"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
