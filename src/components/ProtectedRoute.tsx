import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("adminToken");
        const loginTime = localStorage.getItem("adminLoginTime");

        if (!token || !loginTime) {
          toast({
            title: "Acesso negado",
            description: "Você precisa fazer login para acessar esta página.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Usar o email armazenado no localStorage durante o login
        let userEmail = localStorage.getItem("adminEmail");
        
        // Se não tiver email armazenado, tentar extrair do JWT como fallback
        if (!userEmail) {
          try {
            const tokenParts = token.split('.');
            if (tokenParts.length === 3) {
              const payload = JSON.parse(atob(tokenParts[1]));
              // Se não tiver email no JWT, usar o userId para buscar o usuário
              if (payload.userId) {
                const user = await adminService.getUserById(payload.userId);
                if (user && user.email) {
                  userEmail = user.email;
                  // Salvar o email para uso futuro
                  localStorage.setItem("adminEmail", user.email);
                }
              }
            }
          } catch (decodeError) {
            console.error('Erro ao decodificar JWT:', decodeError);
          }
        }

        if (!userEmail) {
          toast({
            title: "Token inválido",
            description: "Token de autenticação inválido. Faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const loginDate = new Date(loginTime);
        const currentDate = new Date();
        const hoursDiff = (currentDate.getTime() - loginDate.getTime()) / (1000 * 60 * 60);

        // Sessão expira após 24 horas
        if (hoursDiff > 24) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminLoginTime");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("hasShownWelcome");
          
          toast({
            title: "Sessão expirada",
            description: "Sua sessão expirou. Faça login novamente.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Verificar se o usuário ainda existe no sistema
        const user = await adminService.getUserByEmail(userEmail);
        if (!user) {
          localStorage.removeItem("adminToken");
          localStorage.removeItem("adminLoginTime");
          localStorage.removeItem("adminEmail");
          localStorage.removeItem("hasShownWelcome");
          
          toast({
            title: "Usuário não encontrado",
            description: "Seu usuário foi removido do sistema.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        // Atualizar último login
        await adminService.updateLastLogin(userEmail);

      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminLoginTime");
        localStorage.removeItem("adminEmail");
        localStorage.removeItem("hasShownWelcome");
        
        toast({
          title: "Erro de autenticação",
          description: "Ocorreu um erro na verificação. Faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default ProtectedRoute;
