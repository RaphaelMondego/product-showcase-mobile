import { Alert, Platform } from 'react-native';

/**
 * Aviso simples ao usuário, funcionando nas duas plataformas.
 *
 * O `Alert` do react-native-web é um método vazio: chamá-lo no navegador não
 * exibe nada e a mensagem se perde em silêncio. Por isso a versão web recorre
 * ao diálogo nativo do próprio navegador.
 */
export function notify(title: string, message: string): void {
  if (Platform.OS === 'web') {
    globalThis.alert?.(`${title}\n\n${message}`);
    return;
  }

  Alert.alert(title, message);
}
