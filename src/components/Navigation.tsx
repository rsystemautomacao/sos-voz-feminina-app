import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, FileText, BookOpen, Phone, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Início" },
    { path: "/denuncia", icon: FileText, label: "Denúncia" },
    { path: "/educativo", icon: BookOpen, label: "Educativo" },
    { path: "/contatos", icon: Phone, label: "Contatos" },
  ];

  return (
    <nav className="bg-card border-b border-border shadow-soft">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">SV</span>
            </div>
            <span className="font-bold text-lg text-primary">SOS Voz Feminina</span>
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
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;