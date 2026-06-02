# 🌿 GreenHerb — Sistema de Gestão de Ervas Aromáticas

Trabalho Prático de Programação Web — Sprint 4 completo.

## Stack Tecnológica
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Node.js + Express.js
- **Base de Dados:** MongoDB (via Mongoose)
- **Autenticação:** JWT (JSON Web Tokens)
- **Outros:** bcryptjs, multer (CSV), cors, dotenv

## Pré-requisitos
- Node.js instalado
- Conta no MongoDB Atlas (ou MongoDB local)

## Instalação

```bash
# 1. Instalar dependências (na raiz do projeto)
npm install

# 2. Instalar multer (necessário para upload de ficheiros CSV)
npm install multer

# 3. Criar ficheiro de variáveis de ambiente
cp .env.example .env
# Editar o .env com a tua MONGO_URI e JWT_SECRET

# 4. Iniciar o servidor (na pasta backend)
cd backend
node server.js


```

O servidor fica disponível em **http://localhost:5000**

## Funcionalidades por Sprint

### Sprint 1 — Frontend Registo de Plano
- Formulários para planos Regular, Emergência e Pontual
- Interface responsiva com sidebar de navegação

### Sprint 2 — Backend API + MongoDB
- Modelos Mongoose: User, PlanoCultivo, Planta, Lote
- CRUD completo de Planos via API REST
- Conexão MongoDB Atlas

### Sprint 3 — Importação CSV + Autenticação
- Importação de plantas via ficheiro CSV
- Registo e login com JWT
- Gestão de utilizadores com roles (Técnico / Responsável / Administrador)

### Sprint 4 — Funcionalidades Restantes
- Dashboard com estatísticas em tempo real (nº plantas, planos, alertas)
- Listagem de plantas com pesquisa/filtro
- CRUD completo de planos no frontend (criar, editar, apagar, autorizar)
- Filtro de planos por tipo
- Página de alertas com planos pontuais pendentes
- Gestão de utilizadores protegida por autenticação
- Página de registo público (register.html)
- Service Worker para suporte offline (cache de assets)
- CORS configurado corretamente
- Backend serve o frontend diretamente

## Perfis de Utilizador

| Perfil | Criar Plano | Editar/Autorizar | Apagar | Gerir Utilizadores | Importar CSV |
|--------|:-----------:|:----------------:|:------:|:------------------:|:------------:|
| Técnico | ✅ (regular/emergência) | ❌ | ❌ | ❌ | ❌ |
| Responsável | ✅ (todos) | ✅ | ❌ | ❌ | ❌ |
| Administrador | ✅ (todos) | ✅ | ✅ | ✅ | ✅ |

## Estrutura do Projeto

```
GreenHerb/
├── index.html          # App principal (SPA)
├── login.html          # Página de login
├── sw.js               # Service Worker (offline)
├── utilizadores.js     # Lógica de utilizadores (legado)
├── css/
│   ├── style.css
│   └── styles.css
├── frontend/js/
│   ├── api.js
│   ├── main.js
│   └── storage.js
├── backend/
│   ├── server.js
│   ├── .env
│   ├── config/db.js
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   └── middleware/
├── .env.example
└── package.json
```
## Exemplo de .env

```.env
MONGO_URI=mongodb://127.0.0.1:27017/greenherb
PORT=5000
JWT_SECRET=greenherb123
```

## Formato CSV para Importação

```csv
lote,erva,temperatura,humidade
L-001,Manjericão,22,65
L-002,Hortelã,20,70
```


