import { LandingHeader } from "@/components/LandingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Terms() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary">
      <LandingHeader />
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-novarix-secondary border-novarix max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Allgemeine Geschäftsbedingungen
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none p-8">
            <div className="text-novarix-text space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 1 Geltungsbereich</h2>
                <p>
                  Diese Allgemeinen Geschäftsbedingungen (AGB) gelten für alle Verträge zwischen 
                  Novarix Studio (nachfolgend "Anbieter") und dem Kunden über die Entwicklung 
                  von Discord-Bots und verwandten Dienstleistungen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 2 Vertragsgegenstand</h2>
                <p>
                  Der Anbieter entwickelt nach den Wünschen und Anforderungen des Kunden 
                  maßgeschneiderte Discord-Bots. Der genaue Umfang der Leistung ergibt sich 
                  aus der individuellen Auftragsbestätigung.
                </p>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Leistungsumfang</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Entwicklung von Discord-Bots nach Kundenspezifikation</li>
                  <li>Grundlegende Dokumentation der Bot-Funktionen</li>
                  <li>Installation und Ersteinrichtung</li>
                  <li>30 Tage Gewährleistung auf Programmfehler</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 3 Vertragsschluss</h2>
                <p>
                  Der Vertrag kommt durch die Bestätigung der Auftragsannahme durch den Anbieter zustande. 
                  Angebote des Anbieters sind freibleibend und unverbindlich, soweit sie nicht ausdrücklich 
                  als bindend bezeichnet sind.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 4 Preise und Zahlungsbedingungen</h2>
                <p>
                  Die Preise richten sich nach der jeweils gültigen Preisliste bzw. dem individuellen Angebot. 
                  Alle Preise verstehen sich als Endpreise inklusive der gesetzlichen Mehrwertsteuer.
                </p>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Zahlungsmodalitäten</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>50% Anzahlung bei Auftragsbestätigung</li>
                  <li>50% Restzahlung bei Projektabschluss</li>
                  <li>Zahlungsziel: 14 Tage nach Rechnungsstellung</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 5 Mitwirkungspflichten des Kunden</h2>
                <p>
                  Der Kunde verpflichtet sich, alle für die Auftragserfüllung erforderlichen Informationen 
                  vollständig und rechtzeitig zur Verfügung zu stellen. Dazu gehören insbesondere:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Detaillierte Anforderungsspezifikation</li>
                  <li>Zugang zu erforderlichen Systemen und Accounts</li>
                  <li>Zeitnahe Rückmeldung bei Nachfragen</li>
                  <li>Bereitstellung von Test-Umgebungen</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 6 Urheberrecht und Nutzungsrechte</h2>
                <p>
                  Der Anbieter räumt dem Kunden nach vollständiger Bezahlung das einfache, 
                  nicht ausschließliche Nutzungsrecht an dem entwickelten Bot ein. Der Kunde 
                  erwirbt kein Eigentumsrecht am Quellcode.
                </p>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Branding-Verpflichtung</h3>
                <p className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                  <strong>Wichtiger Hinweis:</strong> Bei jedem entwickelten Bot ist die Novarix Studio 
                  Branding-Werbung verpflichtend und darf vom Kunden nicht entfernt oder verändert werden. 
                  Dies gilt für die gesamte Nutzungsdauer des Bots.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 7 Gewährleistung</h2>
                <p>
                  Der Anbieter gewährleistet, dass der entwickelte Bot den vereinbarten Spezifikationen 
                  entspricht. Die Gewährleistungsfrist beträgt 30 Tage ab Projektabschluss.
                </p>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Ausschlüsse</h3>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Fehler durch unsachgemäße Nutzung</li>
                  <li>Änderungen durch Dritte</li>
                  <li>Änderungen der Discord-API</li>
                  <li>Server- oder Netzwerkprobleme</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 8 Haftung</h2>
                <p>
                  Die Haftung des Anbieters ist auf Vorsatz und grobe Fahrlässigkeit beschränkt. 
                  Eine Haftung für mittelbare Schäden, entgangenen Gewinn oder Folgeschäden ist ausgeschlossen.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 9 Kündigung</h2>
                <p>
                  Beide Parteien können den Vertrag aus wichtigem Grund fristlos kündigen. 
                  Bereits erbrachte Leistungen sind zu vergüten.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">§ 10 Schlussbestimmungen</h2>
                <p>
                  Es gilt deutsches Recht. Erfüllungsort und Gerichtsstand ist der Sitz des Anbieters, 
                  sofern der Kunde Vollkaufmann ist.
                </p>
              </section>

              <section className="text-sm text-novarix-muted">
                <p>Stand: Dezember 2024</p>
              </section>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}