/*
 * GAT — gerador de artigos
 * Lê os arquivos .md criados pelo painel (pasta /articles),
 * gera uma página HTML para cada um (pasta /artigos) e um
 * índice (articles/index.json) que a home usa para listar.
 * Também gera sitemap.xml e robots.txt para o Google encontrar
 * todas as páginas automaticamente.
 * Roda automaticamente no Netlify a cada publicação.
 */
const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const SRC = path.join(__dirname, 'articles');   // markdown de origem
const OUT = path.join(__dirname, 'artigos');     // páginas HTML publicadas
const SITE_URL = 'https://gat.adv.br';           // domínio publicado

if (!fs.existsSync(SRC)) { fs.mkdirSync(SRC, { recursive: true }); }
if (!fs.existsSync(OUT)) { fs.mkdirSync(OUT, { recursive: true }); }

const esc = s => String(s || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fmtDate = d => { try { return new Date(d).toLocaleDateString('pt-BR', { year: 'numeric', month: 'long', day: 'numeric' }); } catch { return ''; } };

/* ============================================================
   CSS compartilhado (Paleta Noir — mesma da home)
   ============================================================ */
const NOIR_CSS = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#121212;--bg-card:#1E1E1E;--bg-card-hover:#2A2A2A;
    --text-main:#F5F5F7;--text-body:#C0C0C5;--muted:#7A7A80;
    --border-soft:rgba(255,255,255,.06);--green:#2E8B57;--maxw:1200px;
  }
  html{scroll-behavior:smooth}
  body{background:var(--bg);color:var(--text-body);font-family:'Inter',-apple-system,BlinkMacSystemFont,sans-serif;
    font-weight:400;line-height:1.6;-webkit-font-smoothing:antialiased;overflow-x:hidden}
  a{color:inherit}
  .navbar{position:fixed;top:0;left:0;right:0;z-index:100;padding:16px 36px;
    background:rgba(18,18,18,.75);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
    border-bottom:1px solid var(--border-soft);display:flex;justify-content:space-between;align-items:center;
    max-width:var(--maxw);margin:0 auto}
  .navbar .logo{display:flex;align-items:center;gap:11px;text-decoration:none;color:var(--text-main)}
  .navbar .logo img{width:34px;height:34px;display:block}
  .navbar .logo .logo-text{display:flex;flex-direction:column;line-height:1.2}
  .navbar .logo .logo-name{font-family:'Source Serif 4',Georgia,serif;font-size:17px;font-weight:600;
    letter-spacing:.14em;text-transform:uppercase;color:var(--text-main)}
  .navbar .logo .logo-sub{font-family:'Source Serif 4',Georgia,serif;font-size:8px;font-weight:400;
    letter-spacing:.31em;text-transform:uppercase;color:var(--muted)}
  @media(max-width:600px){.navbar .logo .logo-sub{display:none}.navbar .logo .logo-name{font-size:15px}
    .navbar .logo img{width:30px;height:30px}}
  .navbar .back{display:inline-flex;align-items:center;gap:8px;font-size:14px;font-weight:500;
    color:var(--text-body);text-decoration:none;padding:8px 18px;border:1px solid var(--border-soft);
    border-radius:100px;background:rgba(255,255,255,.05);transition:all .3s ease}
  .navbar .back:hover{background:rgba(255,255,255,.1);color:var(--text-main)}
  .btn-primary{display:inline-flex;align-items:center;justify-content:center;gap:9px;height:52px;padding:0 28px;
    border-radius:100px;background:#000;color:#fff;border:1px solid rgba(255,255,255,.15);
    font-family:'Inter',sans-serif;font-size:15px;font-weight:600;text-decoration:none;transition:all .3s ease}
  .btn-primary:hover{transform:translateY(-2px);border-color:var(--text-body)}
