import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

interface SuperAdminRouteProps {
  children: React.ReactNode;
}

const SuperAdminRoute = ({ children }: SuperAdminRouteProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSuperAdmin = () => {
      try {
        const token = localStorage.getItem("adminToken");
        if (!token) {
          toast({
            title: "Acesso negado",
            description: "Você precisa fazer login para acessar esta página.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const tokenData = JSON.parse(atob(token));
        const isSuperAdmin = adminService.isSuperAdmin(tokenData.email);

        if (!isSuperAdmin) {
          toast({
            title: "Acesso negado",
            description: "Esta página é restrita ao administrador principal.",
            variant: "destructive",
          });
          navigate("/admin");
          return;
        }

      } catch (error) {
        console.error('Erro na verificação de super admin:', error);
        toast({
          title: "Erro de autenticação",
          description: "Ocorreu um erro na verificação. Faça login novamente.",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkSuperAdmin();
  }, [navigate, toast]);

  return <>{children}</>;
};

export default SuperAdminRoute;
