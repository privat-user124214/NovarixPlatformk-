import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LandingHeader } from "@/components/LandingHeader";
import { Info, Bot, Shield, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-novarix">
      <LandingHeader />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto mobile-spacing px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Service Notice */}
        <Card className="mb-12 bg-novarix-purple/20 border-novarix-purple">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Info className="h-6 w-6 text-novarix-purple mr-3" />
              <div>
                <h3 className="text-lg font-medium text-white">Wichtiger Hinweis</h3>
                <p className="text-[#3c445c] mt-1">
                  Wir entwickeln keine eigenen Bots mehr – bieten aber individuelle Bot-Entwicklung auf Anfrage an.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Professionelle Bot-Entwicklung
          </h1>
          <p className="text-xl text-[#3c445c] mb-8 max-w-3xl mx-auto">
            Individuelle Discord-Bot-Entwicklung für Ihr Projekt. Von Security-Systemen bis zu 
            benutzerdefinierten Funktionen – wir realisieren Ihre Bot-Ideen.
          </p>
          <div className="space-x-4">
            <Link href="/register">
              <Button size="lg" className="bg-novarix-purple hover:bg-novarix-purple-dark">
                Jetzt registrieren
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="border-novarix-border text-[#3c445c] hover:bg-novarix-secondary">
                Anmelden
              </Button>
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-novarix-secondary border-novarix">
            <CardHeader>
              <Bot className="h-12 w-12 text-novarix-purple mb-4" />
              <CardTitle className="text-white">Individuelle Entwicklung</CardTitle>
              <CardDescription className="text-[#3c445c]">
                Maßgeschneiderte Discord-Bots nach Ihren spezifischen Anforderungen
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-novarix-secondary border-novarix">
            <CardHeader>
              <Shield className="h-12 w-12 text-novarix-purple mb-4" />
              <CardTitle className="text-white">Professionelle Qualität</CardTitle>
              <CardDescription className="text-[#3c445c]">
                Sichere, stabile und performante Bot-Lösungen für jeden Anwendungsfall
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-novarix-secondary border-novarix">
            <CardHeader>
              <Users className="h-12 w-12 text-novarix-purple mb-4" />
              <CardTitle className="text-white">Persönlicher Support</CardTitle>
              <CardDescription className="text-[#3c445c]">
                Direkter Kontakt zu unserem Entwicklerteam und kontinuierlicher Support
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Branding Notice */}
        <Card className="bg-yellow-500/20 border-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-yellow-500 mr-3" />
              <div>
                <h3 className="text-lg font-medium text-white">Branding-Hinweis</h3>
                <p className="text-[#3c445c] mt-1">
                  Bei jedem Auftrag ist unsere Branding-Werbung verpflichtend und darf nicht entfernt werden.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
