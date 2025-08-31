import { useState } from "react";
import { BookOpen, Shield, Scale, Heart, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Educativo = () => {
  const [activeSection, setActiveSection] = useState<string | undefined>(undefined);

  const educationalContent = [
    {
      id: "assedio",
      title: "O que é assédio sexual?",
      content: (
        <div className="space-y-4">
          <p>O assédio sexual é qualquer conduta de natureza sexual não desejada que:</p>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Constrange, intimida ou humilha a vítima</li>
            <li>Interfere no trabalho ou cria ambiente hostil</li>
            <li>Condiciona vantagens a favores sexuais</li>
            <li>Inclui toques, comentários, gestos ou propostas indesejadas</li>
          </ul>
          <div className="bg-destructive/10 p-4 rounded-lg border border-destructive/20">
            <p className="text-sm font-medium text-destructive">
              ⚠️ Importante: O assédio pode ser verbal, físico, visual ou psicológico. 
              Não precisa ser "grave" para ser denunciado.
            </p>
          </div>
        </div>
      )
    },
    {
      id: "direitos",
      title: "Seus direitos fundamentais",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Você tem direito a:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Trabalhar em ambiente seguro e respeitoso</li>
            <li>Denunciar sem sofrer retaliação</li>
            <li>Ter sua denúncia investigada adequadamente</li>
            <li>Receber apoio psicológico e jurídico</li>
            <li>Manter sua privacidade protegida</li>
            <li>Ser ouvida e levada a sério</li>
          </ul>
          <div className="bg-success/10 p-4 rounded-lg border border-success/20">
            <p className="text-sm font-medium text-success">
              ✓ Lei Maria da Penha e Código Penal protegem suas denúncias
            </p>
          </div>
        </div>
      )
    },
    {
      id: "como-agir",
      title: "Como agir em situações de assédio",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Passos recomendados:</h4>
          <div className="space-y-3">
            <div className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center font-bold">1</span>
              <div>
                <p className="font-medium">Documente tudo</p>
                <p className="text-sm text-muted-foreground">Data, local, testemunhas, o que foi dito/feito</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center font-bold">2</span>
              <div>
                <p className="font-medium">Comunique claramente</p>
                <p className="text-sm text-muted-foreground">Deixe claro que o comportamento é indesejado</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center font-bold">3</span>
              <div>
                <p className="font-medium">Busque apoio</p>
                <p className="text-sm text-muted-foreground">Converse com pessoas de confiança</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <span className="flex-shrink-0 w-6 h-6 bg-primary rounded-full text-primary-foreground text-xs flex items-center justify-center font-bold">4</span>
              <div>
                <p className="font-medium">Denuncie</p>
                <p className="text-sm text-muted-foreground">Use canais oficiais ou este app</p>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: "evidencias",
      title: "Como reunir evidências",
      content: (
        <div className="space-y-4">
          <h4 className="font-semibold">Tipos de evidências importantes:</h4>
          <ul className="list-disc list-inside space-y-2 text-sm">
            <li>Screenshots de mensagens</li>
            <li>E-mails salvos</li>
            <li>Gravações de áudio (onde legalmente permitido)</li>
            <li>Fotos de bilhetes ou cartas</li>
            <li>Registro de datas e horários</li>
            <li>Nomes de testemunhas</li>
            <li>Relatórios médicos se houver impacto na saúde</li>
          </ul>
          <div className="bg-warning/10 p-4 rounded-lg border border-warning/20">
            <p className="text-sm font-medium text-warning">
              💡 Dica: Mantenha cópias em local seguro, preferencialmente fora do trabalho
            </p>
          </div>
        </div>
      )
    },
    {
      id: "apoio-emocional",
      title: "Cuidando da sua saúde mental",
      content: (
        <div className="space-y-4">
          <p>Ser vítima de assédio pode causar impactos emocionais significativos:</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h5 className="font-medium text-destructive mb-2">Sintomas comuns:</h5>
              <ul className="text-sm space-y-1">
                <li>• Ansiedade e estresse</li>
                <li>• Dificuldade para dormir</li>
                <li>• Perda de autoestima</li>
                <li>• Evitar determinados locais</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium text-success mb-2">Estratégias de cuidado:</h5>
              <ul className="text-sm space-y-1">
                <li>• Buscar apoio psicológico</li>
                <li>• Conversar com pessoas de confiança</li>
                <li>• Praticar autocuidado</li>
                <li>• Manter rotinas saudáveis</li>
              </ul>
            </div>
          </div>
          <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
            <p className="text-sm font-medium text-accent-foreground">
              💝 Lembre-se: Buscar ajuda é sinal de força, não fraqueza
            </p>
          </div>
        </div>
      )
    }
  ];

  const handleCardClick = (sectionId: string) => {
    setActiveSection(sectionId);
    // Scroll para a seção do accordion
    setTimeout(() => {
      const element = document.getElementById(`accordion-${sectionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-soft py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-strong">
            <BookOpen className="text-primary-foreground" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Material Educativo
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Conheça seus direitos, saiba como agir e entenda que você não está sozinha. 
            O conhecimento é uma ferramenta poderosa de proteção.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card 
            className="text-center shadow-soft hover:shadow-strong transition-all cursor-pointer hover:scale-105"
            onClick={() => handleCardClick('direitos')}
          >
            <CardContent className="pt-6">
              <Shield className="mx-auto mb-3 text-primary" size={32} />
              <h3 className="font-semibold mb-2">Seus Direitos</h3>
              <p className="text-sm text-muted-foreground">
                Conheça as leis que te protegem
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center shadow-soft hover:shadow-strong transition-all cursor-pointer hover:scale-105"
            onClick={() => handleCardClick('assedio')}
          >
            <CardContent className="pt-6">
              <AlertTriangle className="mx-auto mb-3 text-warning" size={32} />
              <h3 className="font-semibold mb-2">Como Identificar</h3>
              <p className="text-sm text-muted-foreground">
                Reconheça situações de assédio
              </p>
            </CardContent>
          </Card>
          
          <Card 
            className="text-center shadow-soft hover:shadow-strong transition-all cursor-pointer hover:scale-105"
            onClick={() => handleCardClick('apoio-emocional')}
          >
            <CardContent className="pt-6">
              <Heart className="mx-auto mb-3 text-success" size={32} />
              <h3 className="font-semibold mb-2">Apoio Emocional</h3>
              <p className="text-sm text-muted-foreground">
                Cuide da sua saúde mental
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Educational Content */}
        <Card className="shadow-strong" id="accordion-section">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="text-primary" size={24} />
              <span>Guia Completo de Orientações</span>
            </CardTitle>
            <CardDescription>
              Informações essenciais para sua proteção e empoderamento
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion 
              type="single" 
              collapsible 
              className="w-full"
              value={activeSection}
              onValueChange={setActiveSection}
            >
              {educationalContent.map((item) => (
                <AccordionItem key={item.id} value={item.id} id={`accordion-${item.id}`}>
                  <AccordionTrigger className="text-left">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent>
                    {item.content}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Resources */}
        <Card className="mt-8 bg-primary-lighter/10 border-primary-lighter">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Scale className="text-primary mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-semibold text-primary mb-2">
                  Marco Legal de Proteção
                </h3>
                <div className="text-sm text-muted-foreground space-y-2">
                  <p><strong>Lei Maria da Penha (11.340/2006):</strong> Protege mulheres contra violência doméstica e familiar</p>
                  <p><strong>Código Penal Art. 216-A:</strong> Tipifica o crime de assédio sexual</p>
                  <p><strong>CLT Art. 483:</strong> Permite rescisão indireta por assédio moral</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Educativo;