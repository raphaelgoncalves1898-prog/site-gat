/*
 * GAT — Google Analytics com consentimento (LGPD)
 * Incluído no <head> de todas as páginas: <script src="/gat-analytics.js"></script>
 *
 * - Modo de consentimento do Google: tudo começa NEGADO, então nenhum cookie
 *   é gravado até o visitante clicar em "Aceitar".
 * - A escolha fica salva no navegador (localStorage) e o aviso não volta.
 * - Qualquer link com data-cookie-prefs reabre o aviso para mudar a escolha.
 * - Cliques em links do WhatsApp contam como contato (evento generate_lead).
 */
(function () {
  var GA_ID = 'G-3NZB8N43LV';
  var KEY = 'gat-cookies'; // 'aceito' | 'recusado'

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { dataLayer.push(arguments); };

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}

  gtag('consent', 'default', {
    analytics_storage: choice === 'aceito' ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  });
  gtag('js', new Date());
  gtag('config', GA_ID);

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);

  function save(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
    gtag('consent', 'update', { analytics_storage: value === 'aceito' ? 'granted' : 'denied' });
  }

  var CSS =
    '.gat-cookie{position:fixed;left:16px;right:16px;bottom:16px;z-index:200;max-width:560px;margin:0 auto;' +
    'background:#1E1E1E;border:1px solid rgba(255,255,255,.12);border-radius:16px;padding:18px 20px;' +
    'box-shadow:0 12px 30px rgba(0,0,0,.6);font-family:Inter,-apple-system,BlinkMacSystemFont,sans-serif;' +
    'color:#C0C0C5;font-size:14px;line-height:1.55}' +
    '.gat-cookie p{margin:0 0 14px}' +
    '.gat-cookie a{color:#F5F5F7;text-decoration:underline;text-underline-offset:3px}' +
    '.gat-cookie .acts{display:flex;gap:10px;flex-wrap:wrap}' +
    '.gat-cookie button{height:40px;padding:0 20px;border-radius:100px;font:inherit;font-weight:600;cursor:pointer;' +
    'border:1px solid rgba(255,255,255,.15);transition:all .3s ease}' +
    '.gat-cookie .ok{background:#F5F5F7;color:#121212;border-color:#F5F5F7}' +
    '.gat-cookie .no{background:transparent;color:#C0C0C5}' +
    '.gat-cookie button:hover{transform:translateY(-1px)}';

  function showBanner() {
    if (document.querySelector('.gat-cookie')) return;
    if (!document.getElementById('gat-cookie-css')) {
      var st = document.createElement('style');
      st.id = 'gat-cookie-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    var box = document.createElement('div');
    box.className = 'gat-cookie';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-label', 'Aviso de cookies');
    box.innerHTML =
      '<p>Usamos cookies de medição (Google Analytics) para entender quais conteúdos são úteis e melhorar o site. ' +
      'Eles só são ativados com a sua permissão. <a href="/privacidade.html">Política de privacidade</a></p>' +
      '<div class="acts"><button type="button" class="ok">Aceitar</button>' +
      '<button type="button" class="no">Recusar</button></div>';
    box.querySelector('.ok').addEventListener('click', function () { save('aceito'); box.remove(); });
    box.querySelector('.no').addEventListener('click', function () { save('recusado'); box.remove(); });
    document.body.appendChild(box);
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (choice !== 'aceito' && choice !== 'recusado') showBanner();
  });

  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('a[href*="wa.me/"], [data-cookie-prefs]');
    if (!t) return;
    if (t.hasAttribute('data-cookie-prefs')) { e.preventDefault(); showBanner(); return; }
    gtag('event', 'generate_lead', { method: 'whatsapp', page_path: location.pathname });
  });
})();
