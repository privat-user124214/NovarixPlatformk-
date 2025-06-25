import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserPlus, StickyNote, Trash, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { canAddTeamMembers, canAddAdmins, canDeleteMembers } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface TeamMember {
  id: number;
  email: string;
  role: string;
  notes?: string;
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

interface AddMemberForm {
  email: string;
  role: string;
  notes: string;
}

export default function Team() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState("");
  
  const [newMember, setNewMember] = useState<AddMemberForm>({
    email: "",
    role: "dev",
    notes: "",
  });

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    enabled: !!user && canAddTeamMembers(user.role),
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: AddMemberForm) => apiRequest("POST", "/api/team", data),
    onSuccess: (response: any) => {
      toast({
        title: "Team-Mitglied hinzugefügt",
        description: `Temporäres Passwort: ${response.tempPassword}`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setAddMemberOpen(false);
      setNewMember({ email: "", role: "dev", notes: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }: { id: number; notes: string }) =>
      apiRequest("PATCH", `/api/team/${id}/notes`, { notes }),
    onSuccess: () => {
      toast({
        title: "Notizen aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setEditingNotes(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteMemberMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/team/${id}`),
    onSuccess: () => {
      toast({
        title: "Mitglied entfernt",
        description: "Das Team-Mitglied wurde erfolgreich entfernt.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getRoleColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-red-100 text-red-800";
      case "admin":
        return "bg-yellow-100 text-yellow-800";
      case "dev":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getRoleText = (role: string) => {
    switch (role) {
      case "owner":
        return "Owner";
      case "admin":
        return "Admin";
      case "dev":
        return "Developer";
      default:
        return role;
    }
  };

  const getInitials = (member: TeamMember) => {
    if (member.firstName && member.lastName) {
      return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
    }
    return member.email.substring(0, 2).toUpperCase();
  };

  const startEditingNotes = (member: TeamMember) => {
    setEditingNotes(member.id);
    setNotesValue(member.notes || "");
  };

  const saveNotes = (memberId: number) => {
    updateNotesMutation.mutate({ id: memberId, notes: notesValue });
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNotesValue("");
  };

  if (!user || !canAddTeamMembers(user.role)) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/20 border-red-500">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white">Zugriff verweigert</h3>
            <p className="text-novarix-text mt-1">
              Sie haben keine Berechtigung, das Team zu verwalten.
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Team Management</h2>
        <Dialog open={addMemberOpen} onOpenChange={setAddMemberOpen}>
          <DialogTrigger asChild>
            <Button className="bg-novarix-purple hover:bg-novarix-purple-dark">
              <UserPlus className="mr-2 h-4 w-4" />
              Team-Mitglied hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-novarix-secondary border-novarix">
            <DialogHeader>
              <DialogTitle className="text-white">Neues Team-Mitglied hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-novarix-text">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="neues.mitglied@email.de"
                  className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                />
              </div>
              
              <div>
                <Label htmlFor="role" className="text-novarix-text">Rolle *</Label>
                <Select value={newMember.role} onValueChange={(value) => setNewMember(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger className="bg-novarix-tertiary border-novarix text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dev">Developer</SelectItem>
                    {canAddAdmins(user.role) && <SelectItem value="admin">Admin</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-novarix-text">Notizen</Label>
                <Textarea
                  id="notes"
                  value={newMember.notes}
                  onChange={(e) => setNewMember(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optionale Notizen zum Mitglied..."
                  className="bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                  rows={3}
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setAddMemberOpen(false)}
                  className="border-novarix text-novarix-text hover:bg-novarix-tertiary"
                >
                  Abbrechen
                </Button>
                <Button
                  onClick={() => addMemberMutation.mutate(newMember)}
                  disabled={addMemberMutation.isPending || !newMember.email}
                  className="bg-novarix-purple hover:bg-novarix-purple-dark"
                >
                  {addMemberMutation.isPending ? "Hinzufügen..." : "Hinzufügen"}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-novarix-secondary border-novarix mb-6">
        <CardHeader>
          <CardTitle className="text-white">Team-Mitglieder</CardTitle>
        </CardHeader>
        <CardContent>
          {teamMembers.length > 0 ? (
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="border border-novarix rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-novarix-purple rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">{getInitials(member)}</span>
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">{member.email}</h4>
                        <div className="flex items-center space-x-2">
                          <Badge className={getRoleColor(member.role)}>
                            {getRoleText(member.role)}
                          </Badge>
                          <span className="text-xs text-novarix-muted">
                            Beigetreten: {new Date(member.createdAt).toLocaleDateString("de-DE")}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditingNotes(member)}
                        className="border-novarix text-novarix-text hover:bg-novarix-tertiary"
                        title="Notizen bearbeiten"
                      >
                        <StickyNote className="h-4 w-4" />
                      </Button>
                      {canDeleteMembers(user.role) && member.id !== user.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteMemberMutation.mutate(member.id)}
                          disabled={deleteMemberMutation.isPending}
                          className="border-red-500 text-red-500 hover:bg-red-500/20"
                          title="Mitglied entfernen"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-novarix-tertiary rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-novarix-muted">Notizen:</span>
                      {editingNotes === member.id && (
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => saveNotes(member.id)}
                            disabled={updateNotesMutation.isPending}
                            className="bg-green-600 hover:bg-green-700 h-6 px-2 text-xs"
                          >
                            Speichern
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditingNotes}
                            className="border-novarix text-novarix-text hover:bg-novarix h-6 px-2 text-xs"
                          >
                            Abbrechen
                          </Button>
                        </div>
                      )}
                    </div>
                    {editingNotes === member.id ? (
                      <Textarea
                        value={notesValue}
                        onChange={(e) => setNotesValue(e.target.value)}
                        className="bg-novarix border-novarix text-white placeholder:text-novarix-muted"
                        rows={3}
                      />
                    ) : (
                      <div className="text-sm text-novarix-text">
                        {member.notes || "Keine Notizen vorhanden"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <User className="h-12 w-12 text-novarix-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Team-Mitglieder</h3>
              <p className="text-novarix-text">Fügen Sie Ihr erstes Team-Mitglied hinzu.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Permissions Info */}
      <Card className="bg-novarix-secondary border-novarix">
        <CardHeader>
          <CardTitle className="text-white">Berechtigungen nach Rollen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h5 className="font-medium text-red-400 mb-2">Owner</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Admins hinzufügen</li>
                <li>• Kann Devs hinzufügen</li>
                <li>• Kann Mitglieder entfernen</li>
                <li>• Vollzugriff auf alle Funktionen</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-yellow-400 mb-2">Admin</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Devs hinzufügen</li>
                <li>• Kann Aufträge verwalten</li>
                <li>• Kann Notizen bearbeiten</li>
                <li>• Begrenzte Verwaltungsrechte</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-400 mb-2">Developer</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Aufträge einsehen</li>
                <li>• Kann Auftragsstatus ändern</li>
                <li>• Kann Notizen hinzufügen</li>
                <li>• Grundlegende Berechtigung</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
