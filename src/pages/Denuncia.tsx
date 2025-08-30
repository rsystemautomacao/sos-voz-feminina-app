import { useState } from "react";
import { AlertTriangle, Camera, Mic, Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const Denuncia = () => {
  const [relato, setRelato] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!relato.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva a situação que deseja relatar.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simular envio da denúncia
    setTimeout(() => {
      toast({
        title: "Denúncia registrada com sucesso",
        description: "Sua denúncia foi recebida de forma anônima e será analisada. Você é corajosa!",
      });
      setRelato("");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-emergency rounded-full flex items-center justify-center mx-auto mb-4 shadow-strong">
            <AlertTriangle className="text-emergency-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Fazer Denúncia Anônima
          </h1>
          <p className="text-muted-foreground">
            Seu relato é importante e será tratado com total confidencialidade
          </p>
        </div>

        {/* Security Notice */}
        <Card className="mb-8 border-primary-lighter bg-primary-lighter/10">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Shield className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-primary mb-1">
                  Garantia de Anonimato
                </h3>
                <p className="text-sm text-muted-foreground">
                  Esta denúncia é 100% anônima. Não coletamos dados pessoais, 
                  endereço IP ou qualquer informação que possa identificá-la. 
                  Você está protegida.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulário */}
        <Card className="shadow-strong">
          <CardHeader>
            <CardTitle className="text-primary">Relatar Situação</CardTitle>
            <CardDescription>
              Descreva o que aconteceu da forma que se sentir confortável
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Relato por texto */}
              <div className="space-y-2">
                <Label htmlFor="relato" className="text-base font-medium">
                  Descrição da situação *
                </Label>
                <Textarea
                  id="relato"
                  placeholder="Conte o que aconteceu... Você pode incluir detalhes como data, local, pessoas envolvidas, testemunhas, etc. Lembre-se: quanto mais informações, melhor poderemos ajudar."
                  value={relato}
                  onChange={(e) => setRelato(e.target.value)}
                  className="min-h-[150px] resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {relato.length}/2000 caracteres
                </p>
              </div>

              {/* Opções de anexos */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Evidências (opcional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-dashed border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <Camera className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Anexar Foto</p>
                      <p className="text-xs text-muted-foreground">
                        Screenshots, documentos, etc.
                      </p>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2 border-border hover:border-primary transition-colors cursor-pointer">
                    <CardContent className="pt-6 text-center">
                      <Mic className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Gravar Áudio</p>
                      <p className="text-xs text-muted-foreground">
                        Relato em áudio
                      </p>
                    </CardContent>
                  </Card>
                </div>
                <p className="text-xs text-muted-foreground">
                  💡 Dica: Evidências ajudam na investigação, mas não são obrigatórias
                </p>
              </div>

              {/* Botão de envio */}
              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="emergency" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Enviando denúncia...</>
                  ) : (
                    <>
                      <Send size={20} />
                      Enviar Denúncia Anônima
                    </>
                  )}
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-3">
                  Ao enviar, você concorda que as informações serão usadas apenas 
                  para investigação e apoio necessário
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Informações adicionais */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-3 text-primary">
              O que acontece após a denúncia?
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Sua denúncia será analisada por profissionais qualificados</li>
              <li>• Medidas de proteção serão avaliadas se necessário</li>
              <li>• Você pode retornar a qualquer momento para atualizar informações</li>
              <li>• Mantenha os contatos de apoio salvos para emergências</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Denuncia;