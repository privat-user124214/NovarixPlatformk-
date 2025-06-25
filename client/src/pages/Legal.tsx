import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText } from "lucide-react";

export default function Legal() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-white mb-6">Rechtliche Informationen</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AGB */}
        <Card className="bg-novarix-secondary border-novarix">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileText className="mr-2 h-5 w-5" />
              Allgemeine Geschäftsbedingungen
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-novarix-text space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">§1 Geltungsbereich</h4>
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Dienstleistungen der Novarix Studio 
                  im Bereich der individuellen Discord-Bot-Entwicklung.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§2 Vertragsschluss</h4>
                <p>
                  Der Vertrag kommt durch die Bestätigung des Auftrags seitens Novarix Studio zustande. 
                  Mit der Auftragserteilung erkennt der Kunde diese AGB als verbindlich an.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§3 Leistungsumfang</h4>
                <p>
                  Novarix Studio entwickelt individuelle Discord-Bots nach den spezifizierten Anforderungen des Kunden. 
                  Der genaue Funktionsumfang wird vor Projektbeginn schriftlich festgelegt.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§4 Branding-Verpflichtung</h4>
                <p className="font-medium text-yellow-400">
                  Bei jedem Auftrag ist unsere Branding-Werbung verpflichtend und darf nicht entfernt werden. 
                  Dies umfasst Hinweise auf Novarix Studio in der Bot-Beschreibung und/oder in Bot-Nachrichten.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§5 Auftragslimits</h4>
                <p>
                  Kunden können maximal 3 Aufträge pro Kalendermonat einreichen. 
                  Diese Beschränkung dient der Qualitätssicherung und angemessenen Bearbeitungszeiten.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§6 Gewährleistung</h4>
                <p>
                  Novarix Studio gewährleistet die Funktionsfähigkeit der entwickelten Bots zum Zeitpunkt der Auslieferung. 
                  Support und Wartung werden nach separater Vereinbarung erbracht.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">§7 Haftung</h4>
                <p>
                  Die Haftung von Novarix Studio ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. 
                  Eine Haftung für entgangenen Gewinn oder Folgeschäden ist ausgeschlossen.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Datenschutz */}
        <Card className="bg-novarix-secondary border-novarix">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="mr-2 h-5 w-5" />
              Datenschutzerklärung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-novarix-text space-y-4">
              <div>
                <h4 className="font-medium text-white mb-2">Datenschutz bei Novarix Studio</h4>
                <p>
                  Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und behandeln Ihre personenbezogenen Daten 
                  vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Erhobene Daten</h4>
                <ul className="list-disc list-inside space-y-1">
                  <li>E-Mail-Adresse (für Kundenkonto und Kommunikation)</li>
                  <li>Discord-Benutzername (für Projektabwicklung)</li>
                  <li>Auftragsinformationen und Bot-Spezifikationen</li>
                  <li>Kommunikationsdaten (Support-Anfragen, Projektbesprechungen)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Zweck der Datenverarbeitung</h4>
                <p>
                  Die erhobenen Daten werden ausschließlich zur Abwicklung Ihrer Aufträge, Kommunikation im Rahmen 
                  der Projekte und zur Bereitstellung unserer Dienstleistungen verwendet.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Datenweitergabe</h4>
                <p>
                  Eine Weitergabe Ihrer Daten an Dritte erfolgt nur, soweit dies zur Vertragserfüllung erforderlich ist 
                  oder Sie ausdrücklich eingewilligt haben.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Speicherdauer</h4>
                <p>
                  Ihre Daten werden nur so lange gespeichert, wie dies für die Erfüllung der Zwecke erforderlich ist, 
                  für die sie erhoben wurden, oder so lange gesetzliche Aufbewahrungsfristen bestehen.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Ihre Rechte</h4>
                <p>
                  Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, 
                  Widerspruch gegen die Verarbeitung und Datenübertragbarkeit.
                </p>
              </div>
              
              <div>
                <h4 className="font-medium text-white mb-2">Kontakt</h4>
                <p>
                  Für Fragen zum Datenschutz erreichen Sie uns unter:{" "}
                  <a 
                    href="mailto:datenschutz@novarix-studio.de" 
                    className="text-novarix-purple hover:text-novarix-purple-light underline"
                  >
                    datenschutz@novarix-studio.de
                  </a>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Contact Information */}
      <Card className="mt-6 bg-novarix-secondary border-novarix">
        <CardHeader>
          <CardTitle className="text-white">Kontaktinformationen</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium text-white mb-2">Allgemeine Anfragen</h4>
              <p className="text-novarix-text">
                <a 
                  href="mailto:kontakt@novarix-studio.de"
                  className="text-novarix-purple hover:text-novarix-purple-light underline"
                >
                  kontakt@novarix-studio.de
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Datenschutz</h4>
              <p className="text-[#3c445c]">
                <a 
                  href="mailto:datenschutz@novarix-studio.de"
                  className="text-novarix-purple hover:text-novarix-purple-light underline"
                >
                  datenschutz@novarix-studio.de
                </a>
              </p>
            </div>
            
            <div>
              <h4 className="font-medium text-white mb-2">Discord Support</h4>
              <p className="text-[#3c445c]">
                <a 
                  href="http://dc.novarix-studio.de"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-novarix-purple hover:text-novarix-purple-light underline"
                >
                  Discord Server beitreten
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