`;

/* ============================================================
   Página de artigo
   ============================================================ */
function page({ title, tag, date, isoDate, excerpt, slug, coverHtml, coverUrl, bodyHtml, hasZh, titleZh, bodyZhHtml, tagZh, faq }) {
  const url = `${SITE_URL}/artigos/${slug}.html`;
  const description = esc(excerpt || (bodyHtml || '').replace(/<[^>]+>/g, '').slice(0, 155));
  const ogImage = coverUrl || `${SITE_URL}/gat-horizontal.png`;
  const jsonLd = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: excerpt || undefined,
    image: coverUrl || undefined,
    datePublished: isoDate || undefined,
    author: { '@type': 'Person', name: 'Raphael da Silva Gonçalves' },
    publisher: {
      '@type': 'LegalService',
      name: 'GAT — Gonçalves Advocacia Tributária',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/gat-classico.png` },
    },
    mainEntityOfPage: url,
  });
  const faqJsonLd = (Array.isArray(faq) && faq.length) ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }) : '';

  const fontsHref = hasZh
    ? 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&family=Noto+Serif+SC:wght@400;500;600&display=swap'
    : 'https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap';

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
<meta name="description" content="${description}"/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="theme-color" content="#121212"/>
<link rel="canonical" href="${url}"/>
<meta property="og:type" content="article"/>
<meta property="og:site_name" content="GAT — Gonçalves Advocacia Tributária"/>
<meta property="og:locale" content="pt_BR"/>
<meta property="og:url" content="${url}"/>
<meta property="og:title" content="${esc(title)}"/>
<meta property="og:description" content="${description}"/>
<meta property="og:image" content="${esc(ogImage)}"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:title" content="${esc(title)}"/>
<meta name="twitter:description" content="${description}"/>
<meta name="twitter:image" content="${esc(ogImage)}"/>
<script type="application/ld+json">${jsonLd}</script>
${faqJsonLd ? `<script type="application/ld+json">${faqJsonLd}</script>\n` : ''}<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
<link rel="apple-touch-icon" href="/favicon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="${fontsHref}" rel="stylesheet"/>
<style>
${NOIR_CSS}
  html[data-lang="pt"] .zh{display:none !important}
  html[data-lang="zh"] .pt-only{display:none !important}
  html[data-lang="zh"] .art-body,html[data-lang="zh"] h1{font-family:'Noto Serif SC',serif;line-height:1.9}
  .progress{position:fixed;top:0;left:0;height:2px;width:0;z-index:101;
    background:linear-gradient(90deg,rgba(245,245,247,.5),#F5F5F7);pointer-events:none}
  .lang-toggle{display:flex;border:1px solid var(--border-soft);border-radius:100px;overflow:hidden}
  .lang-toggle button{background:none;border:none;cursor:pointer;padding:7px 14px;color:var(--muted);
    font:inherit;font-weight:500;font-size:12px;letter-spacing:.05em;transition:all .3s ease}
  .lang-toggle button.active{background:var(--text-main);color:var(--bg)}
  article{max-width:760px;margin:0 auto;padding:140px 24px 96px}
  .art-meta{display:flex;gap:14px;align-items:center;font-size:12px;letter-spacing:.12em;
    text-transform:uppercase;color:var(--muted);margin-bottom:18px}
  .art-meta .tag{color:var(--text-main);font-weight:600}
  article h1{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:clamp(30px,5vw,44px);
    line-height:1.15;letter-spacing:-.02em;margin-bottom:16px;color:var(--text-main)}
  .art-cover{width:100%;margin:28px 0;border-radius:16px;border:1px solid var(--border-soft)}
  .art-body{font-size:17px;color:var(--text-body);margin-top:32px}
  .art-body h2{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:28px;margin:44px 0 14px;
    line-height:1.2;letter-spacing:-.02em;color:var(--text-main)}
  .art-body h3{font-weight:600;font-size:19px;margin:30px 0 10px;letter-spacing:-.02em;color:var(--text-main)}
  .art-body p{margin-bottom:20px}
  .art-body ul,.art-body ol{margin:0 0 20px 22px}
  .art-body li{margin-bottom:8px}
  .art-body blockquote{background:var(--bg-card);border:1px solid var(--border-soft);border-radius:16px;
    padding:22px 24px;margin:28px 0;color:var(--text-body)}
  .art-body blockquote p{margin:0}
  .art-body a{color:var(--text-main);text-decoration:underline;text-underline-offset:3px}
  .art-body strong{font-weight:600;color:var(--text-main)}
  .art-foot{margin-top:56px;padding-top:32px;border-top:1px solid var(--border-soft)}
  .art-foot .disc{margin-top:24px;font-size:12px;color:var(--muted);line-height:1.7}
  @media(max-width:810px){.navbar{padding:14px 20px}article{padding:120px 20px 72px}}
</style>
</head>
<body>
<div class="progress" id="progress" aria-hidden="true"></div>
<nav class="navbar">
  <a class="logo" href="/">
    <img src="/gat-marca.png" alt="" width="34" height="34"/>
    <span class="logo-text"><span class="logo-name">Gonçalves</span><span class="logo-sub">Advocacia Tributária</span></span>
  </a>
  <div style="display:flex;align-items:center;gap:12px">
    ${toggle}
    <a class="back" href="/artigos/">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
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
    <a class="btn-primary" href="https://wa.me/5592981267195" target="_blank" rel="noopener noreferrer">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2z"/></svg>
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
  var bar=document.getElementById('progress');
  window.addEventListener('scroll',function(){
    var max=document.documentElement.scrollHeight-window.innerHeight;
    bar.style.width=(max>0?(window.scrollY/max)*100:0)+'%';
  },{passive:true});
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
  const coverHtml = data.cover ? `<img class="art-cover" src="${esc(data.cover)}" alt="${esc(data.title)}" loading="lazy"/>` : '';
  const hasZh = !!data.has_zh && !!data.body_zh;

  const html = page({
    title: data.title || 'Artigo',
    tag: data.tag || 'Geral',
    tagZh: data.tag || 'Geral',
    date: fmtDate(date),
    isoDate: date ? new Date(date).toISOString() : '',
    excerpt: data.excerpt || '',
    slug,
    coverHtml,
    coverUrl: data.cover || '',
    bodyHtml: marked.parse(content || ''),
    hasZh,
    titleZh: data.title_zh || data.title,
    bodyZhHtml: hasZh ? marked.parse(data.body_zh || '') : '',
    faq: data.faq || null,
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

/* ============================================================
   Página de listagem /artigos/index.html
   ============================================================ */
const listItems = index.map((a, i) => `
  <a class="item inview${i % 3 === 1 ? ' dl1' : i % 3 === 2 ? ' dl2' : ''}" href="/artigos/${a.slug}.html">
    <div>
      <div class="meta"><span class="tag">${esc(a.tag)}</span><span>${esc(fmtDate(a.date))}</span></div>
      <h2>${esc(a.title)}</h2>
      <p>${esc(a.excerpt)}</p>
    </div>
    <span class="arrow">→</span>
  </a>`).join('');

const listPage = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Artigos sobre Direito Tributário — GAT</title>
<meta name="description" content="Análises sobre autuações fiscais, execução fiscal, planejamento tributário e Zona Franca de Manaus, por Raphael da Silva Gonçalves (OAB/AM 18.561)."/>
<meta name="robots" content="index, follow, max-image-preview:large"/>
<meta name="theme-color" content="#121212"/>
<link rel="canonical" href="${SITE_URL}/artigos/index.html"/>
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32.png"/>
<link rel="apple-touch-icon" href="/favicon.png"/>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,400;14..32,500;14..32,600;14..32,700&family=Source+Serif+4:opsz,wght@8..60,400;8..60,600&display=swap" rel="stylesheet"/>
<style>
${NOIR_CSS}
  header.page{max-width:960px;margin:0 auto;padding:150px 24px 24px}
  header.page .label{font-size:13px;font-weight:500;text-transform:uppercase;letter-spacing:.12em;
    color:var(--muted);margin-bottom:8px}
  header.page h1{font-size:clamp(36px,6vw,54px);font-weight:600;letter-spacing:-.05em;line-height:1.1;
    color:var(--text-main);margin-bottom:14px}
  header.page .desc{font-size:17px;color:var(--text-body);max-width:580px;line-height:1.6}
  .list{max-width:960px;margin:0 auto;padding:24px 24px 90px}
  .item{display:flex;justify-content:space-between;align-items:center;gap:24px;text-decoration:none;
    color:inherit;padding:28px 0;border-bottom:1px solid var(--border-soft);transition:all .3s ease}
  .item:first-child{border-top:1px solid var(--border-soft)}
  .item:hover{padding-left:12px;border-color:rgba(255,255,255,.2)}
  .item .meta{display:flex;gap:14px;font-size:12px;letter-spacing:.1em;text-transform:uppercase;
    color:var(--muted);margin-bottom:10px}
  .item .tag{color:var(--text-main);font-weight:600}
  .item h2{font-family:'Source Serif 4',Georgia,serif;font-weight:600;font-size:24px;line-height:1.25;
    letter-spacing:-.02em;color:var(--text-main);margin-bottom:8px}
  .item p{color:var(--text-body);font-size:15px;max-width:640px;line-height:1.6}
  .item .arrow{font-size:18px;color:var(--muted);transition:all .3s ease;flex-shrink:0}
  .item:hover .arrow{transform:translateX(6px);color:var(--text-main)}
  .empty{padding:60px 0;color:var(--muted);border-top:1px solid var(--border-soft)}
  @media (prefers-reduced-motion: no-preference){
    .inview{opacity:0;transform:translateY(22px);
      transition:opacity .75s cubic-bezier(.16,1,.3,1),transform .75s cubic-bezier(.16,1,.3,1)}
    .inview.is-visible{opacity:1;transform:translateY(0)}
    .inview.dl1{transition-delay:.08s}
    .inview.dl2{transition-delay:.16s}
  }
  @media(max-width:810px){.navbar{padding:14px 20px}header.page{padding:130px 20px 16px}.list{padding:16px 20px 70px}}
</style>
</head>
<body>
<nav class="navbar">
  <a class="logo" href="/">
    <img src="/gat-marca.png" alt="" width="34" height="34"/>
    <span class="logo-text"><span class="logo-name">Gonçalves</span><span class="logo-sub">Advocacia Tributária</span></span>
  </a>
  <a class="back" href="/">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M19 12H5M11 18l-6-6 6-6"/></svg>
    Início
  </a>
</nav>
<header class="page">
  <div class="label">Publicações</div>
  <h1>Para entender antes de decidir.</h1>
  <p class="desc">Artigos sobre autuações fiscais, planejamento tributário e incentivos da Zona Franca de Manaus — escritos para ajudar você a entender o problema, não para vender um serviço.</p>
</header>
<div class="list">${listItems || '<p class="empty">Nenhum artigo publicado ainda.</p>'}</div>
<script>
  (function(){
    if(!('IntersectionObserver' in window)){
      document.querySelectorAll('.inview').forEach(function(el){el.classList.add('is-visible')});
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){e.target.classList.add('is-visible');io.unobserve(e.target)}
      });
    },{threshold:.12,rootMargin:'0px 0px -40px 0px'});
    document.querySelectorAll('.inview').forEach(function(el){io.observe(el)});
  })();
</script>
</body>
</html>`;
fs.writeFileSync(path.join(OUT, 'index.html'), listPage);

// ---------------------------------------------------------------
// sitemap.xml — lista todas as páginas do site para o Google
// descobrir automaticamente artigos novos, sem indexação manual.
// ---------------------------------------------------------------
const today = new Date().toISOString().split('T')[0];
const toIsoDate = d => { try { return new Date(d).toISOString().split('T')[0]; } catch { return today; } };

const sitemapUrls = [
  { loc: `${SITE_URL}/`, lastmod: today },
  { loc: `${SITE_URL}/artigos/index.html`, lastmod: today },
  ...index.map(a => ({
    loc: `${SITE_URL}/artigos/${a.slug}.html`,
    lastmod: a.date ? toIsoDate(a.date) : today,
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
  </url>`).join('\n')}
</urlset>`;

fs.writeFileSync(path.join(__dirname, 'sitemap.xml'), sitemapXml);

// robots.txt — aponta o Google direto para o sitemap
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(__dirname, 'robots.txt'), robotsTxt);

console.log(`GAT build: ${index.length} artigo(s) gerado(s). Sitemap com ${sitemapUrls.length} URL(s).`);
