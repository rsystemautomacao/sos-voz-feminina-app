import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Shield, Lock, Mail, User, Eye, EyeOff, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

const AdminRegister = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [invite, setInvite] = useState<any>(null);
  const [isValidInvite, setIsValidInvite] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    const validateInvite = async () => {
      if (!token) {
        toast({
          title: "Link inválido",
          description: "Este link de convite não é válido.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Verificar se o convite é válido
      const validInvite = await adminService.validateInvite(token);
      
      if (!validInvite) {
        toast({
          title: "Convite expirado ou inválido",
          description: "Este convite já foi usado ou expirou.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      setInvite(validInvite);
      setIsValidInvite(true);
    };

    validateInvite();
  }, [token, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidInvite || !invite) {
      return;
    }

    if (password.length < 8) {
      toast({
        title: "Senha muito curta",
        description: "A senha deve ter pelo menos 8 caracteres.",
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
      // Criar usuário com a senha
      await adminService.useInvite(invite.token, password);
      
      toast({
        title: "Conta criada com sucesso!",
        description: "Você pode fazer login com seu email e senha.",
        duration: 2000, // 2 segundos
      });

      navigate("/login");
      
    } catch (error) {
      toast({
        title: "Erro ao criar conta",
        description: error instanceof Error ? error.message : "Erro desconhecido",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidInvite || !invite) {
    return (
      <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Verificando convite...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
            <Shield className="text-primary-foreground" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Criar Conta Administrativa
          </h1>
          <p className="text-muted-foreground">
            Configure sua senha para acessar o painel administrativo
          </p>
        </div>

        {/* Card de Registro */}
        <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-primary">Configurar Senha</CardTitle>
            <CardDescription>
              Para: <strong>{invite.email}</strong>
            </CardDescription>
          </CardHeader>

          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold flex items-center space-x-2">
                  <Lock className="text-primary" size={18} />
                  <span>Nova Senha</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl pl-4 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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
                <Label htmlFor="confirmPassword" className="text-base font-semibold flex items-center space-x-2">
                  <Lock className="text-primary" size={18} />
                  <span>Confirmar Senha</span>
                </Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl pl-4 pr-12"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
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

              {/* Requisitos da Senha */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground">Requisitos da senha:</h4>
                <div className="space-y-1 text-sm">
                  <div className={`flex items-center space-x-2 ${password.length >= 8 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {password.length >= 8 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${password === confirmPassword && password.length > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                    {password === confirmPassword && password.length > 0 ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                    <span>Senhas devem coincidir</span>
                  </div>
                </div>
              </div>

              {/* Botão de Criar Conta */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading || password.length < 8 || password !== confirmPassword}
                  className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold text-lg rounded-xl shadow-strong transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Criando conta...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield size={20} />
                      <span>Criar Conta</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aviso de Segurança */}
        <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
          <div className="flex items-start space-x-3">
            <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-semibold text-primary text-sm mb-1">
                Segurança
              </h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Esta conta terá acesso administrativo ao sistema. Mantenha suas credenciais seguras e não as compartilhe.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
