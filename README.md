# UFC Baixada - Sistema de Gestão de Time

Webapp completo para gerenciar um time de futebol de fim de semana, com todas as funcionalidades solicitadas.

## 🎯 Funcionalidades

### Autenticação
- **Login**: admin / admin123
- Área administrativa protegida

### Dashboard
- Estatísticas gerais (jogadores ativos, disponíveis, pagamentos)
- Artilheiro da temporada
- Líder de assistências
- Últimos jogadores e pagamentos

### Gestão de Jogadores
- CRUD completo de jogadores
- Posição principal e secundária
- Status ativo/inativo e disponível/indisponível
- Busca e filtros
- Valores mensais e por jogo

### Posições e Formações
- CRUD de posições customizáveis
- Formações pré-definidas (4-3-3, 4-4-2, 3-5-2, 4-2-3-1)
- Cores por posição

### Campo Virtual
- Visualização dos jogadores em campo
- Formação selecionável
- Distribuição automática por posição
- Jogadores sem posição destacados
- Legenda de posições

### Sorteio de Times
- Seleção de jogadores disponíveis
- Configuração de número de times
- Nomes e cores customizáveis
- Equilíbrio por posição
- Distribuição de goleiros
- Visualização em lista ou campo
- Salvar como partida

### Pagamentos
- CRUD completo
- Tipos: mensal, jogo, extra, outro
- Status: pendente, pago, atrasado, isento
- Métodos: Pix, dinheiro, cartão, outro
- Filtros por jogador, status e mês
- Dashboard com totais
- Marcar como pago rapidamente

### Artilharia
- Registro de gols por partida
- Ranking automático
- Filtro por partida
- Quantidade de gols e minuto opcional
- Destaque para o artilheiro

### Assistências
- Registro de assistências
- Ranking automático
- Filtro por partida
- Destaque para o líder

### Partidas
- CRUD completo
- Vinculação com times sorteados
- Status: agendada, finalizada, cancelada
- Histórico de partidas

### Configurações
- Nome e apelido do time
- Logo por URL
- Cores personalizáveis (primária, secundária, destaque)
- Textos de cabeçalho e rodapé
- Formação padrão
- Valor padrão de pagamento
- Ativar/desativar módulos
- Resetar sistema

## 🛠️ Tecnologias

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4** (estilização)
- **React Router v6** (roteamento com HashRouter)
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

Os arquivos serão gerados na pasta `dist/`.

### Preview do Build
```bash
npm run preview
```

## 🎮 Como Usar

1. **Acesse** a aplicação no navegador
2. **Faça login** com: admin / admin123
3. **Configure** o time em Configurações (nome, cores, logo)
4. **Cadastre jogadores** na seção Jogadores
5. **Defina posições** em Posições & Formações
6. **Visualize o campo** em Campo Virtual
7. **Sorteie times** na seção Sorteio
8. **Registre pagamentos** na seção Pagamentos
9. **Registre gols e assistências** nas respectivas seções
10. **Gerencie partidas** na seção Partidas

## 📊 Dados de Exemplo

O sistema já vem com dados de exemplo:
- 12 jogadores cadastrados
- 6 posições padrão
- 4 formações pré-definidas
- 1 partida de exemplo
- Gols e assistências de exemplo
- Pagamentos de exemplo

## 🔄 Resetar Sistema

Na página de Configurações, clique em "Resetar" para restaurar todos os dados ao padrão.

## 📱 Responsividade

O sistema é totalmente responsivo e otimizado para uso em dispositivos móveis.

## 💾 Persistência

Todos os dados são salvos no localStorage do navegador. Os dados persistem entre sessões, mas são específicos do navegador utilizado.

## 🎨 Personalização

Todas as cores, textos e configurações podem ser personalizadas através da página de Configurações. As mudanças são aplicadas imediatamente em toda a interface.

## 📝 Notas Técnicas

- **HashRouter**: Utilizado para compatibilidade com ambientes de arquivo estático
- **localStorage**: Dados persistidos localmente no navegador
- **Tailwind CSS v4**: Utiliza `@import "tailwindcss"` ao invés das diretivas tradicionais
- **Caminhos relativos**: Configurados no vite.config.js para funcionar em qualquer subdiretório

## 🚀 Próximos Passos (Opcional)

- Implementar backend com Next.js + Prisma + SQLite
- Autenticação mais segura com bcryptjs
- Upload de imagens para logo
- Exportar relatórios em PDF
- Integração com WhatsApp para notificações
- Gráficos mais avançados no dashboard

---

**Desenvolvido com ❤️ para o UFC Baixada**
