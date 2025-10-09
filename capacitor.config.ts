import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.sosvozfeminina.app',
  appName: 'S.O.S Voz Feminina',
  webDir: 'dist',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https',
    iosScheme: 'https',
    allowNavigation: [
      'sos-voz-feminina.vercel.app',
      'api-sos-voz-feminina.onrender.com',
      'localhost:5173',
      'localhost:3000'
    ]
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#8B008B',
      showSpinner: false,
      androidSpinnerStyle: 'small',
      iosSpinnerStyle: 'small',
      splashFullScreen: true,
      splashImmersive: true
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#8B008B'
    },
    PushNotifications: {
      presentationOptions: ['badge', 'sound', 'alert']
    }
  }
};

export default config;
