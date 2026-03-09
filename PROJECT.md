# GlicoTrack — Documento de Definição do Projeto

> Documento gerado em 2026-03-09 a partir de entrevista de levantamento de requisitos.

---

## 1. Visão Geral

**GlicoTrack** é um aplicativo web responsivo para monitoramento completo de diabetes, com foco inicial em Diabetes Tipo 1. O objetivo é oferecer uma alternativa gratuita e funcional aos apps de assinatura existentes, permitindo que pessoas com diabetes registrem e acompanhem seus dados de saúde de forma simples e centralizada.

O app deve funcionar bem em qualquer dispositivo — desktops, tablets e celulares — sem perda de usabilidade.

---

## 2. Contexto e Problema

### Problema central
Pessoas com Diabetes Tipo 1 precisam monitorar glicemia com alta frequência (tipicamente 4–8 vezes ao dia) e correlacionar esses dados com insulina, alimentação, atividade física e sintomas. Os apps existentes que oferecem esse nível de acompanhamento cobram assinatura mensal, criando uma barreira de custo.

### Público-alvo
- **Inicial:** uso familiar e pessoal (pessoa com Diabetes Tipo 1)
- **Futuro:** expansão para uso público, com múltiplos usuários independentes

---

## 3. Contexto Médico Relevante

> Esta seção serve como referência para guiar as decisões de produto.

### Diabetes Tipo 1
- O pâncreas não produz insulina; a pessoa depende de injeções diárias
- Monitoramento intensivo: geralmente 4–8 medições por dia
- Momentos típicos de medição: jejum, antes de cada refeição, 2h após cada refeição, antes de dormir

### Valores de referência (mg/dL)
| Situação | Referência |
|---|---|
| Hipoglicemia (risco imediato) | < 70 mg/dL |
| Alvo em jejum | 80–130 mg/dL |
| Alvo pós-refeição (2h) | < 180 mg/dL |
| Hiperglicemia | > 180 mg/dL |
| Hiperglicemia grave | > 250 mg/dL |

### Métrica médica principal
- **HbA1c:** exame que reflete a média de glicemia dos últimos 3 meses. Alvo geral: abaixo de 7%. É o principal indicador usado em consultas médicas.

---

## 4. Funcionalidades

### MVP (ordem de prioridade)

| # | Funcionalidade | Descrição |
|---|---|---|
| 1 | **Login e contas de usuário** | Cada usuário tem sua conta. Autenticação por email/senha |
| 2 | **Registro de glicemia** | Valor em mg/dL, data/hora, momento do dia (jejum, pré/pós refeição, antes de dormir) |
| 3 | **Registro de insulina** | Tipo de insulina (rápida/lenta), dose em unidades, horário |
| 4 | **Registro de refeições** | Descrição livre ou seleção de categoria, horário |
| 5 | **Registro de atividade física** | Tipo, duração, intensidade, horário |
| 6 | **Registro de sintomas** | Lista de sintomas comuns + campo livre, horário |
| 7 | **Gráficos e tendências** | Evolução da glicemia ao longo do tempo, correlação com outros eventos |
| 8 | **Alertas** | Notificação na tela quando glicemia está fora do range; configuração opcional por email/celular |
| 9 | **Relatório PDF** | Relatório exportável com dados e gráficos para levar a consultas médicas |

### Funcionalidades futuras (pós-MVP)
- Estimativa de HbA1c baseada nas medições
- Padrões automáticos (ex: "glicemia consistentemente alta às 22h")
- Compartilhamento de dados com cuidador ou médico
- Integração com glicosímetros Bluetooth

---

## 5. Requisitos Não-Funcionais

- **Responsividade:** funcionar em qualquer tamanho de tela (mobile-first)
- **Confiabilidade:** dados de saúde não podem ser perdidos
- **Usabilidade:** interface limpa, navegação simples — o registro deve ser rápido (pessoa pode estar se sentindo mal ao registrar)
- **Escalabilidade:** arquitetura deve suportar múltiplos usuários públicos no futuro

