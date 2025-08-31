import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { CacheManager } from './utils/cacheManager'

// Função de inicialização do app
const initializeApp = async () => {
  try {
    console.log('🚀 Iniciando SOS Voz Feminina...');
    
    // Limpeza automática de cache ao abrir o app
    await CacheManager.checkAndClearCache();
    console.log('✅ Cache verificado e limpo se necessário');
    
    // Registrar Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', async () => {
        try {
          const registration = await navigator.serviceWorker.register('/sw.js');
          console.log('✅ SW registered: ', registration);
          
          // Forçar atualização do Service Worker
          await CacheManager.forceUpdate();
          
          // Verificar se há uma nova versão do Service Worker
          registration.addEventListener('updatefound', () => {
            console.log('🔄 Nova versão do Service Worker encontrada');
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('🔄 Nova versão instalada, recarregando...');
                  window.location.reload();
                }
              });
            }
          });
          
        } catch (registrationError) {
          console.log('❌ SW registration failed: ', registrationError);
        }
      });
    }
    
    // Renderizar o app
    createRoot(document.getElementById("root")!).render(<App />);
    console.log('✅ App renderizado com sucesso');
    
  } catch (error) {
    console.error('❌ Erro na inicialização:', error);
    // Mesmo com erro, tentar renderizar o app
    createRoot(document.getElementById("root")!).render(<App />);
  }
};

// Inicializar o app
initializeApp();
