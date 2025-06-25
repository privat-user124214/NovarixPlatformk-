
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Trash, Shield, Plus } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { canAddAdmins } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function IPManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newIP, setNewIP] = useState("");

  const { data: blacklistedIPs = [], isLoading } = useQuery<string[]>({
    queryKey: ["/api/admin/blacklisted-ips"],
    enabled: !!user && canAddAdmins(user.role),
  });

  const addIPMutation = useMutation({
    mutationFn: (ip: string) => apiRequest("POST", "/api/admin/blacklist-ip", { ip }),
    onSuccess: () => {
      toast({
        title: "IP gesperrt",
        description: "Die IP-Adresse wurde zur Blacklist hinzugefügt.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blacklisted-ips"] });
      setNewIP("");
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const removeIPMutation = useMutation({
    mutationFn: (ip: string) => apiRequest("DELETE", `/api/admin/blacklist-ip/${encodeURIComponent(ip)}`),
    onSuccess: () => {
      toast({
        title: "IP entsperrt",
        description: "Die IP-Adresse wurde von der Blacklist entfernt.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blacklisted-ips"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (!user || !canAddAdmins(user.role)) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/20 border-red-500">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white">Zugriff verweigert</h3>
            <p className="text-novarix-text mt-1">
              Sie haben keine Berechtigung, IP-Adressen zu verwalten.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-novarix-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">IP-Adressen Verwaltung</h2>
        <p className="text-novarix-text">
          Verwalten Sie gesperrte IP-Adressen und überwachen Sie VPN-Verbindungen
        </p>
      </div>

      {/* Add IP Form */}
      <Card className="bg-novarix-secondary border-novarix mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            IP-Adresse sperren
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="ip" className="text-novarix-text">IP-Adresse</Label>
              <Input
                id="ip"
                value={newIP}
                onChange={(e) => setNewIP(e.target.value)}
                placeholder="192.168.1.1"
                className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
              />
            </div>
            <div className="flex items-end">
              <Button
                onClick={() => addIPMutation.mutate(newIP)}
                disabled={addIPMutation.isPending || !newIP}
                className="bg-red-600 hover:bg-red-700"
              >
                <Plus className="mr-2 h-4 w-4" />
                {addIPMutation.isPending ? "Sperren..." : "Sperren"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Blacklisted IPs */}
      <Card className="bg-novarix-secondary border-novarix">
        <CardHeader>
          <CardTitle className="text-white">Gesperrte IP-Adressen</CardTitle>
        </CardHeader>
        <CardContent>
          {blacklistedIPs.length > 0 ? (
            <div className="space-y-2">
              {blacklistedIPs.map((ip) => (
                <div key={ip} className="flex items-center justify-between border border-novarix rounded-lg p-3">
                  <span className="text-white font-mono">{ip}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeIPMutation.mutate(ip)}
                    disabled={removeIPMutation.isPending}
                    className="border-red-500 text-red-500 hover:bg-red-500/20"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Shield className="h-12 w-12 text-novarix-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine gesperrten IPs</h3>
              <p className="text-novarix-text">Alle IP-Adressen haben derzeit Zugriff.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-novarix-secondary border-novarix mt-6">
        <CardHeader>
          <CardTitle className="text-white">VPN & Proxy Erkennung</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-novarix-text space-y-2">
            <p>• VPN- und Proxy-Verbindungen werden automatisch erkannt und blockiert</p>
            <p>• Das System verwendet vpnapi.io für die Erkennung</p>
            <p>• Bei Problemen mit dem Service werden Verbindungen zugelassen</p>
            <p>• Team-Mitglieder können weiterhin Aufträge erstellen</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
