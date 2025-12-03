# 🏨 Sistema de Gerenciamento de Hotel

### 🏷️ Badges

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow)
![React](https://img.shields.io/badge/React-Frontend-blue)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green)
![Express](https://img.shields.io/badge/Express-Framework-lightgrey)
![Sequelize](https://img.shields.io/badge/Sequelize-ORM-blue)
![CSS3](https://img.shields.io/badge/CSS3-Style-blue)

<br>

## 📑 Índice

- [Descrição do Projeto](#descrição-do-projeto)
- [Status do Projeto](#status-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Desenvolvedoras](#desenvolvedoras)

<br>

## 📖 Descrição do Projeto

O **Sistema de Gerenciamento de Hotel** é uma aplicação web completa (Full Stack) desenvolvida para auxiliar na administração de rotinas hoteleiras. O sistema permite o controle de hóspedes (clientes), gerenciamento de quartos e organização de reservas. Além de fornecer diferenciação de acesso para clientes e administradores, dando autonomia ao cliente para que faça suas próprias reservas ou praticidade ao sistema hoteleiro para que possam também fazer a ação por meio de adms. 

Este sistema adota uma arquitetura desacoplada, onde o **Backend (API)** fornece os dados e regras de negócio, e o **Frontend (React)** consome esses dados para apresentar a interface ao usuário.

<br>

## 🚧 Status do Projeto

> **Versão em Desenvolvimento:** > O sistema possui as operações fundamentais (CRUD) implementadas para as principais entidades, mas ainda pode ser adaptado em questão de acessibilidade e validações específicas.
> Projeto desenvolvido como forma parcial de avaliação da disciplina de Programação Web Back-end (Projeto 2).

<br>

## ⚙️ Funcionalidades

O sistema conta com controle de acesso e gerenciamento das seguintes entidades:

- **Autenticação e Segurança:**
  - Login de usuários (Administradores e Clientes);
  - Middleware de verificação de token para rotas protegidas;
  - Validação de permissões de administrador.

- **Gerenciamento de Clientes:**
  - Cadastro, listagem, visualização e edição de clientes.

- **Gerenciamento de Quartos:**
  - Cadastro, listagem, visualização e edição de clientes.

- **Controle de Reservas:**
  - Criação de novas reservas vinculando clientes a quartos;
  - Visualização e gerenciamento de reservas existentes.

<br>

## Como Rodar o Projeto

Este projeto é dividido em duas partes: **API (Backend)** e **Frontend**. É necessário rodar ambos simultaneamente.

### 🧩 Pré-requisitos
- Node.js instalado
- Banco de Dados SQL configurado (conforme `config/db_sequelize.js`)

### ▶️ Passos para execução

#### 1. Clonar o repositório
```bash
git clone [https://github.com/josibatista/gerenciamento-de-hotel.git](https://github.com/josibatista/gerenciamento-de-hotel.git)
cd gerenciamento-de-hotel
```

#### 2\. Configurando e Rodando a API (Backend)

```bash
# Entre na pasta da API
cd api

# Instale as dependências
npm install

# (Opcional) Crie o primeiro administrador se necessário
node criarAdmin.js

# Inicie o servidor
node app.js
# O servidor rodará em http://localhost:8080
```

#### 3\. Configurando e Rodando o Frontend

Abra um novo terminal na raiz do projeto:

```bash
# Entre na pasta do frontend
cd frontend

# Instale as dependências
npm install

# Rode o projeto React
npm run dev
# Acesse o link fornecido pelo Vite (ex: http://localhost:5173)
```

<br>

## Estrutura de Pastas

A estrutura foi organizada separando a lógica de servidor da interface de usuário.

### 📂 api (Backend)

Responsável pelas regras de negócio e conexão com banco de dados.

  - **config/**: Configuração do Sequelize (`db_sequelize.js`).
  - **controllers/**: Lógica das rotas (`authController`, `clienteController`, `quartoController`, `reservaController`).
  - **middleware/**: Interceptadores de requisição (`autenticarToken.js`, `checkAdmin.js`).
  - **models/**: Modelos do banco de dados (`administrador`, `cliente`, `quarto`, `reserva`).
  - **routers/**: Definição das rotas da API.
  - **app.js**: Ponto de entrada do servidor.

### 📂 frontend (Interface)

Responsável pela interação com o usuário, desenvolvida em React.

  - **src/Components/**: Componentes reutilizáveis.
      - **Layout/**: Estrutura base (`Menu`, `Rodape`).
  - **src/Pages/**: Telas da aplicação.
      - **Clientes**: `ClienteForm`, `ClienteList`, `ClienteView`.
      - **Quartos**: `QuartoForm`, `QuartoList`, `QuartoView`.
      - **Reservas**: `ReservaForm`, `ReservaList`, `ReservaView`.
      - **Geral**: `Home`, `LoginForm`.
  - **src/App.jsx**: Componente principal e configuração de rotas do React.

<br>

## 💻 Tecnologias Utilizadas

  - **Back-end:** Node.js, Express, Sequelize (ORM).
  - **Front-end:** React.js, CSS Modules.
  - **Banco de Dados:** Relacional (SQL), com PostgreSQL.
  - **Autenticação:** JWT (JSON Web Tokens).

<br>

## 👩‍💻 Desenvolvedoras

[Josiane Mariane Batista](https://josibatista.github.io/web-front-end/)

[Pamela Berti Braz](https://pamms2.github.io)