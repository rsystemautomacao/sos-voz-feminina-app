import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Shield, Lock, User, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // Credenciais do administrador (em produção, isso deveria estar em variáveis de ambiente)
  const ADMIN_EMAIL = "sosvozfeminina@adminstrador.com";
  const ADMIN_PASSWORD = "@VozAdmistrador!25";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        // Salvar token de autenticação
        localStorage.setItem("adminToken", "authenticated");
        localStorage.setItem("adminLoginTime", Date.now().toString());
        
        toast({
          title: "Login realizado com sucesso",
          description: "Bem-vindo ao painel administrativo!",
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-strong">
            <Shield className="text-primary-foreground" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Painel Administrativo
          </h1>
          <p className="text-muted-foreground">
            Acesso restrito para administradores
          </p>
        </div>

        {/* Card de Login */}
        <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="text-primary-foreground" size={28} />
            </div>
            <CardTitle className="text-2xl text-primary">Login Administrativo</CardTitle>
            <CardDescription className="text-base">
              Digite suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-base font-semibold flex items-center space-x-2">
                  <User className="text-blue-500" size={18} />
                  <span>Email Administrativo</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-gradient-to-r from-blue-50 to-blue-100 border-2 border-blue-200 hover:border-blue-400 focus:border-blue-500 transition-all duration-300 rounded-xl pl-4"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-base font-semibold flex items-center space-x-2">
                  <Lock className="text-red-500" size={18} />
                  <span>Senha</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 hover:border-red-400 focus:border-red-500 transition-all duration-300 rounded-xl pl-4 pr-12"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Botão de Login */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold text-lg rounded-xl shadow-strong transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield size={20} />
                      <span>Entrar no Painel</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Aviso de Segurança */}
        <Card className="mt-6 border-warning/20 bg-warning/5">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="text-warning mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-warning mb-1">
                  Acesso Restrito
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esta área é exclusiva para administradores autorizados. 
                  Todas as tentativas de acesso são registradas.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
