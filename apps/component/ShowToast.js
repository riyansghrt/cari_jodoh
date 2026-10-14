import Toast from 'react-native-simple-toast';
import { store } from '../state/ReduxMiddleware';
import { t } from '../state/lang/UseLanguage';


export function ShowToast(message) {
  const state = store.getState(); // ambil state Redux langsung
  const language = state.language.language;

  const translated = message ? t(language, message) : '';
  Toast.show(translated);
}