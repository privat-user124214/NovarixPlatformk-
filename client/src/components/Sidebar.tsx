import { Link, useLocation } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Home, 
  ClipboardList, 
  Plus, 
  Users, 
  User, 
  Mail, 
  MessageSquare,
  Shield,
  FileText,
  X,
  UserCog,
  Handshake,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { isTeamMember, canAddTeamMembers } from "@/lib/authUtils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    ...(user && isTeamMember(user.role) 
      ? [{ name: "Team Dashboard", href: "/team-dashboard", icon: Users }] 
      : []
    ),
    { name: "Aufträge verwalten", href: "/orders", icon: ClipboardList },
    ...(user && user.role === "customer" 
      ? [{ name: "Neuer Auftrag", href: "/new-order", icon: Plus }] 
      : []
    ),
    { name: "Partner", href: "/partners", icon: Handshake },
    { name: "Rechtliches", href: "/legal", icon: Shield },
    { name: "Impressum", href: "/impressum", icon: FileText },
  ];

  const isActive = (href: string) => {
    return location === href || (href !== "/" && location.startsWith(href));
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-30 w-64 sm:w-72 bg-novarix-secondary 
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="flex items-center justify-between p-4 lg:hidden">
            <span className="text-lg font-semibold text-white">Navigation</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-6 w-6 text-novarix-text" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <div className="hidden lg:block mb-8 px-2">
              <span className="text-lg font-semibold text-white">Navigation</span>
            </div>

            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href}>
                  <a
                    className={`
                      group flex items-center px-3 py-3 text-sm font-medium rounded-md touch-target
                      ${isActive(item.href)
                        ? 'bg-novarix-purple text-white'
                        : 'text-[#3c445c] hover:text-white hover:bg-novarix-tertiary'
                      }
                    `}
                    onClick={onClose}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </a>
                </Link>
              );
            })}
             {user && (user.role === "admin" || user.role === "owner") && (
              <Link key="user-management" href="/users">
                <a
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive("/users")
                      ? 'bg-novarix-purple text-white'
                      : 'text-[#3c445c] hover:text-white hover:bg-novarix-tertiary'
                    }
                  `}
                  onClick={onClose}
                >
                  <Users className="mr-3 h-5 w-5" />
                  User Management
                </a>
              </Link>
          )}
          {user && user.role === "owner" && (
              <Link key="partner-management" href="/partner-management">
                <a
                  className={`
                    group flex items-center px-2 py-2 text-sm font-medium rounded-md
                    ${isActive("/partner-management")
                      ? 'bg-novarix-purple text-white'
                      : 'text-[#3c445c] hover:text-white hover:bg-novarix-tertiary'
                    }
                  `}
                  onClick={onClose}
                >
                  <Handshake className="mr-3 h-5 w-5" />
                  Partner-Verwaltung
                </a>
              </Link>
          )}
          </nav>

          {/* Contact info */}
          <div className="px-2 pb-4">
            <div className="bg-novarix-tertiary p-4 rounded-lg">
              <h3 className="text-sm font-medium text-white mb-2">Kontakt</h3>
              <div className="space-y-2 text-xs text-[#3c445c]">
                <div className="flex items-center">
                  <Mail className="mr-2 h-3 w-3" />
                  <a 
                    href="mailto:kontakt@novarix-studio.de"
                    className="hover:text-novarix-purple"
                  >
                    kontakt@novarix-studio.de
                  </a>
                </div>
                <div className="flex items-center">
                  <MessageSquare className="mr-2 h-3 w-3" />
                  <a 
                    href="http://dc.novarix-studio.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-novarix-purple"
                  >
                    Discord Server
                  </a>
                </div>
                <div className="flex items-center">
                  <Shield className="mr-2 h-3 w-3" />
                  <a 
                    href="mailto:datenschutz@novarix-studio.de"
                    className="hover:text-novarix-purple"
                  >
                    datenschutz@novarix-studio.de
                  </a>
                </div>
              </div>
            </div>
          </div>
          
          {/* Logout Button */}
          <div className="px-2 mt-4">
            <button
              onClick={async () => {
                try {
                  await apiRequest("POST", "/api/auth/logout");
                  queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
                  toast({
                    title: "Erfolgreich abgemeldet",
                    description: "Auf Wiedersehen!",
                  });
                  // Redirect to main website after logout
                  window.location.href = "/";
                } catch (error) {
                  console.error("Logout error:", error);
                  // Still redirect even if logout fails
                  window.location.href = "/";
                }
              }}
              className="w-full flex items-center px-2 py-2 text-sm font-medium rounded-md text-[#3c445c] hover:text-white hover:bg-novarix-tertiary"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Abmelden
            </button>
          </div>
        </div>
      </div>
    </>
  );
}