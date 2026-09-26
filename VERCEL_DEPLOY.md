# Deploy no Vercel - UFC Baixada

## ✅ Configurações Realizadas

O projeto foi configurado para deploy no Vercel com as seguintes otimizações:

1. **vercel.json** - Configuração de build e rewrites para SPA
2. **package.json** - Scripts adicionados (dev, build, preview)
3. **.gitignore** - Ignora arquivos desnecessários
4. **vite.config.js** - Configuração otimizada para Vercel

## 🚀 Como Fazer Deploy no Vercel

### Opção 1: Deploy via GitHub (Recomendado)

1. **Crie um repositório no GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit - UFC Baixada"
   git branch -M main
   git remote add origin https://github.com/seu-usuario/ufc-baixada.git
   git push -u origin main
   ```

2. **Acesse o Vercel**
   - Vá para https://vercel.com
   - Faça login com sua conta GitHub

3. **Importe o Projeto**
   - Clique em "Add New Project"
   - Selecione o repositório do GitHub
   - O Vercel detectará automaticamente que é um projeto Vite

4. **Configurações de Deploy**
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

5. **Deploy**
   - Clique em "Deploy"
   - Aguarde o build (geralmente 1-2 minutos)
   - Seu site estará disponível em: `https://seu-projeto.vercel.app`

### Opção 2: Deploy via Vercel CLI

1. **Instale o Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Faça login**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Deploy para Produção**
   ```bash
   vercel --prod
   ```

## 🔧 Configurações do vercel.json

O arquivo `vercel.json` já está configurado com:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

**Importante**: O `rewrites` garante que todas as rotas do React Router funcionem corretamente (SPA).

## 📋 Checklist Antes do Deploy

- [x] Build funcionando (`npm run build`)
- [x] vercel.json configurado
- [x] .gitignore criado
- [x] package.json com scripts corretos
- [x] vite.config.js otimizado
- [x] HashRouter configurado (funciona em produção)

## 🎯 Após o Deploy

1. **Acesse seu site**: `https://seu-projeto.vercel.app`
2. **Faça login**: admin / admin123
3. **Configure o time**: Vá em Configurações
4. **Personalize**: Cores, logo, textos

## 🔄 Atualizações Automáticas

O Vercel faz deploy automático quando você faz push para o repositório:

- **Branch main**: Deploy para produção
- **Outras branches**: Deploy para preview
- **Pull Requests**: Deploy automático para revisão

## 🌐 Domínio Customizado (Opcional)

1. No dashboard do Vercel, vá em "Settings" > "Domains"
2. Adicione seu domínio (ex: `ufcbaixada.com`)
3. Configure o DNS conforme instruções do Vercel
4. Aguarde a propagação (pode levar até 24h)

## 🐛 Troubleshooting

### Problema: "Page not found" ao acessar rotas
**Solução**: Verifique se o `vercel.json` está com os `rewrites` configurados corretamente.

### Problema: Assets não carregam
**Solução**: Verifique se o build foi concluído com sucesso e se a pasta `dist` foi gerada.

### Problema: HashRouter não funciona
**Solução**: Certifique-se de que está usando `HashRouter` no App.tsx (já configurado).

## 📊 Comandos Úteis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Deploy via CLI
vercel --prod
```

## ✅ Sucesso!

Seu projeto está pronto para deploy no Vercel. Basta seguir os passos acima e seu site estará online em poucos minutos!

---

**Dica**: O Vercel oferece deploy gratuito para projetos pessoais e open source. Para projetos comerciais, verifique os planos disponíveis.
