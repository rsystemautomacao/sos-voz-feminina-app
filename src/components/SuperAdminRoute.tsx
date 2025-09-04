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
    const checkSuperAdmin = async () => {
      try {
        // Usar o email armazenado no localStorage durante o login
        const storedEmail = localStorage.getItem("adminEmail");
        if (!storedEmail) {
          toast({
            title: "Acesso negado",
            description: "Você precisa fazer login para acessar esta página.",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const isSuperAdmin = await adminService.isSuperAdmin(storedEmail);

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
