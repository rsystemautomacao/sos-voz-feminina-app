import { useState, useEffect } from 'react';
import { useToast } from './use-toast';

interface AppUpdateInfo {
  version: string;
  timestamp: number;
}

const useAppUpdate = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se há uma nova versão disponível
    const checkForUpdates = () => {
      const currentVersion = '1.0.3';
      const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
      const lastVersion = localStorage.getItem('appVersion');

      // Se é a primeira vez ou a versão mudou
      if (!lastVersion || lastVersion !== currentVersion) {
        localStorage.setItem('appVersion', currentVersion);
        localStorage.setItem('lastUpdateCheck', Date.now().toString());
        
        // Mostrar notificação de atualização
        setShowUpdatePrompt(true);
        
        toast({
          title: "Nova versão disponível!",
          description: "Uma nova versão do app foi carregada. Clique para atualizar.",
        });
      }
    };

    // Verificar atualizações quando o app carrega
    checkForUpdates();

    // Verificar atualizações quando a conexão volta online
    const handleOnline = () => {
      checkForUpdates();
    };

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [toast]);

  const handleUpdate = () => {
    window.location.reload();
  };

  const dismissUpdate = () => {
    setShowUpdatePrompt(false);
  };

  return {
    showUpdatePrompt,
    handleUpdate,
    dismissUpdate,
  };
};

export default useAppUpdate;
