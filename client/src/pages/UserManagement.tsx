
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { UserPlus, StickyNote, Trash, User, Shield, ShieldOff, UserCog, Search } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { canAddTeamMembers, canAddAdmins, canDeleteMembers, canBlacklistMembers, canChangeRoles } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface User {
  id: number;
  email: string;
  role: string;
  notes?: string;
  blacklisted?: boolean;
  createdAt: string;
  firstName?: string;
  lastName?: string;
}

interface AddMemberForm {
  email: string;
  role: string;
  notes: string;
}

export default function UserManagement() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [editingNotes, setEditingNotes] = useState<number | null>(null);
  const [notesValue, setNotesValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  
  const [newMember, setNewMember] = useState<AddMemberForm>({
    email: "",
    role: "customer",
    notes: "",
  });

  const { data: users = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!user && (user.role === "admin" || user.role === "owner"),
  });

  const addMemberMutation = useMutation({
    mutationFn: (data: AddMemberForm) => apiRequest("POST", "/api/users", data),
    onSuccess: (response: any) => {
      toast({
        title: "Benutzer hinzugefügt",
        description: response.tempPassword ? `Temporäres Passwort: ${response.tempPassword}` : "Benutzer erfolgreich hinzugefügt",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setAddMemberOpen(false);
      setNewMember({ email: "", role: "customer", notes: "" });
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
      apiRequest("PATCH", `/api/users/${id}/notes`, { notes }),
    onSuccess: () => {
      toast({
        title: "Notizen aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
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

  const blacklistMutation = useMutation({
    mutationFn: ({ id, blacklisted }: { id: number; blacklisted: boolean }) =>
      apiRequest("PATCH", `/api/users/${id}/blacklist`, { blacklisted }),
    onSuccess: () => {
      toast({
        title: "Blacklist Status aktualisiert",
        description: "Der Blacklist-Status wurde erfolgreich geändert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const roleChangeMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: string }) =>
      apiRequest("PATCH", `/api/users/${id}/role`, { role }),
    onSuccess: () => {
      toast({
        title: "Rolle geändert",
        description: "Die Benutzerrolle wurde erfolgreich aktualisiert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
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
    mutationFn: (id: number) => apiRequest("DELETE", `/api/users/${id}`),
    onSuccess: () => {
      toast({
        title: "Benutzer entfernt",
        description: "Der Benutzer wurde erfolgreich entfernt.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/users"] });
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
        return "bg-red-200 text-red-800";
      case "admin":
        return "bg-yellow-200 text-yellow-800";
      case "dev":
        return "bg-blue-200 text-blue-800";
      case "customer":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
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
      case "customer":
        return "Kunde";
      default:
        return role;
    }
  };

  const getInitials = (member: User) => {
    if (member.firstName && member.lastName) {
      return `${member.firstName[0]}${member.lastName[0]}`.toUpperCase();
    }
    return member.email.substring(0, 2).toUpperCase();
  };

  const startEditingNotes = (member: User) => {
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

  const toggleBlacklist = (memberId: number, currentStatus: boolean) => {
    blacklistMutation.mutate({ id: memberId, blacklisted: !currentStatus });
  };

  const changeRole = (memberId: number, newRole: string) => {
    roleChangeMutation.mutate({ id: memberId, role: newRole });
  };

  // Filter users based on search term and role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (u.firstName && u.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (u.lastName && u.lastName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (!user || (user.role !== "admin" && user.role !== "owner")) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/20 border-red-500">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white">Zugriff verweigert</h3>
            <p className="text-novarix-text mt-1">
              Sie haben keine Berechtigung, Benutzer zu verwalten.
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
              Benutzer hinzufügen
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-novarix-secondary border-novarix">
            <DialogHeader>
              <DialogTitle className="text-white">Neuen Benutzer hinzufügen</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-novarix-text">E-Mail *</Label>
                <Input
                  id="email"
                  type="email"
                  value={newMember.email}
                  onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="neuer.benutzer@email.de"
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
                    <SelectItem value="customer">Kunde</SelectItem>
                    <SelectItem value="dev">Developer</SelectItem>
                    {canAddAdmins(user.role) && <SelectItem value="admin">Admin</SelectItem>}
                    {canAddAdmins(user.role) && <SelectItem value="owner">Owner</SelectItem>}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="notes" className="text-novarix-text">Notizen</Label>
                <Textarea
                  id="notes"
                  value={newMember.notes}
                  onChange={(e) => setNewMember(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Optionale Notizen zum Benutzer..."
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

      {/* Search and Filter Bar */}
      <Card className="bg-novarix-secondary border-novarix mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-novarix-muted" />
                <Input
                  placeholder="Benutzer suchen..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-novarix-tertiary border-novarix text-white placeholder:text-novarix-muted"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-novarix-tertiary border-novarix text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Alle Rollen</SelectItem>
                  <SelectItem value="customer">Kunden</SelectItem>
                  <SelectItem value="dev">Developer</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="owner">Owner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-novarix-secondary border-novarix mb-6">
        <CardHeader>
          <CardTitle className="text-white">
            Alle Benutzer ({filteredUsers.length} von {users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length > 0 ? (
            <div className="space-y-4">
              {filteredUsers.map((member) => (
                <div key={member.id} className={`border rounded-lg p-4 ${member.blacklisted ? 'border-red-500 bg-red-500/10' : 'border-novarix'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${member.blacklisted ? 'bg-red-600' : 'bg-novarix-purple'}`}>
                        <span className="text-white font-medium">{getInitials(member)}</span>
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-lg font-medium text-white">{member.email}</h4>
                          {member.blacklisted && (
                            <Badge className="bg-red-600 text-white">
                              Gesperrt
                            </Badge>
                          )}
                        </div>
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
                      {canBlacklistMembers(user.role) && member.id !== user.id && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => toggleBlacklist(member.id, member.blacklisted || false)}
                          disabled={blacklistMutation.isPending}
                          className={`border-red-500 ${member.blacklisted ? 'text-green-500 hover:bg-green-500/20' : 'text-red-500 hover:bg-red-500/20'}`}
                          title={member.blacklisted ? "Entsperren" : "Sperren"}
                        >
                          {member.blacklisted ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                        </Button>
                      )}
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
                          title="Benutzer entfernen"
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Role Management */}
                  {canChangeRoles(user.role) && member.id !== user.id && (
                    <div className="mb-4 p-3 bg-novarix-tertiary rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-novarix-muted">Rolle ändern:</span>
                        <div className="flex items-center space-x-2">
                          <Select
                            value={member.role}
                            onValueChange={(newRole) => changeRole(member.id, newRole)}
                          >
                            <SelectTrigger className="w-32 bg-novarix border-novarix text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="customer">Kunde</SelectItem>
                              <SelectItem value="dev">Developer</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="owner">Owner</SelectItem>
                            </SelectContent>
                          </Select>
                          <UserCog className="h-4 w-4 text-novarix-muted" />
                        </div>
                      </div>
                    </div>
                  )}
                  
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
              <h3 className="text-lg font-medium text-white mb-2">Keine Benutzer gefunden</h3>
              <p className="text-novarix-text">Keine Benutzer entsprechen den aktuellen Filterkriterien.</p>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <h5 className="font-medium text-red-400 mb-2">Owner</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann alle Rollen ändern</li>
                <li>• Kann Benutzer sperren</li>
                <li>• Kann Benutzer entfernen</li>
                <li>• Vollzugriff auf alle Funktionen</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-yellow-400 mb-2">Admin</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Benutzer sperren</li>
                <li>• Kann Aufträge verwalten</li>
                <li>• Kann Notizen bearbeiten</li>
                <li>• Erweiterte Verwaltungsrechte</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-blue-400 mb-2">Developer</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Aufträge einsehen</li>
                <li>• Kann Auftragsstatus ändern</li>
                <li>• Kann Notizen hinzufügen</li>
                <li>• Team-Berechtigung</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-green-400 mb-2">Kunde</h5>
              <ul className="text-sm text-novarix-text space-y-1">
                <li>• Kann Aufträge erstellen</li>
                <li>• Kann eigene Aufträge einsehen</li>
                <li>• Grundlegende Berechtigung</li>
                <li>• Limitierte Rechte</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
