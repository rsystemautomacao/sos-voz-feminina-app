import { Info, Github, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  const appVersion = "1.0.3";
  const developer = "Richard Spanhol";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Info className="text-primary" size={18} />
            <span>Sobre o SOS Voz Feminina</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Descrição do App */}
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Plataforma segura e anônima para denúncias de violência contra mulheres. 
              Proporcionamos um canal confidencial onde as vítimas podem relatar 
              situações sem medo de retaliação.
            </p>
          </div>

          {/* Informações Técnicas */}
          <div className="space-y-2">
            <h3 className="font-semibold text-primary text-sm">Informações Técnicas</h3>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="font-medium">Versão:</span>
                <p className="text-muted-foreground">{appVersion}</p>
              </div>
              <div>
                <span className="font-medium">Desenvolvedor:</span>
                <p className="text-muted-foreground">{developer}</p>
              </div>
            </div>
          </div>

          {/* Contato do Desenvolvedor */}
          <div className="space-y-2">
            <h3 className="font-semibold text-primary text-sm">Contato</h3>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Mail size={14} />
              <span>rsautomacao2000@gmail.com</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Github size={14} />
              <span>github.com/rsystemautomacao</span>
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Globe size={14} />
              <span>rsystemautomacao.com.br</span>
            </div>
          </div>

          {/* Botão de fechar */}
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} variant="outline" size="sm">
              Fechar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AboutModal;
