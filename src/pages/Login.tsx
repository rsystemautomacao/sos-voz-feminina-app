import { useState } from "react";
import { Eye, EyeOff, Shield, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { adminService } from "@/services/adminService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

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
    
    try {
      const user = adminService.authenticate(email, password);
      
      if (user) {
        // Criar token de autenticação
        const tokenData = {
          email: user.email,
          role: user.role,
          loginTime: new Date().toISOString()
        };
        
        const token = btoa(JSON.stringify(tokenData));
        localStorage.setItem("adminToken", token);
        localStorage.setItem("adminLoginTime", new Date().toISOString());
        
        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a), ${user.email}`,
        });
        
        navigate("/admin");
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos. Tente novamente.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro durante o login. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
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
            Faça login para acessar o sistema de gerenciamento
          </p>
        </div>

        {/* Login Form */}
        <Card className="shadow-strong border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl text-primary">Acesso Administrativo</CardTitle>
            <CardDescription>
              Digite suas credenciais para acessar o painel
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold flex items-center space-x-2">
                  <Mail className="text-primary" size={18} />
                  <span>Email</span>
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="h-12 bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-primary/50 focus:border-primary transition-all duration-300 rounded-xl pl-4"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold flex items-center space-x-2">
                  <Lock className="text-primary" size={18} />
                  <span>Senha</span>
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

              {/* Submit Button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 bg-gradient-primary hover:bg-gradient-primary/90 text-white font-semibold text-lg rounded-xl shadow-strong transition-all duration-300 transform hover:scale-[1.02]"
                >
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Entrando...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Shield size={20} />
                      <span>Entrar no Sistema</span>
                    </div>
                  )}
                </Button>
              </div>
            </form>

            {/* Security Notice */}
            <div className="mt-8 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-xl border border-primary/20">
              <div className="flex items-start space-x-3">
                <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="font-semibold text-primary text-sm mb-1">
                    Acesso Seguro
                  </h4>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Este painel é restrito a administradores autorizados. 
                    Todas as ações são registradas para auditoria.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
