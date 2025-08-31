import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface InstallPWAProps {
  onClose?: () => void;
}

const InstallPWA = ({ onClose }: InstallPWAProps) => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Verificar se já foi instalado
    const isInstalled = window.matchMedia('(display-mode: standalone)').matches ||
                       (window.navigator as any).standalone === true;

    if (isInstalled) {
      setShowInstallButton(false);
      return;
    }

    // Escutar evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    // Escutar evento de instalação concluída
    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setDeferredPrompt(null);
      console.log('✅ PWA instalado com sucesso!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se o navegador suporta PWA
    const isPWASupported = 'serviceWorker' in navigator && 'PushManager' in window;
    
    if (isPWASupported && !isInstalled) {
      // Mostrar botão de instalação manual após 5 segundos
      setTimeout(() => {
        setShowInstallButton(true);
      }, 5000);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback para instalação manual
      if (onClose) onClose();
      return;
    }

    setIsInstalling(true);

    try {
      // Mostrar prompt de instalação
      deferredPrompt.prompt();

      // Aguardar resposta do usuário
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ Usuário aceitou instalação');
        setShowInstallButton(false);
      } else {
        console.log('❌ Usuário recusou instalação');
      }
    } catch (error) {
      console.error('❌ Erro na instalação:', error);
    } finally {
      setIsInstalling(false);
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowInstallButton(false);
    if (onClose) onClose();
  };

  if (!showInstallButton) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Download className="text-primary-foreground" size={20} />
            </div>
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
              Instalar SOS Voz Feminina
            </h3>
            <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
              Instale o app para acesso rápido e offline
            </p>
          </div>

          <div className="flex-shrink-0 flex space-x-2">
            <Button
              onClick={handleInstallClick}
              disabled={isInstalling}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              {isInstalling ? 'Instalando...' : 'Instalar'}
            </Button>
            
            <Button
              onClick={handleDismiss}
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallPWA;
