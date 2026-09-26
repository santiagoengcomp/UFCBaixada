# UFC Baixada - Sistema de Gestão de Time

Webapp completo para gerenciar um time de futebol de fim de semana, com página pública e área administrativa.

## 🎯 Estrutura do Site

### 📱 Página Pública (Home)
Acesse em: `/#/`

A página inicial é **pública** e mostra informações do time para todos os visitantes:

- **Header** com logo, nome do time e temporada
- **Estatísticas** gerais (jogadores, partidas, gols)
- **Ranking de Artilharia** (top 5 goleadores)
- **Ranking de Garçons** (top 5 assistências)
- **Últimas Partidas** com times e status
- **Elenco completo** organizado por posição
- **Footer** com informações adicionais

### 🔐 Área Administrativa
Acesse em: `/#/login` (link discreto no canto superior direito)

**Credenciais:** admin / admin123

A área administrativa é protegida por login e permite:

- **Dashboard** - Estatísticas completas e visão geral
- **Jogadores** - CRUD completo de jogadores
- **Posições** - Gerenciar posições e formações
- **Campo Virtual** - Visualização dos jogadores em campo
- **Sorteio** - Sortear times para partidas
- **Pagamentos** - Gestão financeira completa
- **Artilharia** - Registrar e gerenciar gols
- **Assistências** - Registrar e gerenciar assistências
- **Partidas** - Gerenciar histórico de jogos
- **Configurações** - Personalizar todo o sistema

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (estilização)
- **React Router v6** (HashRouter para SPA)
- **Lucide React** (ícones)
- **localStorage** (persistência de dados)

## 📦 Instalação e Uso

### Desenvolvimento
```bash
npm install
npm run dev
```

### Build para Produção
```bash
npm run build
```

### Preview do Build
```bash
npm run preview
```

## 🎮 Como Usar

### Para Visitantes (Página Pública)
1. Acesse o site: `https://seu-site.vercel.app`
2. Veja informações do time, elenco, rankings e partidas
3. Não é necessário login

### Para Administradores
1. Clique em "Admin" no canto superior direito da página inicial
2. Faça login com: **admin / admin123**
3. Configure o time em Configurações (nome, cores, logo)
4. Cadastre jogadores na seção Jogadores
5. Defina posições em Posições & Formações
6. Visualize o campo em Campo Virtual
7. Sorteie times na seção Sorteio
8. Registre pagamentos na seção Pagamentos
9. Registre gols e assistências nas respectivas seções
10. Gerencie partidas na seção Partidas

## 📊 Dados de Exemplo

O sistema já vem com dados de exemplo:
- 12 jogadores cadastrados
- 6 posições padrão
- 4 formações pré-definidas
- 1 partida de exemplo
- Gols e assistências de exemplo
- Pagamentos de exemplo

## 🔄 Resetar Sistema

Na página de Configurações (admin), clique em "Resetar" para restaurar todos os dados ao padrão.

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para uso em dispositivos móveis.

## 💾 Persistência

Todos os dados são salvos no localStorage do navegador. Os dados persistem entre sessões, mas são específicos do navegador utilizado.

## 🎨 Personalização

Todas as cores, textos e configurações podem ser personalizadas através da página de Configurações (admin). As mudanças são aplicadas imediatamente em toda a interface, incluindo a página pública.

## 🚀 Deploy no Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. Crie um repositório no GitHub
2. Acesse https://vercel.com e faça login
3. Importe o repositório
4. O Vercel detectará automaticamente as configurações
5. Deploy!

### Opção 2: Deploy via Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

## 📝 Notas Técnicas

- **HashRouter**: Utilizado para compatibilidade com ambientes de arquivo estático
- **Página Pública**: Rota `/` mostra informações do time sem necessidade de login
- **Área Admin**: Rotas `/admin/*` protegidas por autenticação
- **localStorage**: Dados persistidos localmente no navegador
- **Tailwind CSS v4**: Utiliza `@import "tailwindcss"` ao invés das diretivas tradicionais

## 🔒 Segurança

- A página pública não expõe dados sensíveis (apenas informações do time)
- A área administrativa é protegida por login
- Dados de pagamento são visíveis apenas para administradores
- Sessão armazenada em sessionStorage (expira ao fechar o navegador)

## 📋 Estrutura de Rotas

```
/                    → Página pública (Home)
/login              → Login administrativo
/admin              → Dashboard (protegido)
/admin/players      → Gestão de jogadores (protegido)
/admin/positions    → Posições e formações (protegido)
/admin/virtual-field → Campo virtual (protegido)
/admin/draw         → Sorteio de times (protegido)
/admin/payments     → Pagamentos (protegido)
/admin/goals        → Artilharia (protegido)
/admin/assists      → Assistências (protegido)
/admin/matches      → Partidas (protegido)
/admin/settings     → Configurações (protegido)
```

## ✅ Critérios de Aceite

- ✅ Página pública acessível sem login
- ✅ Informações do time visíveis para todos
- ✅ Rankings de artilharia e assistências públicos
- ✅ Elenco organizado por posição
- ✅ Últimas partidas visíveis
- ✅ Área administrativa protegida por login
- ✅ CRUD completo de jogadores
- ✅ Campo virtual funcional
- ✅ Sorteio de times com equilíbrio
- ✅ Gestão de pagamentos
- ✅ Registro de gols e assistências
- ✅ Personalização total via configurações
- ✅ Responsivo e mobile-first
- ✅ Pronto para deploy no Vercel

---

**Desenvolvido com ❤️ para o UFC Baixada**
