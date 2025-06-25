import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Shield, FileText, LogIn, UserPlus, Handshake } from "lucide-react";

export function LandingHeader() {
  return (
    <header className="bg-novarix-secondary border-b border-novarix">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <Link href="/">
              <div className="text-xl font-bold text-white cursor-pointer">
                Novarix Studio
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/partners">
              <div className="flex items-center text-novarix-muted hover:text-white transition-colors cursor-pointer">
                <Handshake className="h-4 w-4 mr-2" />
                Partner
              </div>
            </Link>
            <Link href="/terms">
              <div className="flex items-center text-novarix-muted hover:text-white transition-colors cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                AGB
              </div>
            </Link>
            <Link href="/privacy">
              <div className="flex items-center text-novarix-muted hover:text-white transition-colors cursor-pointer">
                <Shield className="h-4 w-4 mr-2" />
                Datenschutz
              </div>
            </Link>
            <Link href="/impressum">
              <div className="flex items-center text-novarix-muted hover:text-white transition-colors cursor-pointer">
                <FileText className="h-4 w-4 mr-2" />
                Impressum
              </div>
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" asChild className="text-novarix-muted hover:text-white">
              <Link href="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Anmelden
              </Link>
            </Button>
            <Button asChild className="bg-novarix-accent hover:bg-novarix-accent/90">
              <Link href="/register">
                <UserPlus className="h-4 w-4 mr-2" />
                Registrieren
              </Link>
            </Button>
          </div>

          {/* Mobile menu button - could be expanded later */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" className="text-novarix-muted">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}