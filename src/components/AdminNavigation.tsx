import { Link, useLocation } from "react-router-dom";
import { Shield, LogOut, FileText, BarChart3, Settings, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoginTime");
    navigate("/login");
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado do painel administrativo.",
    });
  };

  const navItems = [
    {
      href: "/admin",
      label: "Denúncias",
      icon: FileText,
      description: "Gerenciar denúncias"
    },
    {
      href: "/admin/estatisticas",
      label: "Estatísticas",
      icon: BarChart3,
      description: "Relatórios e métricas"
    },
    {
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: Settings,
      description: "Configurar sistema"
    },
    {
      href: "/sobre",
      label: "Sobre",
      icon: Info,
      description: "Informações do sistema"
    }
  ];

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-primary">SOS Voz Feminina</h1>
              <p className="text-xs text-muted-foreground">Painel Administrativo</p>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                  title={item.description}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Logout Button */}
          <div className="flex items-center space-x-2">
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center space-x-2"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavigation;
