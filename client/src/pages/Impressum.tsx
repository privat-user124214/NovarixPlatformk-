import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/LandingHeader";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Users, Mail, MessageSquare } from "lucide-react";
import verifiedBadge from "@/assets/verified-badge.svg";

export default function Impressum() {
  const { isAuthenticated } = useAuth();

  return (
    <div className={`${!isAuthenticated ? 'min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary' : ''}`}>
      {!isAuthenticated && <LandingHeader />}
      <div className={`p-6 ${!isAuthenticated ? 'container mx-auto px-4 py-16' : ''}`}>
      <h2 className="text-2xl font-bold text-white mb-6">Impressum</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impressum */}
        <Card className="bg-novarix-secondary border-novarix">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileText className="mr-2 h-5 w-5" />
              Angaben gemäß § 5 TMG
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-novarix-text space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium text-white">Novarix Studio</h4>
                  <div className="relative group">
                    <img 
                      src={verifiedBadge} 
                      alt="Verifiziert" 
                      className="h-5 w-5"
                    />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      Verifizierter Partner
                    </div>
                  </div>
                </div>
                <p className="text-orange-400 font-medium mb-2">
                  ⚠️ Wichtiger Hinweis: Hobby-Projekt
                </p>
                <p className="mb-4">
                  Novarix Studio ist ein privates Hobby-Projekt und kein gewerbliches Unternehmen. 
                  Wir bieten Discord-Bot-Entwicklung als kostenlose Dienstleistung für die Community an.
                </p>
                <p>
                  <strong>Projektleitung:</strong><br />
                  Lenny Winkler<br />
                  Deutschland
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Kontakt</h4>
                <p>
                  E-Mail: <a 
                    href="mailto:kontakt@novarix-studio.de"
                    className="text-novarix-purple hover:text-novarix-purple-light underline"
                  >
                    kontakt@novarix-studio.de
                  </a>
                </p>
                <p>
                  Discord: <a 
                    href="http://dc.novarix-studio.de"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-novarix-purple hover:text-novarix-purple-light underline"
                  >
                    Discord Server
                  </a>
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Haftungsausschluss</h4>
                <p>
                  <strong>Haftung für Inhalte:</strong><br />
                  Als Hobby-Projekt übernehmen wir keine Gewähr für die Aktualität, Richtigkeit und Vollständigkeit 
                  der bereitgestellten Informationen. Haftungsansprüche sind ausgeschlossen.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Haftung für Links</h4>
                <p>
                  Unser Angebot enthält Links zu externen Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss. 
                  Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter verantwortlich.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projekt-Informationen */}
        <Card className="bg-novarix-secondary border-novarix">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Users className="mr-2 h-5 w-5" />
              Über das Projekt
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-novarix-text space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">Was ist Novarix Studio?</h4>
                <p>
                  Novarix Studio ist ein privates Hobby-Projekt von Discord-Enthusiasten, die ihre 
                  Programmierkenntnisse nutzen möchten, um der Community kostenlos zu helfen.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Unsere Mission</h4>
                <p>
                  Wir entwickeln individuelle Discord-Bots für Server-Betreiber, die spezielle 
                  Funktionen benötigen, aber nicht die Ressourcen haben, diese selbst zu entwickeln.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Kostenlose Dienstleistung</h4>
                <p>
                  Alle unsere Dienstleistungen sind kostenlos. Wir machen das aus Leidenschaft 
                  für die Programmierung und um der Discord-Community etwas zurückzugeben.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Branding-Richtlinie</h4>
                <p className="text-yellow-400">
                  Da wir kostenlos arbeiten, ist unser Branding in den entwickelten Bots 
                  verpflichtend und darf nicht entfernt werden. Dies hilft uns dabei, 
                  unser Projekt bekannter zu machen.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Technische Details</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>Entwicklung in JavaScript/TypeScript</li>
                  <li>Discord.js Framework</li>
                  <li>Individuelle Anpassungen möglich</li>
                  <li>Support über Discord-Server</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Mitmachen</h4>
                <p>
                  Interessiert daran, bei unserem Hobby-Projekt mitzumachen? 
                  Kontaktiere uns über Discord oder E-Mail!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Rechtlicher Hinweis */}
      <Card className="mt-6 bg-orange-500/20 border-orange-500">
        <CardContent className="p-6">
          <div className="flex items-start">
            <FileText className="h-6 w-6 text-orange-500 mt-1 mr-3" />
            <div>
              <h3 className="text-lg font-medium text-white mb-2">Rechtlicher Hinweis für Hobby-Projekte</h3>
              <p className="text-sm text-novarix-text">
                Dieses Impressum entspricht den Anforderungen für private, nicht-gewerbliche Websites gemäß TMG. 
                Da Novarix Studio ein reines Hobby-Projekt ohne kommerzielle Absichten ist, gelten vereinfachte 
                Impressumspflichten. Wir erheben keine Gebühren und verfolgen keine wirtschaftlichen Interessen.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
}