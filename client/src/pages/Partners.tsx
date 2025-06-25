import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Mail, Globe, CheckCircle } from "lucide-react";
import { LandingHeader } from "@/components/LandingHeader";
import { useAuth } from "@/hooks/useAuth";
import type { Partner } from "@shared/schema";

export default function Partners() {
  const { isAuthenticated } = useAuth();
  const { data: partners, isLoading, error } = useQuery<Partner[]>({
    queryKey: ["/api/partners"],
    retry: false,
  });

  if (isLoading) {
    return (
      <div className={`${!isAuthenticated ? 'min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary' : ''}`}>
        {!isAuthenticated && <LandingHeader />}
        <div className={`space-y-8 ${!isAuthenticated ? 'container mx-auto px-4 py-16' : ''}`}>
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Unsere Partner</h1>
            <p className="text-novarix-text">
              Wir arbeiten mit zuverlässigen Partnern zusammen, um Ihnen die besten Services zu bieten.
            </p>
          </div>
          
          {/* Enhanced Loading Animation */}
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-novarix-accent border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-b-novarix-accent/40 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
            <p className="text-novarix-text mt-4 animate-pulse">Partner werden geladen...</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="bg-novarix-secondary border-novarix">
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="h-6 bg-novarix-tertiary rounded w-32"></div>
                      <div className="h-8 w-8 bg-novarix-tertiary rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-novarix-tertiary rounded"></div>
                      <div className="h-4 bg-novarix-tertiary rounded w-3/4"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 bg-novarix-tertiary rounded w-20"></div>
                      <div className="h-8 bg-novarix-tertiary rounded w-20"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${!isAuthenticated ? 'min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary' : ''}`}>
        {!isAuthenticated && <LandingHeader />}
        <div className={`text-center py-12 ${!isAuthenticated ? 'container mx-auto px-4 py-16' : ''}`}>
          <h1 className="text-3xl font-bold text-white mb-2">Unsere Partner</h1>
          <p className="text-red-400">Fehler beim Laden der Partner</p>
        </div>
      </div>
    );
  }

  if (!partners || partners.length === 0) {
    return (
      <div className={`${!isAuthenticated ? 'min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary' : ''}`}>
        {!isAuthenticated && <LandingHeader />}
        <div className={`text-center py-12 ${!isAuthenticated ? 'container mx-auto px-4 py-16' : ''}`}>
          <h1 className="text-3xl font-bold text-white mb-2">Unsere Partner</h1>
          <p className="text-novarix-text">
            Derzeit sind keine Partner verfügbar.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`${!isAuthenticated ? 'min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary' : ''}`}>
      {!isAuthenticated && <LandingHeader />}
      <div className={`space-y-8 ${!isAuthenticated ? 'container mx-auto px-4 py-16' : ''}`}>
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Unsere Partner</h1>
        <p className="text-novarix-text max-w-2xl mx-auto">
          Wir arbeiten mit zuverlässigen Partnern zusammen, um Ihnen die besten Services zu bieten. 
          Diese Partner teilen unsere Werte von Qualität, Zuverlässigkeit und exzellentem Kundenservice.
        </p>
      </div>

      {/* Partners Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <Card key={partner.id} className="bg-novarix-secondary border-novarix hover:border-novarix-accent transition-colors">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <CardTitle className="text-white text-lg">{partner.name}</CardTitle>
                    {partner.isVerified && (
                      <div className="relative group">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                          Verifizierter Partner
                        </div>
                      </div>
                    )}
                  </div>
                  <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    Aktiver Partner
                  </Badge>
                </div>
                {partner.logo && (
                  <div className="ml-4 flex-shrink-0">
                    <img 
                      src={partner.logo} 
                      alt={`${partner.name} Logo`}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {partner.description && (
                <p className="text-gray-300 text-sm leading-relaxed">
                  {partner.description}
                </p>
              )}
              
              <div className="flex flex-wrap gap-2">
                {partner.website && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-novarix-accent text-novarix-accent hover:bg-novarix-accent hover:text-white"
                  >
                    <a href={partner.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4 mr-2" />
                      Website
                      <ExternalLink className="h-3 w-3 ml-1" />
                    </a>
                  </Button>
                )}
                
                {partner.contactEmail && (
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="border-novarix-accent text-novarix-accent hover:bg-novarix-accent hover:text-white"
                  >
                    <a href={`mailto:${partner.contactEmail}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Kontakt
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Partnership Info */}
      <Card className="bg-novarix-secondary border-novarix">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-medium text-white mb-3">
              Interessiert an einer Partnerschaft?
            </h3>
            <p className="text-novarix-text mb-4">
              Kontaktieren Sie uns, wenn Sie an einer Zusammenarbeit interessiert sind. 
              Wir sind immer auf der Suche nach zuverlässigen Partnern.
            </p>
            <Button
              variant="default"
              asChild
              className="bg-novarix-accent hover:bg-novarix-accent/90"
            >
              <a href="mailto:contact@novarix-studio.de">
                <Mail className="h-4 w-4 mr-2" />
                Partnerschaft anfragen
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}