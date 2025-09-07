import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, BookOpen, Phone, Menu, X, Info, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import AboutModal from "./AboutModal";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/denuncia", icon: FileText, label: "Denúncia" },
    { path: "/educativo", icon: BookOpen, label: "Educativo" },
    { path: "/contatos", icon: Phone, label: "Contatos" },
  ];

  const handleAboutClick = () => {
    setIsOpen(false);
    setIsAboutOpen(true);
  };

  return (
    <>
      <nav className="bg-card border-b border-border shadow-soft">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-soft overflow-hidden">
                <img 
                  src="/logo-sos-voz-feminina.png" 
                  alt="S.O.S Voz Feminina" 
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="font-bold text-xl text-primary">S.O.S Voz Feminina</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? "safe" : "ghost"}
                      size="sm"
                      className="flex items-center space-x-2"
                    >
                      <item.icon size={16} />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
              {/* Botão Sobre no Desktop */}
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleAboutClick}
              >
                <Info size={16} />
                <span>Sobre</span>
              </Button>
            </div>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isOpen && (
            <div className="md:hidden py-4 border-t border-border">
              <div className="flex flex-col space-y-2">
                {navItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                    >
                      <Button
                        variant={isActive ? "safe" : "ghost"}
                        className="w-full justify-start space-x-2"
                      >
                        <item.icon size={16} />
                        <span>{item.label}</span>
                      </Button>
                    </Link>
                  );
                })}
                {/* Botão Sobre no Mobile */}
                <Button
                  variant="ghost"
                  className="w-full justify-start space-x-2"
                  onClick={handleAboutClick}
                >
                  <Info size={16} />
                  <span>Sobre</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal Sobre */}
      <AboutModal 
        isOpen={isAboutOpen} 
        onClose={() => setIsAboutOpen(false)} 
      />
    </>
  );
};

export default Navigation;