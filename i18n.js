const I18N = {}; // الترجمات في langs.js و langs2.js

let LANG = 'en';
function t(k) { return (I18N[LANG] && I18N[LANG][k]) ?? I18N.en[k] ?? k; }
function tf(k, vars) { return t(k).replace(/\{(\w+)\}/g, (_, v) => vars[v] ?? ''); }
function setLang(l) {
  if (!I18N[l]) l = 'en';
  LANG = l;
  try { localStorage.setItem('lang', l); } catch (e) {}
  document.documentElement.lang = l;
  document.documentElement.dir = I18N[l].dir;
  document.title = t('name') + ' — ' + t('tagline');
}
