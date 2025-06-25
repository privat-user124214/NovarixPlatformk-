import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Info, ClipboardList, Cog, CheckCircle, Plus, Bot } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { isTeamMember } from "@/lib/authUtils";

interface UserStats {
  thisMonth: number;
  active: number;
  completed: number;
}

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

export default function Dashboard() {
  const { user } = useAuth();
  
  const { data: stats } = useQuery<UserStats>({
    queryKey: ["/api/user/stats"],
    enabled: !!user,
  });

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["/api/orders"],
    enabled: !!user,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-200 text-yellow-900";
      case "in_progress":
        return "bg-blue-200 text-blue-900";
      case "completed":
        return "bg-green-200 text-green-900";
      case "cancelled":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-900";
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

  const recentOrders = orders.slice(0, 5);

  return (
    <div className="p-6">
      {/* Service Notice Banner */}
      <Card className="mb-6 bg-novarix-purple/20 border-novarix-purple">
        <CardContent className="p-4">
          <div className="flex items-center">
            <Info className="h-6 w-6 text-novarix-purple mr-3" />
            <div>
              <h3 className="text-sm font-medium text-white">Wichtiger Hinweis</h3>
              <p className="text-sm text-novarix-text mt-1">
                Wir entwickeln keine eigenen Bots mehr – bieten aber individuelle Bot-Entwicklung auf Anfrage an.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-white mb-6">Dashboard Übersicht</h2>
        
        {user?.role === "customer" && stats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-novarix-secondary border-novarix">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClipboardList className="h-8 w-8 text-novarix-purple" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-novarix-muted">Aufträge diesen Monat</p>
                    <p className="text-2xl font-semibold text-white">
                      {stats.thisMonth} / 3
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-novarix-secondary border-novarix">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Cog className="h-8 w-8 text-yellow-500 animate-spin" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-novarix-muted">Aktive Aufträge</p>
                    <p className="text-2xl font-semibold text-white">{stats.active}</p>
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
                    <p className="text-sm font-medium text-novarix-muted">Abgeschlossene Aufträge</p>
                    <p className="text-2xl font-semibold text-white">{stats.completed}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-novarix-secondary border-novarix">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-white mb-2">
                  Willkommen {user?.role === "owner" ? "Owner" : user?.role === "admin" ? "Admin" : "Developer"}!
                </h3>
                <p className="text-novarix-text">
                  Sie haben Zugriff auf alle Aufträge und Verwaltungsfunktionen.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Recent Orders */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">
            {user?.role === "customer" ? "Ihre Aufträge" : "Aktuelle Aufträge"}
          </h3>
          {user?.role === "customer" && (
            <Link href="/new-order">
              <Button className="bg-novarix-purple hover:bg-novarix-purple-dark">
                <Plus className="mr-2 h-4 w-4" />
                Neuer Auftrag
              </Button>
            </Link>
          )}
        </div>
        
        <Card className="bg-novarix-secondary border-novarix">
          {recentOrders.length > 0 ? (
            <div>
              {recentOrders.map((order, index) => (
                <div key={order.id} className={`p-6 ${index !== recentOrders.length - 1 ? 'border-b border-novarix' : ''}`}>
                  <div className="flex items-center justify-between">
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
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-novarix-text">
                      {order.description.substring(0, 150)}
                      {order.description.length > 150 && "..."}
                    </p>
                  </div>
                  {order.notes && (
                    <div className="mt-4 bg-novarix-tertiary rounded-lg p-3">
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
            <CardContent className="p-6 text-center">
              <Bot className="h-12 w-12 text-novarix-muted mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">Noch keine Aufträge</h3>
              <p className="text-novarix-text mb-4">
                Erstellen Sie Ihren ersten Bot-Auftrag und lassen Sie uns Ihre Idee umsetzen.
              </p>
              {user?.role === "customer" && (
                <Link href="/new-order">
                  <Button className="bg-novarix-purple hover:bg-novarix-purple-dark">
                    <Plus className="mr-2 h-4 w-4" />
                    Ersten Auftrag erstellen
                  </Button>
                </Link>
              )}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
