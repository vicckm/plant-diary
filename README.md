# 🌿 Diario de Plantas (Plant Diary)

Aplicacao web para monitorar a **rega** e a **saude** das suas plantas. Cadastre plantas, registre regas e anotacoes com fotos, veja a timeline de cada planta e receba lembretes de quando regar.

## Funcionalidades

- Cadastro de plantas (nome, especie, local, foto de capa e intervalo de rega).
- Registro de eventos: rega, saude, anotacao e adubacao, com foto opcional.
- Botao rapido "Reguei agora".
- Calculo automatico da proxima rega e status (atrasada / regar hoje / em dia).
- Dashboard com cards e destaque das plantas que precisam de agua.
- Lembretes via notificacoes do navegador (Web Notifications API).
- Timeline cronologica do historico de cada planta.

## Stack

- [Next.js 16](https://nextjs.org/) (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- Prisma 6 + SQLite (arquivo local)
- Upload de fotos em `public/uploads`

## Requisitos

- **Node.js 20.18+** (o projeto foi configurado com a v20.18.3).
- npm

> Observacao: o Prisma 7 exige Node 20.19+. Por isso este projeto fixa o Prisma 6, compativel com Node 20.18.

## Como rodar

```bash
# 1. Instalar dependencias (gera o Prisma Client automaticamente)
npm install

# 2. Criar o banco e aplicar a migration (gera prisma/dev.db)
npx prisma migrate dev

# 3. (Opcional) Popular com dados de exemplo
npm run db:seed

# 4. Iniciar em desenvolvimento
npm run dev
```

Acesse http://localhost:3000.

## Variaveis de ambiente

Arquivo `.env` (ja incluido para desenvolvimento):

```
DATABASE_URL="file:./dev.db"
```

## Estrutura principal

```
prisma/
  schema.prisma        # modelos Plant e LogEntry
  seed.mjs             # dados de exemplo
src/
  app/
    page.tsx           # dashboard
    actions.ts         # server actions (criar planta, registrar log, regar, excluir)
    plants/new/        # cadastro de planta
    plants/[id]/       # detalhe + timeline
  components/          # PlantCard, LogTimeline, AddLogForm, WaterButton, etc.
  lib/
    db.ts              # Prisma Client
    watering.ts        # calculo de proxima rega e status
    uploads.ts         # salvar imagens enviadas
    format.ts          # formatacao de datas e rotulos
```

## Scripts uteis

- `npm run dev` — servidor de desenvolvimento
- `npm run build` / `npm start` — build e producao
- `npm run db:migrate` — aplicar migrations
- `npm run db:seed` — popular dados de exemplo
- `npm run db:studio` — abrir o Prisma Studio

## Proximos passos (fora do MVP)

- Login / multiusuario
- Sensores de umidade (IoT)
- Push notifications em background (PWA / service worker)
- Deploy (Vercel + Postgres/Supabase) e armazenamento de fotos em nuvem
