# Novo texto do site — GAT
### Revisão de conteúdo aplicando o Guia GAT + "Marketing de Conteúdo: A Moeda do Século XXI" (Rafael Rez)

> Este documento contém **apenas texto**. O redesign visual fica para a próxima etapa. Estrutura abaixo segue a ordem das seções do HTML atual, para facilitar o copia-e-cola depois.

---

## Notas de revisão — o que mudou e por quê

- **H1 do Hero trocado — duas vezes.** Primeiro, de *"Direito tributário de precisão®"* — o guia cita "precisão"/"excelência" como exemplo de adjetivo genérico a evitar no checklist do Hero (seção 5), e o ® não fazia sentido numa frase descritiva solta. Na primeira reescrita, o H1 virou *"A mesma equipe, do início ao fim do seu caso tributário"* — mas essa é uma frase de argumento (prova de continuidade), não de gancho: como só ~20% dos visitantes leem além do título, o H1 precisa fazer a primeira pergunta, não já responder algo. Segue a regra 1 de título do livro (apelar ao autointeresse do leitor, prometer resposta a uma dúvida real). O argumento de continuidade continua onde já estava, na seção Abordagem — é lá que ele convence, não na porta de entrada.
- **Abordagem reescrita de fora para dentro — e corrigida depois de feedback.** A primeira versão contrastava "escritórios de grande estrutura" (fragmentados) com a GAT, o que sugeria por tabela que a GAT é pequena ou tem poucos advogados. Isso é ruído: a GAT tem estrutura e equipe reais, o diferencial não é tamanho, é continuidade — o mesmo time responsável do diagnóstico ao encerramento. Separei as duas coisas na reescrita abaixo: capacidade/estrutura (afirmada, não negada) e continuidade do time (o diferencial de fato). Isso importa especialmente para a Persona 1, que decide com base em risco e tende a desconfiar de estruturas pequenas demais para sustentar uma demanda contínua.
- **Áreas de atuação ligadas às personas.** Os 6 cards agora descrevem o problema do cliente, não só o nome jurídico do serviço. Zona Franca de Manaus fala diretamente do medo real da Persona 1 (perda de incentivo); Pessoa Física usa a palavra "discrição", que é exatamente o que a Persona 3 valoriza.
- **Nenhum número foi inventado.** O guia recomenda substituir promessa de resultado por fato neutro quantificável (ex.: anos de atuação). Não tenho como confirmar esse número, então deixei marcado com `[ ]` onde os sócios devem preencher — não inseri um "10 anos" chutado.
- **CTAs sem gatilho de urgência**, compliance com a seção 8 (Provimento 205/2021 da OAB): nenhuma promessa de resultado, percentual de êxito, ou linguagem mercantilista em nenhum texto abaixo.
- **Formulário:** placeholder do campo de mensagem ficou mais convidativo e explicitamente opcional, reduzindo o atrito do primeiro contato.
- **Duas inconsistências de conteúdo no HTML atual, fora do escopo de "texto novo" mas que valem correção:** (1) o rodapé linka "Sobre" para a âncora que no menu principal chama-se "Abordagem" — sugiro unificar o rótulo; (2) o ticker do topo lista 5 das 6 áreas de atuação — falta "Tributação de Pessoas Físicas". Corrigi os dois abaixo.

---

## 1. Metadados (SEO / `<head>`)

**Title** (usar em `<title>`, `og:title` e `twitter:title`) — já segue boas práticas (palavra-chave + cidade), mantive:
```
Advogado Tributarista em Manaus | GAT Advocacia Tributária
```

**Descrição** (usar em `meta description`, `og:description` e `twitter:description`) — encurtada e sem promessa, mantendo as palavras-chave de cauda longa da seção 6.5:
```
Defesa de autuações fiscais, planejamento tributário e recuperação de créditos, com atuação nacional e foco nos incentivos da Zona Franca de Manaus (SUFRAMA).
```

---

## 2. Hero (topo da página)

**Ticker (marquee de categorias)** — adicionar a 6ª área que faltava:
```
Autuações Fiscais · Planejamento Tributário · Recuperação de Créditos · Execução Fiscal · Zona Franca de Manaus · Tributação de Pessoas Físicas
```

**H1:**
```
Você sabe qual é o seu risco tributário agora?
```

**Subtítulo:**
```
Defesa de autuações fiscais, planejamento tributário e recuperação de créditos tributários. Atuação em todo o Brasil, com conhecimento aprofundado dos incentivos da Zona Franca de Manaus.
```

**Botão primário:**
```
Iniciar diagnóstico
```

**Botão secundário (WhatsApp):**
```
Falar pelo WhatsApp
Resposta em até 24h
```

> **Placeholder opcional, não preenchido:** se os sócios quiserem, cabe aqui ou na seção Abordagem uma frase de credibilidade com número real, no formato que o guia recomenda (seção 5): *"Mais de `[X]` anos dedicados exclusivamente a contencioso tributário na Zona Franca de Manaus."* Só usar depois de confirmar o número — nunca estimar.

---

## 3. Seção "Abordagem"

**Label:** `Abordagem` (mantido)

**H2:**
```
Primeiro o diagnóstico. Depois, a estratégia.
```

**Parágrafo de introdução:**
```
Um caso tributário complexo exige duas coisas ao mesmo tempo: estrutura suficiente para sustentar a demanda e continuidade suficiente para não perder o contexto pelo caminho. Na GAT, as duas acontecem juntas. A equipe responsável pelo diagnóstico é a mesma que conduz a estratégia e permanece até o encerramento do caso — com o suporte técnico necessário para acompanhar operações de médio e grande porte, sem repasses no meio do caminho.
```

