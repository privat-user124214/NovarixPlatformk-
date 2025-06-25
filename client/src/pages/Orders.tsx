import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { isTeamMember } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: number;
  discordName: string;
  botName: string;
  description: string;
  status: string;
  createdAt: string;
  notes?: string;
  user?: {
    email: string;
  };
}

export default function Orders() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingOrder, setEditingOrder] = useState<number | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [editStatus, setEditStatus] = useState("");

  const { data: orders = [], isLoading } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const updateOrderMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: string; notes?: string } }) =>
      apiRequest("PATCH", `/api/orders/${id}/status`, data),
    onSuccess: () => {
      toast({
        title: "Auftrag aktualisiert",
        description: "Die Änderungen wurden erfolgreich gespeichert.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      setEditingOrder(null);
    },
    onError: (error: Error) => {
      toast({
        title: "Fehler",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-800";
      case "in_progress":
        return "bg-blue-200 text-blue-800";
      case "completed":
        return "bg-green-200 text-green-800";
      case "cancelled":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "Wartend";
      case "in_progress":
        return "In Bearbeitung";
      case "completed":
        return "Abgeschlossen";
      case "cancelled":
        return "Storniert";
      default:
        return status;
    }
  };

  const startEditing = (order: Order) => {
    setEditingOrder(order.id);
    setEditNotes(order.notes || "");
    setEditStatus(order.status);
  };

  const cancelEditing = () => {
    setEditingOrder(null);
    setEditNotes("");
    setEditStatus("");
  };

  const saveChanges = (orderId: number) => {
    updateOrderMutation.mutate({
      id: orderId,
      data: {
        status: editStatus,
        notes: editNotes,
      },
    });
  };

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
        <h2 className="text-2xl font-bold text-white mb-6">
          {user?.role === "customer" ? "Meine Aufträge" : "Alle Aufträge"}
        </h2>
        
        <Card className="bg-novarix-secondary border-novarix">
          {orders.length > 0 ? (
            <div>
              {orders.map((order, index) => (
                <div key={order.id} className={`p-6 ${index !== orders.length - 1 ? 'border-b border-novarix' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-novarix-tertiary rounded-lg flex items-center justify-center">
                        <Bot className="h-6 w-6 text-novarix-purple" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">{order.botName}</h4>
                        <p className="text-sm text-novarix-muted">
                          Discord: {order.discordName}
                          {isTeamMember(user?.role || "") && order.user && (
                            <span className="ml-2">• {order.user.email}</span>
                          )}
                        </p>
                        <p className="text-xs text-novarix-muted mt-1">
                          Erstellt: {new Date(order.createdAt).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {editingOrder === order.id ? (
                        <div className="flex items-center space-x-2">
                          <Select value={editStatus} onValueChange={setEditStatus}>
                            <SelectTrigger className="w-32 bg-novarix-tertiary border-novarix text-white">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Wartend</SelectItem>
                              <SelectItem value="in_progress">In Bearbeitung</SelectItem>
                              <SelectItem value="completed">Abgeschlossen</SelectItem>
                              <SelectItem value="cancelled">Storniert</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button
                            size="sm"
                            onClick={() => saveChanges(order.id)}
                            disabled={updateOrderMutation.isPending}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={cancelEditing}
                            className="border-novarix text-novarix-text hover:bg-novarix-tertiary"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Badge className={getStatusColor(order.status)}>
                            {getStatusText(order.status)}
                          </Badge>
                          {isTeamMember(user?.role || "") && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => startEditing(order)}
                              className="border-novarix text-novarix-text hover:bg-novarix-tertiary"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-novarix-text">{order.description}</p>
                  </div>
                  
                  <div className="bg-novarix-tertiary rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-novarix-muted">Team Notizen:</span>
                    </div>
                    {editingOrder === order.id ? (
                      <Textarea
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Notizen hinzufügen..."
                        className="bg-novarix border-novarix text-white placeholder:text-novarix-muted"
                        rows={3}
                      />
                    ) : (
                      <div className="text-sm text-novarix-text">
                        {order.notes || "Keine Notizen vorhanden"}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-novarix-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Aufträge vorhanden</h3>
              <p className="text-novarix-text">
                {user?.role === "customer" 
                  ? "Sie haben noch keine Aufträge erstellt."
                  : "Es sind noch keine Aufträge vorhanden."
                }
              </p>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
