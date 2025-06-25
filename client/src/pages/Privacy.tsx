import { LandingHeader } from "@/components/LandingHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-novarix-primary to-novarix-secondary">
      <LandingHeader />
      <div className="container mx-auto px-4 py-16">
        <Card className="bg-novarix-secondary border-novarix max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-white text-center">
              Datenschutzerklärung
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-invert max-w-none p-8">
            <div className="text-novarix-text space-y-6">
              <section>
                <h2 className="text-xl font-semibold text-white mb-4">1. Datenschutz auf einen Blick</h2>
                
                <h3 className="text-lg font-medium text-white mb-2">Allgemeine Hinweise</h3>
                <p>
                  Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten 
                  passiert, wenn Sie diese Website besuchen. Personenbezogene Daten sind alle Daten, mit denen Sie 
                  persönlich identifiziert werden können.
                </p>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Datenerfassung auf dieser Website</h3>
                <p>
                  <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
                  Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
                  können Sie dem Abschnitt „Hinweis zur Verantwortlichen Stelle" in dieser Datenschutzerklärung entnehmen.
                </p>

                <p>
                  <strong>Wie erfassen wir Ihre Daten?</strong><br />
                  Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
                  z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">2. Hosting</h2>
                <p>
                  Wir hosten die Inhalte unserer Website bei folgendem Anbieter:
                </p>
                
                <h3 className="text-lg font-medium text-white mb-2">Externes Hosting</h3>
                <p>
                  Diese Website wird extern gehostet. Die personenbezogenen Daten, die auf dieser Website erfasst werden, 
                  werden auf den Servern des Hosters gespeichert. Hierbei kann es sich v. a. um IP-Adressen, 
                  Kontaktanfragen, Meta- und Kommunikationsdaten, Vertragsdaten, Kontaktdaten, Namen, Websitezugriffe 
                  und sonstige Daten, die über eine Website generiert werden, handeln.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">3. Allgemeine Hinweise und Pflichtinformationen</h2>
                
                <h3 className="text-lg font-medium text-white mb-2">Datenschutz</h3>
                <p>
                  Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
                  Ihre personenbezogenen Daten vertraulich und entsprechend den gesetzlichen Datenschutzvorschriften 
                  sowie dieser Datenschutzerklärung.
                </p>

                <h3 className="text-lg font-medium text-white mb-2">Hinweis zur verantwortlichen Stelle</h3>
                <p>
                  Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:
                </p>
                <p>
                  Novarix Studio<br />
                  E-Mail: contact@novarix-studio.de
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">4. Datenerfassung auf dieser Website</h2>
                
                <h3 className="text-lg font-medium text-white mb-2">Server-Log-Dateien</h3>
                <p>
                  Der Provider der Seiten erhebt und speichert automatisch Informationen in so genannten Server-Log-Dateien, 
                  die Ihr Browser automatisch an uns übermittelt. Dies sind:
                </p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Browsertyp und Browserversion</li>
                  <li>verwendetes Betriebssystem</li>
                  <li>Referrer URL</li>
                  <li>Hostname des zugreifenden Rechners</li>
                  <li>Uhrzeit der Serveranfrage</li>
                  <li>IP-Adresse</li>
                </ul>

                <h3 className="text-lg font-medium text-white mb-2 mt-4">Kontaktformular</h3>
                <p>
                  Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem 
                  Anfrageformular inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung 
                  der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-white mb-4">5. Ihre Rechte</h2>
                <p>
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck 
                  Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, 
                  die Berichtigung oder Löschung dieser Daten zu verlangen.
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