**Cards (I–IV):**

| Tag | Título | Descrição |
|---|---|---|
| I | Diagnóstico | Antes de qualquer tese, uma imersão real nos documentos, no histórico fiscal e no contexto operacional do seu caso. |
| II | Estratégia | Construída a partir dos fatos do seu caso e da jurisprudência aplicável — nunca de um modelo genérico replicado de outro cliente. |
| III | Comunicação | Cada decisão explicada em linguagem clara, para que você entenda as opções antes de escolher um caminho — não depois. |
| IV | Continuidade | A mesma equipe responsável assina o caso do diagnóstico ao encerramento, com a estrutura necessária para sustentar demandas de qualquer porte. |

---

## 4. Seção "Áreas de Atuação"

**Label:** `Áreas de atuação` (mantido)

**H2:**
```
Cada situação tributária pede uma resposta diferente.
```

**Parágrafo de introdução:**
```
De uma autuação recém-recebida a um planejamento para os próximos anos, cada uma das frentes abaixo responde a um momento diferente da vida fiscal de uma empresa ou de uma pessoa física.
```

**Cards (6):**

| Tag | Título | Descrição |
|---|---|---|
| Defesa | Autuações Fiscais | Defesa administrativa e judicial de autuações da Receita Federal e da SEFAZ-AM, com atenção aos prazos e às provas que sustentam o caso. |
| Estratégia | Planejamento Tributário | Revisão de regime tributário, modelagem de operações e identificação de oportunidades legítimas de economia fiscal dentro da legislação vigente. |
| Recuperação | Créditos Tributários | Análise sistemática dos recolhimentos dos últimos anos para identificar pagamentos indevidos ou a maior, com potencial de recuperação ou compensação. |
| Execução | Execução Fiscal | Atuação em execuções fiscais, com foco em exceções de pré-executividade e embargos. |
| Incentivos | Zona Franca de Manaus | Suporte para adequação ao Processo Produtivo Básico (PPB), aprovação de projetos na SUFRAMA e prevenção de perda de incentivos fiscais da ZFM. |
| Pessoa Física | Tributação de Pessoas Físicas | Planejamento sucessório e revisão da tributação de pessoas físicas com patrimônio ou renda variável — com discrição e antecedência. |

---

## 5. Seção "Artigos" (blog)

**Label:** `Publicações` (mantido)

**H2:**
```
Para entender antes de decidir.
```

**Parágrafo de introdução:**
```
Artigos sobre autuações fiscais, planejamento tributário e incentivos da Zona Franca de Manaus — escritos para ajudar você a entender o problema, não para vender um serviço.
```

**CTA "ver todos":**
```
Ver todos os artigos
```

### Bônus — sugestões de pauta (não é texto do site atual; o `articles/index.json` está vazio)

Seguindo a seção 6.1 (mix de funil) e 6.2 (regras de título) do guia, para dar um ponto de partida ao calendário editorial:

**Topo de funil**
1. "O que é PPB e por que ele pode comprometer o incentivo fiscal da sua empresa na Zona Franca de Manaus"
2. "5 situações que costumam levar empresas a uma autuação fiscal sem perceber"

**Meio de funil**
3. "Recebeu uma notificação da SEFAZ-AM? Veja os prazos e os primeiros passos"
4. "Como funciona, na prática, a recuperação de créditos tributários"

**Fundo de funil**
5. "10 perguntas objetivas antes de contratar um advogado tributarista"
6. "Defesa administrativa ou judicial: o que muda para a sua empresa"

---

## 6. Seção "Contato"

**Label:** `Fale conosco` (mantido)

**H2:** (já estava bom — humano, sem gatilho — mantido)
```
A conversa começa aqui.
```

**Parágrafo de introdução:**
```
Autuação recebida. Operação em revisão. Planejamento a definir. Uma conversa já ajuda a entender os próximos passos.
```

**Bloco de informações:**
```
Raphael da Silva Gonçalves
OAB/AM 18.561
(92) 98126-7195
raphael@gat.adv.br
Atendimento em todo o Brasil
```

**Formulário — placeholders dos campos:**
```
Seu nome
E-mail
Telefone
Empresa
Assunto
Descreva brevemente sua situação (opcional)
```

**Botão:**
```
Enviar mensagem
```

**Mensagens de feedback:**
```
Sucesso: ✓ Mensagem enviada. Retornaremos em breve.
Erro: Erro ao enviar. Tente pelo WhatsApp.
```

---

## 7. Rodapé

```
GAT · Gonçalves Advocacia Tributária
© 2026 · Todos os direitos reservados
```

**Links de navegação do rodapé** — corrigir "Sobre" para "Abordagem", unificando com o menu principal:
```
Abordagem · Áreas · Artigos · Contato
(92) 98126-7195 · raphael@gat.adv.br
```

---

## 8. Menu (Navbar / Drawer)

Sem alterações — já são rótulos diretos e sem ambiguidade:
```
Abordagem
Áreas
Artigos
Contato
```

---

## Checklist final aplicado (seções 8, 9 e 10 do guia)

- [x] Nenhuma promessa de resultado de causa ou percentual de êxito.
- [x] Nenhuma urgência ou escassez artificial.
- [x] Nenhuma linguagem mercantilista ou comparativa agressiva.
- [x] Nenhum número de credibilidade inventado — placeholder explícito onde falta dado real.
- [x] H1 comunica benefício real, não adjetivo vago.
- [x] Textos institucionais abrem pela realidade do cliente, não pela empresa (regra 80/20).
- [x] CTAs reduzem o risco percebido do primeiro contato, sem "compre agora".
- [x] Cada área de atuação fala de um problema real, ligado a uma persona específica.
