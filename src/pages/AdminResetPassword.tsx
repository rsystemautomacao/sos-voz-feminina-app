import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Lock, Eye, EyeOff, AlertTriangle, CheckCircle, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

const AdminResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast({
        title: "Token inválido",
        description: "Link de reset de senha inválido.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Debug: verificar todos os resets
    adminService.debugPasswordResets();

    // Validar token
    let resetData = adminService.validatePasswordReset(token);
    
    // Se não encontrou no storage, tentar usar dados de debug da URL
    if (!resetData) {
      const debugParam = searchParams.get('debug');
      if (debugParam) {
        try {
          const debugData = JSON.parse(atob(debugParam));
          console.log('Usando dados de debug da URL:', debugData);
          
          // Verificar se o token da URL corresponde ao token de debug
          if (debugData.token === token) {
            const now = new Date();
            const expiresAt = new Date(debugData.expiresAt);
            
            if (expiresAt.getTime() > now.getTime()) {
              resetData = {
                userEmail: debugData.userEmail,
                expiresAt: debugData.expiresAt
              };
              console.log('Token válido usando dados de debug');
            } else {
              console.log('Token expirado usando dados de debug');
            }
          }
        } catch (error) {
          console.error('Erro ao decodificar dados de debug:', error);
        }
      }
    }
    
    if (!resetData) {
      toast({
        title: "Token expirado",
        description: "Este link de reset de senha expirou ou é inválido.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsValidToken(true);
    setUserEmail(resetData.userEmail);
  }, [token, searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token || !isValidToken) {
      toast({
        title: "Erro",
        description: "Token inválido ou expirado.",
        variant: "destructive",
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas não coincidem",
        description: "As senhas digitadas não são iguais.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      adminService.applyPasswordReset(token, password);
      
      toast({
        title: "Senha alterada!",
        description: "Sua senha foi alterada com sucesso. Faça login com a nova senha.",
      });
      
      // Redirecionar para login após 2 segundos
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Erro ao alterar senha",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidToken) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-strong border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft">
            <Shield className="text-primary-foreground" size={32} />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Reset de Senha
          </CardTitle>
          <CardDescription className="text-sm">
            Crie uma nova senha para sua conta administrativa
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Informações do usuário */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle className="text-blue-600" size={16} />
              <span className="text-sm font-medium text-blue-800">
                Reset solicitado para: {userEmail}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nova Senha */}
            <div className="space-y-2">
              <Label htmlFor="password">Nova Senha</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite sua nova senha"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Confirmar Senha */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirme sua nova senha"
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
            </div>

            {/* Requisitos de senha */}
            <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
              <h4 className="text-sm font-medium text-gray-800 mb-2">Requisitos da senha:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                <li className={`flex items-center space-x-2 ${password.length >= 6 ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  <span>Mínimo 6 caracteres</span>
                </li>
                <li className={`flex items-center space-x-2 ${password === confirmPassword && password.length > 0 ? 'text-green-600' : ''}`}>
                  <div className={`w-1.5 h-1.5 rounded-full ${password === confirmPassword && password.length > 0 ? 'bg-green-600' : 'bg-gray-400'}`}></div>
                  <span>Senhas devem coincidir</span>
                </li>
              </ul>
            </div>

            {/* Botões */}
            <div className="space-y-3 pt-4">
              <Button
                type="submit"
                disabled={isLoading || password.length < 6 || password !== confirmPassword}
                className="w-full bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Lock size={16} className="mr-2" />
                )}
                {isLoading ? "Alterando..." : "Alterar Senha"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/login")}
                className="w-full"
              >
                <ArrowLeft size={16} className="mr-2" />
                Voltar ao Login
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminResetPassword;
