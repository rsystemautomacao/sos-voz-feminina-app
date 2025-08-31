import { useState, useEffect } from 'react';

interface AppUpdateInfo {
  version: string;
  timestamp: number;
}

const useAppUpdate = () => {
  const [showUpdatePrompt, setShowUpdatePrompt] = useState(false);

  useEffect(() => {
    // Verificar se há uma nova versão disponível
    const checkForUpdates = () => {
      const currentVersion = '1.0.3';
      const lastUpdateCheck = localStorage.getItem('lastUpdateCheck');
      const lastVersion = localStorage.getItem('appVersion');
      const lastNotificationTime = localStorage.getItem('lastUpdateNotification');

      // Só mostrar notificação se:
      // 1. Versão mudou E
      // 2. Não mostrou notificação nas últimas 24h
      const shouldNotify = 
        lastVersion !== currentVersion &&
        (!lastNotificationTime || 
         (Date.now() - parseInt(lastNotificationTime)) > (24 * 60 * 60 * 1000));

      if (shouldNotify) {
        localStorage.setItem('appVersion', currentVersion);
        localStorage.setItem('lastUpdateCheck', Date.now().toString());
        localStorage.setItem('lastUpdateNotification', Date.now().toString());
        
        // Mostrar notificação de atualização (apenas a principal)
        setShowUpdatePrompt(true);
      }
    };

    // Aguardar um pouco antes de verificar para evitar conflitos com limpeza de cache
    const timer = setTimeout(() => {
      checkForUpdates();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

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