---

## 6. Stack Tecnológica

| Camada | Tecnologia | Justificativa |
|---|---|---|
| **Frontend** | Next.js (React) | Framework mais popular para web apps responsivos; SSR + CSR; enorme ecossistema e comunidade |
| **Estilização** | Tailwind CSS | Responsividade sem CSS customizado; acelera desenvolvimento de UI |
| **Backend** | Next.js API Routes | Sem servidor separado; tudo em um projeto; JavaScript end-to-end |
| **Banco de dados** | PostgreSQL (via Supabase) | Banco relacional ideal para dados estruturados e séries temporais; confiável e escalável |
| **Autenticação** | Supabase Auth | Login com email/senha e OAuth inclusos; sem configuração complexa |
| **Gráficos** | Recharts | Biblioteca React nativa, boa para séries temporais de glicemia |
| **PDF** | react-pdf | Geração de relatórios PDF no browser |
| **Hospedagem** | Vercel (app) + Supabase (banco) | Ambos com plano gratuito generoso; Vercel tem integração nativa com Next.js |
| **Linguagem** | TypeScript | Tipagem forte reduz bugs em dados de saúde |

### Por que essa stack?
- **Uma linguagem só** (TypeScript) do frontend ao backend
- **Plano gratuito** tanto na Vercel quanto no Supabase cobre bem o uso familiar inicial
- **Escala naturalmente:** quando o app se tornar público, Supabase e Vercel têm planos pagos sem necessidade de migração de stack

---

## 7. Design e Interface

### Referência de estilo
Apps de referência para estilo visual: **Apple Health**, **Linear**, **Notion** — caracterizados por:
- Fundo branco/claro com espaços em branco generosos
- Layout baseado em cards
- Tipografia limpa e hierarquia visual clara
- Dados apresentados de forma visual (gráficos, badges coloridos)
- Navegação simples, sem menus complexos

### Princípios de UX para este app
- **Registro rápido:** o usuário pode estar se sentindo mal ao registrar uma medição — o fluxo deve ter o mínimo de cliques possível
- **Feedback visual imediato:** valores fora do range devem ser evidenciados com cor (vermelho para hipo/hiperglicemia, verde para normal)
- **Mobile-first:** a maioria dos registros provavelmente será feita no celular
- **Dados sempre acessíveis:** histórico e gráficos devem ser fáceis de navegar

### Paleta de cores sugerida
| Status | Cor |
|---|---|
| Normal (70–180 mg/dL) | Verde |
| Atenção (180–250 mg/dL) | Amarelo/Laranja |
| Crítico (< 70 ou > 250 mg/dL) | Vermelho |
| UI geral | Azul/cinza neutro |

---

## 8. Alertas

| Trigger | Tipo de alerta |
|---|---|
| Glicemia < 70 mg/dL | Alerta crítico na tela |
| Glicemia > 180 mg/dL | Alerta de atenção na tela |
| Glicemia > 250 mg/dL | Alerta crítico na tela |

- Configuração opcional de notificações por **email** e **push notification no celular**
- Usuário define seus próprios thresholds nas configurações

---

## 9. Relatório PDF

Conteúdo sugerido do relatório:
- Período selecionado
- Resumo estatístico (média, mínimo, máximo, % no alvo)
- Gráfico de evolução da glicemia
- Tabela de registros com todos os eventos correlacionados (glicemia, insulina, refeições, atividade)
- Estimativa visual de HbA1c (quando implementado)

---

## 10. Decisões em Aberto

- [ ] Nome final do app (placeholder: GlicoTrack)
- [ ] Suporte a múltiplos perfis por conta (ex: cuidador que monitora vários pacientes)
- [ ] Definir lista de sintomas padrão para seleção rápida
- [ ] Definir tipos de insulina suportados (rápida, lenta, ultra-rápida, mista)
- [ ] Estratégia de monetização quando virar público (freemium, doação, etc.)
- [ ] LGPD/conformidade de dados de saúde para uso público
