import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, ClipboardList, CheckCircle, Clock, Bot, AlertTriangle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { isTeamMember } from "@/lib/authUtils";

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

interface UserStats {
  thisMonth: number;
  active: number;
  completed: number;
}

export default function TeamDashboard() {
  const { user } = useAuth();
  
  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user && isTeamMember(user.role),
  });

  const { data: userStats, isLoading: statsLoading } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
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

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    inProgress: orders.filter(o => o.status === "in_progress").length,
    completed: orders.filter(o => o.status === "completed").length,
  };

  const recentOrders = orders.slice(0, 8);

  if (!user || !isTeamMember(user.role)) {
    return (
      <div className="p-6">
        <Card className="bg-red-500/20 border-red-500">
          <CardContent className="p-6">
            <h3 className="text-lg font-medium text-white">Zugriff verweigert</h3>
            <p className="text-novarix-text mt-1">
              Sie haben keine Berechtigung, das Team Dashboard zu verwenden.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">Team Dashboard</h2>
        <p className="text-novarix-text">
          Übersicht über alle Aufträge und deren Status für Team-Mitglieder
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClipboardList className="h-8 w-8 text-novarix-purple" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-novarix-muted">Gesamt</p>
                <p className="text-2xl font-semibold text-white">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-novarix-muted">Wartend</p>
                <p className="text-2xl font-semibold text-white">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-novarix-muted">In Bearbeitung</p>
                <p className="text-2xl font-semibold text-white">{stats.inProgress}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-novarix-secondary border-novarix">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-novarix-muted">Abgeschlossen</p>
                <p className="text-2xl font-semibold text-white">{stats.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card className="bg-novarix-secondary border-novarix">
        <CardHeader>
          <CardTitle className="text-white">Aktuelle Aufträge</CardTitle>
          <CardDescription className="text-novarix-muted">
            Die neuesten Bot-Entwicklungsaufträge im System
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order, index) => (
                <div key={order.id} className={`border border-novarix rounded-lg p-4 ${index !== recentOrders.length - 1 ? 'mb-4' : ''}`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-novarix-tertiary rounded-lg flex items-center justify-center">
                        <Bot className="h-5 w-5 text-novarix-purple" />
                      </div>
                      <div>
                        <h4 className="text-lg font-medium text-white">{order.botName}</h4>
                        <p className="text-sm text-novarix-muted">
                          Discord: {order.discordName} • {order.user?.email}
                        </p>
                        <p className="text-xs text-novarix-muted">
                          Erstellt: {new Date(order.createdAt).toLocaleDateString("de-DE")}
                        </p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(order.status)}>
                      {getStatusText(order.status)}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-sm text-novarix-text">
                      {order.description.substring(0, 200)}
                      {order.description.length > 200 && "..."}
                    </p>
                  </div>
                  
                  {order.notes && (
                    <div className="bg-novarix-tertiary rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-novarix-muted">Team Notizen:</span>
                      </div>
                      <div className="text-sm text-novarix-text">
                        {order.notes}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Bot className="h-12 w-12 text-novarix-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Keine Aufträge vorhanden</h3>
              <p className="text-novarix-text">Es sind noch keine Aufträge im System.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}