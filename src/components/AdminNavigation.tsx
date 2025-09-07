import { Link, useLocation } from "react-router-dom";
import { Shield, LogOut, FileText, BarChart3, Settings, Info, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";

const AdminNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  useEffect(() => {
    const checkAdminRole = async () => {
      try {
        // Usar o email armazenado no localStorage durante o login
        const storedEmail = localStorage.getItem("adminEmail");
        if (storedEmail) {
          const isSuper = await adminService.isSuperAdmin(storedEmail);
          setIsSuperAdmin(isSuper);
        } else {
          // Fallback: tentar extrair do JWT se disponível
          const token = localStorage.getItem("adminToken");
          if (token) {
            try {
              const tokenParts = token.split('.');
              if (tokenParts.length === 3) {
                const payload = JSON.parse(atob(tokenParts[1]));
                // Se não tiver email no JWT, usar o userId para buscar o usuário
                if (payload.userId) {
                  // Buscar usuário por ID para obter o email
                  const user = await adminService.getUserById(payload.userId);
                  if (user && user.email) {
                    const isSuper = await adminService.isSuperAdmin(user.email);
                    setIsSuperAdmin(isSuper);
                  }
                }
              }
            } catch (decodeError) {
              console.error('Erro ao decodificar JWT:', decodeError);
            }
          }
        }
      } catch (error) {
        console.error('Erro ao verificar role do admin:', error);
      }
    };

    checkAdminRole();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminLoginTime");
    localStorage.removeItem("adminEmail");
    localStorage.removeItem("hasShownWelcome"); // Limpar flag de boas-vindas
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
    // Configurações só para super admin
    ...(isSuperAdmin ? [{
      href: "/admin/configuracoes",
      label: "Configurações",
      icon: Settings,
      description: "Configurar sistema"
    }] : []),
    {
      href: "/sobre",
      label: "Sobre",
      icon: Info,
      description: "Informações do sistema"
    }
  ];

  return (
    <>
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Shield className="text-primary-foreground" size={20} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-primary">S.O.S Voz Feminina</h1>
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
                onClick={() => setShowLogoutConfirm(true)}
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

      {/* Modal de Confirmação de Logout */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm shadow-strong border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-4">
              <div className="w-12 h-12 bg-gradient-red rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="text-red-foreground" size={24} />
              </div>
              <CardTitle className="text-xl text-red-600">Confirmar Saída</CardTitle>
              <CardDescription className="text-sm">
                Tem certeza que deseja sair do painel administrativo?
              </CardDescription>
            </CardHeader>
            <CardContent className="px-6 pb-6 space-y-4">
              <div className="space-y-2">
                <div className="flex items-start space-x-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertTriangle className="text-yellow-600 mt-0.5 flex-shrink-0" size={16} />
                  <div className="text-xs">
                    <h4 className="font-semibold text-yellow-800 mb-1">Atenção!</h4>
                    <p className="text-yellow-700">
                      Você será desconectado e precisará fazer login novamente para acessar o painel.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex space-x-3 pt-3">
                <Button
                  onClick={() => setShowLogoutConfirm(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancelar
                </Button>
                                 <Button
                   onClick={handleLogout}
                   className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold"
                 >
                   <LogOut size={16} className="mr-2" />
                   Sair
                 </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default AdminNavigation;
