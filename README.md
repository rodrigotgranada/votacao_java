# 🗳️ Sistema de Votação Cooperativa

Sistema completo para gerenciamento de pautas e sessões de votação em cooperativas, desenvolvido com Java (Spring Boot) e React.

## 🚀 Tecnologias Utilizadas

### Back-end
- **Java 21** & **Spring Boot 3**
- **Spring Data JPA** & **PostgreSQL**
- **Lombok** (Produtividade)
- **Maven** (Gerenciamento de dependências)
- **Docker** (Orquestração de ambiente)

### Front-end
- **React 18** + **Vite**
- **TypeScript**
- **Lucide React** (Ícones)
- **CSS Vanilla** (Design Moderno & Glassmorphism)

---

## 📡 Documentação da API (v1)

Base URL: `http://localhost:8080/api/v1`

### 📋 Pautas e Votação

#### 1. Cadastrar Pauta (Requisito)
Cria uma nova pauta para votação.
- **POST** `/pautas`
- **Body:** `{ "descricao": "Nome da Pauta" }`

#### 2. Abrir Sessão (Requisito)
Abre uma sessão de votação para uma pauta específica. Se a duração não for informada, o padrão é 1 minuto.
- **POST** `/pautas/{id}/abrir-sessao?duracao=5`
- **Params:** `duracao` (opcional, em minutos)

#### 3. Votar (Requisito)
Registra o voto de um associado. Valida CPF e duplicidade.
- **POST** `/pautas/{id}/votos`
- **Body:** `{ "associadoId": "12345678901", "escolha": "SIM" }` (escolhas: `SIM` ou `NAO`)

#### 4. Obter Resultado (Requisito)
Contabiliza e retorna o resultado da votação.
- **GET** `/pautas/{id}/resultado`

#### 5. Listar Pautas (Extra)
Retorna todas as pautas com seus respectivos status de sessão (Nova, Em Votação ou Encerrada).
- **GET** `/pautas`

#### 6. Excluir Pauta (Extra)
Remove uma pauta e todos os seus vínculos (sessão e votos).
- **DELETE** `/pautas/{id}`

#### 7. Prorrogar Votação (Extra)
Estende o tempo de uma sessão existente ou reabre uma sessão encerrada sem apagar os votos anteriores.
- **POST** `/pautas/{id}/reabrir-sessao?duracao=5`

---

## 📖 Documentação Automática (Swagger)

A API possui documentação interativa através do Swagger UI:
- **URL:** [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **OpenAPI Docs:** [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

---

## 🌟 Tarefas Bônus Implementadas

### 1. Integração com Sistemas Externos (CPF)
Implementado no `CpfValidatorService`. Simula a validação de CPF com aleatoriedade:
- **ABLE_TO_VOTE:** CPF válido e apto.
- **UNABLE_TO_VOTE:** CPF válido, mas não apto.
- **404 (Not Found):** Simula CPF inexistente.

### 2. Performance
- **Banco de Dados:** Uso de `UniqueConstraint` (índice composto) em `pauta_id` e `associado_id` para garantir unicidade e velocidade na busca.
- **Queries:** Uso de queries de agregação (`GROUP BY` e `COUNT`) no banco de dados para evitar carga desnecessária de objetos na memória da aplicação.

### 3. Versionamento
- API versionada via URI Path (`/api/v1/...`), permitindo evolução do sistema sem quebrar clientes antigos.

---

## 🛠️ Como Executar

O projeto está totalmente dockerizado. Para subir o ambiente completo (Banco + Back + Front):

```bash
# Sobe tudo (Banco, Backend, Frontend e Adminer)
docker-compose --profile fullstack up --build

# Sobe apenas o Backend (Banco, App e Adminer)
docker-compose --profile backend up --build
```

- **Front-end:** [http://localhost:5173](http://localhost:5173)
- **Back-end:** [http://localhost:8080](http://localhost:8080)
- **Adminer (Banco):** [http://localhost:8081](http://localhost:8081)
