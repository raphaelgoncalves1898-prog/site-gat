# Site GAT — Gonçalves Advocacia Tributária

Site estático publicado no Netlify em https://gat.adv.br.

## Estrutura

- `index.html` — home (design "Noir": fundo `#121212`, cards `#1E1E1E`, tipografia Inter + Source Serif 4, cantos arredondados 20px, botões em pílula).
- `articles/*.md` — artigos em markdown com frontmatter (`title`, `excerpt`, `tag`, `date`, opcional `cover`, `faq` e `has_zh`/`body_zh`).
- `build.js` — gera `/artigos/*.html` (páginas), `/artigos/index.html` (listagem), `articles/index.json` (a home lê para listar), `sitemap.xml` e `robots.txt`. Roda no deploy do Netlify (`npm install && npm run build`).
- `artigos/`, `articles/index.json`, `sitemap.xml`, `robots.txt` são **artefatos de build** — gitignorados, nunca commitá-los.

## Regras de design

- Toda página nova (artigo, listagem, o que for) segue o padrão visual da home: paleta Noir, Inter para corpo, Source Serif 4 para títulos, `border-radius` 16–20px, animações discretas com `IntersectionObserver` sempre dentro de `@media (prefers-reduced-motion: no-preference)`.
- O CSS compartilhado das páginas de artigo vive em `NOIR_CSS` dentro do `build.js` — alterações de identidade visual devem ser refletidas lá E no `index.html`.

## Regras de conteúdo — LEIA ANTES DE ESCREVER QUALQUER TEXTO

Todo texto do site (páginas, artigos, meta descriptions, CTAs) segue `docs/guia-conteudo-gat.md`. Resumo do que é inegociável (Provimento 205/2021 da OAB):

- ❌ Nunca prometer resultado de causa ou percentual de êxito.
- ❌ Nunca usar urgência/escassez artificial ("vagas limitadas", contadores).
- ❌ Nunca usar linguagem mercantilista ou comparativa ("os melhores do Amazonas").
- ❌ Nunca dizer que o escritório é "pequeno" — o diferencial é continuidade da equipe, não porte.
- ✅ Regra 80/20: o texto fala da dor do cliente, não da empresa.
- ✅ Todo artigo termina com CTA leve e o disclaimer da OAB (o template do `build.js` já o inclui — não duplicar no corpo).
- ✅ Escrever para uma das 3 personas do guia (diretor de indústria da ZFM, empresário autuado, pessoa física de alta renda).

## Comandos

- `npm install && npm run build` — gera tudo. Sempre rodar e conferir antes de commitar mudanças no `build.js` ou em artigos.
