// Cache Manager para S.O.S Voz Feminina
// Garante que o app sempre carregue a versão mais recente

export class CacheManager {
  private static readonly CACHE_VERSION = '1.0.3';
  private static readonly LAST_CLEANUP_KEY = 'lastCacheCleanup';

  // Limpar todos os caches do app
  static async clearAllCaches(): Promise<void> {
    try {
      console.log('🔄 Iniciando limpeza completa de cache...');

      // Limpar caches do Service Worker
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => {
            console.log('🗑️ Removendo cache:', cacheName);
            return caches.delete(cacheName);
          })
        );
        console.log('✅ Caches do Service Worker limpos');
      }

      // Limpar localStorage (exceto configurações essenciais)
      const essentialKeys = ['appVersion', 'lastUpdateCheck', 'lastUpdateNotification'];
      const keysToRemove = Object.keys(localStorage).filter(
        key => !essentialKeys.includes(key)
      );
      
      keysToRemove.forEach(key => {
        console.log('🗑️ Removendo localStorage:', key);
        localStorage.removeItem(key);
      });
      console.log('✅ localStorage limpo');

      // Limpar sessionStorage
      sessionStorage.clear();
      console.log('✅ sessionStorage limpo');

      // Limpar IndexedDB se existir
      if ('indexedDB' in window) {
        try {
          const databases = await window.indexedDB.databases();
          databases.forEach(db => {
            if (db.name) {
              console.log('🗑️ Removendo IndexedDB:', db.name);
              window.indexedDB.deleteDatabase(db.name);
            }
          });
          console.log('✅ IndexedDB limpo');
        } catch (error) {
          console.log('⚠️ Erro ao limpar IndexedDB:', error);
        }
      }

      // Registrar data da limpeza
      localStorage.setItem(this.LAST_CLEANUP_KEY, Date.now().toString());
      console.log('✅ Limpeza de cache concluída');
      
    } catch (error) {
      console.error('❌ Erro ao limpar cache:', error);
    }
  }

  // Verificar se precisa limpar cache (baseado na versão)
  static async checkAndClearCache(): Promise<void> {
    const currentVersion = this.CACHE_VERSION;
    const storedVersion = localStorage.getItem('appVersion');
    const lastCleanup = localStorage.getItem(this.LAST_CLEANUP_KEY);

    // Limpar cache SEMPRE se:
    // 1. Versão mudou
    // 2. Nunca foi limpo
    // 3. Última limpeza foi há mais de 6h (reduzido para ser mais frequente)
    // 4. É a primeira vez que o app é aberto
    const shouldClear = 
      storedVersion !== currentVersion ||
      !lastCleanup ||
      (Date.now() - parseInt(lastCleanup)) > (6 * 60 * 60 * 1000) ||
      !localStorage.getItem('appVersion');

    if (shouldClear) {
      console.log('🔄 Limpeza automática de cache iniciada...');
      console.log('📊 Versão atual:', currentVersion);
      console.log('📊 Versão armazenada:', storedVersion);
      
      await this.clearAllCaches();
      localStorage.setItem('appVersion', currentVersion);
      
      // Forçar atualização do Service Worker após limpeza
      await this.forceUpdate();
      
      console.log('✅ Cache atualizado e Service Worker forçado');
    } else {
      console.log('✅ Cache está atualizado, não é necessário limpar');
    }
  }

  // Forçar atualização do Service Worker
  static async forceUpdate(): Promise<void> {
    try {
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        
        for (const registration of registrations) {
          console.log('🔄 Atualizando Service Worker...');
          await registration.update();
          
          // Forçar ativação imediata
          if (registration.waiting) {
            registration.waiting.postMessage({ type: 'SKIP_WAITING' });
          }
          
          console.log('✅ Service Worker atualizado');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao atualizar Service Worker:', error);
    }
  }

  // Limpar cache e recarregar página
  static async clearAndReload(): Promise<void> {
    console.log('🔄 Limpeza completa e recarregamento...');
    await this.clearAllCaches();
    
    // Aguardar um pouco antes de recarregar
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }

  // Forçar limpeza completa (para casos de emergência)
  static async forceClearAll(): Promise<void> {
    console.log('🚨 Forçando limpeza completa de todos os dados...');
    
    // Limpar tudo, incluindo configurações essenciais
    localStorage.clear();
    sessionStorage.clear();
    
    if ('caches' in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
      );
    }
    
    if ('indexedDB' in window) {
      try {
        const databases = await window.indexedDB.databases();
        databases.forEach(db => {
          if (db.name) {
            window.indexedDB.deleteDatabase(db.name);
          }
        });
      } catch (error) {
        console.log('⚠️ Erro ao limpar IndexedDB:', error);
      }
    }
    
    console.log('✅ Limpeza forçada concluída');
  }
}
