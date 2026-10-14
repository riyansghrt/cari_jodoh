import en from './en.json';
import id from './id.json';
import zh from './zh.json';
import jp from './jp.json';
import ko from './ko.json';
import de from './de.json';

const translations = { en, id, zh, jp, ko, de };
export const t = (lang, key, params = {}) => {
  let text = translations[lang]?.[key] || key;

  // Replace {{placeholder}}
  Object.keys(params).forEach(param => {
    const regex = new RegExp(`{{\\s*${param}\\s*}}`, 'g');
    text = text.replace(regex, params[param]);
  });

  return text;
};
