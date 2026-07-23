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

/**
 * Confirmação de ação destrutiva. Chama `onConfirm` só se o usuário aceitar.
 * No navegador usa o `confirm` nativo; no celular, um Alert de dois botões.
 */
export function confirmAction(
  title: string,
  message: string,
  confirmLabel: string,
  onConfirm: () => void,
): void {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${message}`)) {
      onConfirm();
    }
    return;
  }

  Alert.alert(title, message, [
    { text: 'Cancelar', style: 'cancel' },
    { text: confirmLabel, style: 'destructive', onPress: onConfirm },
  ]);
}
