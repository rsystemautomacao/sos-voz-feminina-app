import { useState, useEffect } from 'react';

const LGPD_KEY = 'sos-voz-feminina-lgpd-accepted';
const LGPD_EXPIRY_DAYS = 30; // Modal reaparece após 30 dias

export const useLGPD = () => {
  const [showLGPD, setShowLGPD] = useState(false);

  useEffect(() => {
    const checkLGPDStatus = () => {
      try {
        const accepted = localStorage.getItem(LGPD_KEY);
        
        if (!accepted) {
          // Primeira visita - mostrar modal
          setShowLGPD(true);
          return;
        }

        const acceptedDate = new Date(accepted);
        const now = new Date();
        const daysSinceAcceptance = Math.floor((now.getTime() - acceptedDate.getTime()) / (1000 * 60 * 60 * 24));

        // Se passou mais de 30 dias, mostrar novamente
        if (daysSinceAcceptance >= LGPD_EXPIRY_DAYS) {
          setShowLGPD(true);
        }
      } catch (error) {
        console.error('Erro ao verificar status LGPD:', error);
        // Em caso de erro, mostrar o modal por segurança
        setShowLGPD(true);
      }
    };

    checkLGPDStatus();
  }, []);

  const acceptLGPD = () => {
    try {
      localStorage.setItem(LGPD_KEY, new Date().toISOString());
      setShowLGPD(false);
    } catch (error) {
      console.error('Erro ao salvar aceite LGPD:', error);
      setShowLGPD(false);
    }
  };

  return {
    showLGPD,
    acceptLGPD
  };
};
