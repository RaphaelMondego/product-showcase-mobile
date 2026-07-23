import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { TeamProvider } from '../src/contexts/TeamContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      {/**
       * O provider fica na raiz para que o time sobreviva à navegação:
       * sair da Home e entrar nos detalhes não pode zerar os favoritos.
       */}
      <TeamProvider>
        <StatusBar style="light" />
        <Stack />
      </TeamProvider>
    </SafeAreaProvider>
  );
}
