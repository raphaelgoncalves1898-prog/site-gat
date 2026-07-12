/*
 * GAT — gerador de artigos
 * Lê os arquivos .md criados pelo painel (pasta /articles),
 * gera uma página HTML para cada um (pasta /artigos) e um
 * índice (articles/index.json) que a home usa para listar.
 * Roda automaticamente no Netlify a cada publicação.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SRC = path.join(__dirname, 'articles');   // markdown de origem
const OUT = path.join(__dirname, 'artigos');     // páginas HTML publicadas

if (!fs.existsSync(SRC)) { fs.mkdirSync(SRC, { recursive: true }); }
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = d => { try { return new Date(d).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return ''; } };

function page({ title, tag, date, coverHtml, bodyHtml, hasZh, titleZh, bodyZhHtml, tagZh }) {
  const zhBlock = hasZh ? `
    <div class="zh">
      <div class="art-meta"><span class="tag">${esc(tagZh || tag)}</span><span>${esc(date)}</span></div>
      <h1>${esc(titleZh)}</h1>
      ${coverHtml}
      <div class="art-body">${bodyZhHtml}</div>
    </div>` : '';
  const toggle = hasZh ? `
    <div class="lang-toggle" role="group" aria-label="Idioma">
      <button data-set-lang="pt" class="active">PT</button>
      <button data-set-lang="zh">中文</button>
    </div>` : '';
  return `<!DOCTYPE html>
<html lang="pt-BR" data-lang="pt">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>${esc(title)} — GAT</title>
<meta name="description" content="${esc((bodyHtml || '').replace(/<[^>]+>/g, '').slice(0, 155))}"/>
<link rel="icon" type="image/png" href="/img/favicon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=Noto+Serif+SC:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#161310;--paper:#F4F1EA;--stone:#8B8680;--wine:#7A2530;--line:rgba(22,19,16,.12);
    --serif:'Cormorant Garamond',Georgia,serif;--sans:'Inter',system-ui,sans-serif;--han:'Noto Serif SC',serif}
  html{scroll-behavior:smooth}
  body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300;line-height:1.75;-webkit-font-smoothing:antialiased}
  html[data-lang="pt"] .zh{display:none !important}
  html[data-lang="zh"] .pt-only{display:none !important}
  html[data-lang="zh"] .art-body,html[data-lang="zh"] h1{font-family:var(--han);line-height:1.9}
  a{color:inherit}
  nav{position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
    padding:16px 32px;background:rgba(244,241,234,.9);backdrop-filter:blur(12px);border-bottom:1px solid var(--line)}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
  .brand-mark{width:36px;height:36px;background:var(--ink);color:var(--paper);display:flex;align-items:center;
    justify-content:center;font-family:var(--serif);font-weight:600;font-size:16px;position:relative}
  .brand-mark::after{content:'';position:absolute;inset:4px;border:1px solid rgba(244,241,234,.4)}
  .brand-mark sup{font-size:8px}
  .brand b{font-family:var(--serif);font-size:18px;font-weight:600}
  .back{font-size:13px;color:var(--stone);text-decoration:none;display:inline-flex;gap:7px;align-items:center}
  .back:hover{color:var(--wine)}
  .lang-toggle{display:flex;border:1px solid var(--line);border-radius:2px;overflow:hidden}
  .lang-toggle button{background:none;border:none;cursor:pointer;padding:6px 11px;color:var(--stone);
    font:inherit;font-weight:500;font-size:12px;letter-spacing:.05em}
  .lang-toggle button.active{background:var(--ink);color:var(--paper)}
  article{max-width:720px;margin:0 auto;padding:64px 32px 100px}
  .art-meta{display:flex;gap:12px;align-items:center;font-size:11px;letter-spacing:.14em;
    text-transform:uppercase;color:var(--stone);margin-bottom:20px}
  .art-meta .tag{color:var(--wine);font-weight:500}
  article h1{font-family:var(--serif);font-weight:600;font-size:clamp(30px,5vw,46px);line-height:1.15;
    letter-spacing:-.01em;margin-bottom:14px}
  .art-cover{width:100%;margin:32px 0;border:1px solid var(--line)}
  .art-body{font-size:17px;color:#2a2621;margin-top:36px}
  .art-body h2{font-family:var(--serif);font-weight:600;font-size:28px;margin:44px 0 16px;line-height:1.2}
  .art-body h3{font-family:var(--serif);font-weight:600;font-size:22px;margin:34px 0 12px}
  .art-body p{margin-bottom:22px}
  .art-body ul,.art-body ol{margin:0 0 22px 22px}
  .art-body li{margin-bottom:8px}
  .art-body blockquote{border-left:2px solid var(--wine);padding-left:22px;margin:28px 0;
    font-family:var(--serif);font-style:italic;font-size:21px;color:#3a352d}
  .art-body a{color:var(--wine);text-decoration:underline;text-underline-offset:3px}
  .art-body strong{font-weight:600}
  .art-foot{margin-top:60px;padding-top:32px;border-top:1px solid var(--line)}
  .art-foot .wa{display:inline-flex;align-items:center;gap:9px;background:var(--ink);color:var(--paper);
    padding:13px 24px;font-size:14px;font-weight:500;text-decoration:none;transition:.2s}
  .art-foot .wa:hover{background:var(--wine)}
  .art-foot .disc{margin-top:26px;font-size:11.5px;color:var(--stone);line-height:1.7}
  @media(max-width:600px){nav{padding:14px 18px}article{padding:44px 20px 72px}}
</style>
</head>
<body>
<nav>
  <a class="brand" href="/"><span class="brand-mark">GA<sup>T</sup></span><b>Gonçalves</b></a>
  <div style="display:flex;align-items:center;gap:16px">
    ${toggle}
    <a class="back" href="/#artigos">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
      <span class="pt-only">Artigos</span><span class="zh">文章</span>
    </a>
  </div>
</nav>
<article>
  <div class="pt-only">
    <div class="art-meta"><span class="tag">${esc(tag)}</span><span>${esc(date)}</span></div>
    <h1>${esc(title)}</h1>
    ${coverHtml}
    <div class="art-body">${bodyHtml}</div>
  </div>
  ${zhBlock}
  <div class="art-foot">
    <a class="wa" href="https://wa.me/5592981267195" target="_blank" rel="noopener">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2z"/></svg>
      <span class="pt-only">Falar com a GAT</span><span class="zh">联系 GAT</span>
    </a>
    <p class="disc pt-only">Conteúdo informativo, em conformidade com o Provimento nº 205/2021 da OAB. Não constitui aconselhamento jurídico para caso concreto nem promessa de resultado.</p>
    <p class="disc zh">本文仅供参考，符合巴西律师协会第 205/2021 号规定，不构成针对个案的法律意见或结果承诺。</p>
  </div>
</article>
<script>
  var h=document.documentElement;
  function setLang(l){h.setAttribute('data-lang',l);document.querySelectorAll('[data-set-lang]').forEach(function(b){b.classList.toggle('active',b.dataset.setLang===l)})}
  document.querySelectorAll('[data-set-lang]').forEach(function(b){b.addEventListener('click',function(){setLang(b.dataset.setLang)})});
</script>
</body>
</html>`;
}

const files = fs.readdirSync(SRC).filter(f => f.endsWith('.md'));
const index = [];

for (const file of files) {
  const raw = fs.readFileSync(path.join(SRC, file), 'utf8');
  const { data, content } = matter(raw);
  const slug = file.replace(/\.md$/, '');
  const date = data.date || '';
  const coverHtml = data.cover ? `<img class="art-cover" src="${esc(data.cover)}" alt="${esc(data.title)}"/>` : '';
  const hasZh = !!data.has_zh && !!data.body_zh;

  const html = page({
    title: data.title || 'Artigo',
    tag: data.tag || 'Geral',
    tagZh: data.tag || 'Geral',
    date: fmtDate(date),
    coverHtml,
    bodyHtml: marked.parse(content || ''),
    hasZh,
    titleZh: data.title_zh || data.title,
    bodyZhHtml: hasZh ? marked.parse(data.body_zh || '') : '',
  });

  fs.writeFileSync(path.join(OUT, slug + '.html'), html);

  index.push({
    slug,
    title: data.title || '',
    title_zh: data.title_zh || '',
    excerpt: data.excerpt || '',
    excerpt_zh: data.excerpt_zh || '',
    tag: data.tag || 'Geral',
    date,
    has_zh: hasZh,
  });
}

// mais recentes primeiro
index.sort((a, b) => new Date(b.date) - new Date(a.date));
fs.writeFileSync(path.join(SRC, 'index.json'), JSON.stringify(index, null, 2));

// página de listagem /artigos/index.html
const listItems = index.map(a => `
  <a class="item" href="/artigos/${a.slug}.html">
    <div class="meta"><span class="tag">${esc(a.tag)}</span><span>${esc(fmtDate(a.date))}</span></div>
    <h2>${esc(a.title)}</h2>
    <p>${esc(a.excerpt)}</p>
  </a>`).join('');

const listPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Artigos — GAT</title>
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600&family=Inter:wght@300;400;500&display=swap" rel="stylesheet"/>
<style>
  *{box-sizing:border-box;margin:0;padding:0}
  :root{--ink:#161310;--paper:#F4F1EA;--stone:#8B8680;--wine:#7A2530;--line:rgba(22,19,16,.12);
    --serif:'Cormorant Garamond',serif;--sans:'Inter',sans-serif}
  body{background:var(--paper);color:var(--ink);font-family:var(--sans);font-weight:300}
  nav{display:flex;align-items:center;justify-content:space-between;padding:16px 32px;border-bottom:1px solid var(--line)}
  .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
  .brand-mark{width:36px;height:36px;background:var(--ink);color:var(--paper);display:flex;align-items:center;
    justify-content:center;font-family:var(--serif);font-weight:600;font-size:16px;position:relative}
  .brand-mark::after{content:'';position:absolute;inset:4px;border:1px solid rgba(244,241,234,.4)}
  .brand-mark sup{font-size:8px}.brand b{font-family:var(--serif);font-size:18px;font-weight:600}
  .back{font-size:13px;color:var(--stone);text-decoration:none}.back:hover{color:var(--wine)}
  header{max-width:960px;margin:0 auto;padding:70px 32px 30px}
  header .eb{font-size:12px;letter-spacing:.22em;text-transform:uppercase;color:var(--wine);font-weight:500}
  header h1{font-family:var(--serif);font-weight:500;font-size:clamp(34px,6vw,56px);margin-top:14px}
  .list{max-width:960px;margin:0 auto;padding:20px 32px 90px}
  .item{display:block;text-decoration:none;color:inherit;padding:32px 0;border-top:1px solid var(--line);transition:.2s}
  .item:hover{padding-left:10px}
  .item .meta{display:flex;gap:12px;font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--stone);margin-bottom:12px}
  .item .tag{color:var(--wine);font-weight:500}
  .item h2{font-family:var(--serif);font-weight:600;font-size:26px;line-height:1.2;margin-bottom:10px}
  .item p{color:var(--stone);font-size:15px;max-width:640px}
  .empty{padding:60px 0;color:var(--stone);border-top:1px solid var(--line)}
  @media(max-width:600px){nav{padding:14px 18px}header{padding:48px 20px 20px}.list{padding:10px 20px 70px}}
</style>
</head>
<body>
<nav>
  <a class="brand" href="/"><span class="brand-mark">GA<sup>T</sup></span><b>Gonçalves</b></a>
  <a class="back" href="/">← Início</a>
</nav>
<header><p class="eb">Artigos</p><h1>Análises em direito tributário</h1></header>
<div class="list">${listItems || '<p class="empty">Nenhum artigo publicado ainda.</p>'}</div>
</body>
</html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), listPage);

console.log(`GAT build: ${index.length} artigo(s) gerado(s).`);
