import { useState } from "react";
import { AlertTriangle, Camera, Mic, Send, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import apiService from "@/services/api";

const Denuncia = () => {
  const [formData, setFormData] = useState({
    relato: "",
    tipoViolencia: "",
    dataOcorrido: "",
    localizacao: {
      cidade: "",
      estado: "",
      bairro: ""
    }
  });
  const [evidencias, setEvidencias] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setEvidencias(prev => [...prev, ...files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.relato.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, descreva a situação que deseja relatar.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.tipoViolencia) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, selecione o tipo de violência.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.dataOcorrido) {
      toast({
        title: "Campo obrigatório",
        description: "Por favor, informe a data aproximada do ocorrido.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const denunciaData = {
        ...formData,
        evidencias
      };

      const response = await apiService.criarDenuncia(denunciaData);
      
      toast({
        title: "Denúncia registrada com sucesso",
        description: `Sua denúncia foi recebida. Código de acompanhamento: ${response.hashIdentificacao}`,
      });

      // Limpar formulário
      setFormData({
        relato: "",
        tipoViolencia: "",
        dataOcorrido: "",
        localizacao: {
          cidade: "",
          estado: "",
          bairro: ""
        }
      });
      setEvidencias([]);

    } catch (error) {
      toast({
        title: "Erro ao enviar denúncia",
        description: error.message || "Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              {/* Tipo de violência */}
              <div className="space-y-2">
                <Label htmlFor="tipoViolencia" className="text-base font-medium">
                  Tipo de violência *
                </Label>
                <Select 
                  value={formData.tipoViolencia} 
                  onValueChange={(value) => handleInputChange('tipoViolencia', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de violência" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fisica">Violência Física</SelectItem>
                    <SelectItem value="psicologica">Violência Psicológica</SelectItem>
                    <SelectItem value="sexual">Violência Sexual</SelectItem>
                    <SelectItem value="economica">Violência Econômica</SelectItem>
                    <SelectItem value="moral">Violência Moral</SelectItem>
                    <SelectItem value="patrimonial">Violência Patrimonial</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Data do ocorrido */}
              <div className="space-y-2">
                <Label htmlFor="dataOcorrido" className="text-base font-medium">
                  Data aproximada do ocorrido *
                </Label>
                <Input
                  type="date"
                  id="dataOcorrido"
                  value={formData.dataOcorrido}
                  onChange={(e) => handleInputChange('dataOcorrido', e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Localização (opcional) */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Localização (opcional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cidade">Cidade</Label>
                    <Input
                      id="cidade"
                      value={formData.localizacao.cidade}
                      onChange={(e) => handleInputChange('localizacao.cidade', e.target.value)}
                      placeholder="Sua cidade"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estado">Estado</Label>
                    <Input
                      id="estado"
                      value={formData.localizacao.estado}
                      onChange={(e) => handleInputChange('localizacao.estado', e.target.value)}
                      placeholder="UF"
                      maxLength={2}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bairro">Bairro</Label>
                  <Input
                    id="bairro"
                    value={formData.localizacao.bairro}
                    onChange={(e) => handleInputChange('localizacao.bairro', e.target.value)}
                    placeholder="Seu bairro"
                  />
                </div>
              </div>

              {/* Relato por texto */}
              <div className="space-y-2">
                <Label htmlFor="relato" className="text-base font-medium">
                  Descrição da situação *
                </Label>
                <Textarea
                  id="relato"
                  placeholder="Conte o que aconteceu... Você pode incluir detalhes como data, local, pessoas envolvidas, testemunhas, etc. Lembre-se: quanto mais informações, melhor poderemos ajudar."
                  value={formData.relato}
                  onChange={(e) => handleInputChange('relato', e.target.value)}
                  className="min-h-[150px] resize-none"
                  maxLength={2000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {formData.relato.length}/2000 caracteres
                </p>
              </div>

              {/* Opções de anexos */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Evidências (opcional)
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-dashed border-2 border-border hover:border-primary transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Camera className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Anexar Foto</p>
                      <p className="text-xs text-muted-foreground">
                        Screenshots, documentos, etc.
                      </p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-2"
                        multiple
                      />
                    </CardContent>
                  </Card>
                  
                  <Card className="border-dashed border-2 border-border hover:border-primary transition-colors">
                    <CardContent className="pt-6 text-center">
                      <Mic className="mx-auto mb-2 text-muted-foreground" size={24} />
                      <p className="text-sm font-medium">Gravar Áudio</p>
                      <p className="text-xs text-muted-foreground">
                        Relato em áudio
                      </p>
                      <Input
                        type="file"
                        accept="audio/*"
                        onChange={handleFileChange}
                        className="mt-2"
                        multiple
                      />
                    </CardContent>
                  </Card>
                </div>
                
                {evidencias.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Arquivos selecionados:</Label>
                    <div className="space-y-1">
                      {evidencias.map((file, index) => (
                        <div key={index} className="text-xs text-muted-foreground">
                          {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
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