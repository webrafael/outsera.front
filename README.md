# Outsera Frontend

Projeto Angular para o frontend da aplicação Outsera.

## Pré-requisitos

- Docker
- Docker Compose

## Arquitetura

Escolhi esta arquitetura simulando como se fosse desenvolver um projeto real pronto para ser escalado pensando não só no tamanho do projeto como pensando também em escala de equipes separadas trabalhando por squads. Deixei uma breve explicação do que se trata cada camada para deixar um entendimento melhor.

Este projeto segue a arquitetura **Vertical Slice**, uma abordagem que organiza o código por funcionalidades de negócio em vez de por camadas técnicas. Esta arquitetura promove melhor coesão, reduz acoplamento e facilita a manutenção do código.

### Estrutura da Arquitetura

```
src/app/
├── core/           # Regras de negócio e lógica central
├── features/       # Design e componentes (dumb/smart)
└── shared/         # Serviços e recursos compartilhados
```

### Camadas e Responsabilidades

#### **Core** - Regras de Negócio
- **Propósito**: Contém toda a lógica de negócio da aplicação
- **Responsabilidades**:
  - Implementação das regras de negócio
  - Validações de dados
  - Lógica de processamento
  - Entidades e modelos de domínio
  - Casos de uso da aplicação
  - Interceptors, Pipes, Directives (Separados por grupos de regras de negócio)

#### **Features** - Design e Componentes
- **Propósito**: Interface do usuário e componentes visuais
- **Responsabilidades**:
  - **Smart Components**: Componentes que contêm lógica de estado e comunicação com serviços
  - **Dumb Components**: Componentes puramente apresentacionais, sem lógica de negócio
  - Templates e estilos específicos de cada funcionalidade
  - Componentes reutilizáveis dentro de uma feature

#### **Shared** - Recursos Compartilhados
- **Propósito**: Serviços e recursos utilizados por múltiplas features
- **Responsabilidades**:
  - **Serviços Compartilhados**: APIs, autenticação, logging, etc.
  - **Modelos Compartilhados**: Interfaces e tipos utilizados globalmente
  - **Utilitários**: Funções helper e constantes
  - **Recursos Globais**: Interceptors, Pipes, Directives (Genéricos que podem ser compartilhados pela aplicação inteira)

### Benefícios da Arquitetura Vertical Slice

- **Coesão**: Código relacionado fica junto
- **Manutenibilidade**: Mudanças em uma funcionalidade ficam isoladas
- **Escalabilidade**: Fácil adição de novas features
- **Testabilidade**: Testes mais focados e organizados
- **Clareza**: Estrutura mais intuitiva para novos desenvolvedores

## Como executar o projeto

### 1. Usando Docker Compose (Recomendado)

```bash
# Construir e iniciar o container
docker-compose up --build

# Para rodar em background
docker-compose up -d --build
```

O projeto estará disponível em: http://localhost:4200

### 2. Usando Docker diretamente

```bash
# Construir a imagem
docker build -t outsera-front .

# Executar o container
docker run -p 4200:4200 -v $(pwd):/app -v /app/node_modules outsera-front
```

## Como executar os testes unitários

### Opção 1: Usando o script automatizado

```bash
# Dar permissão de execução (apenas na primeira vez)
chmod +x docker-test.sh

# Executar os testes
./docker-test.sh
```

### Opção 2: Comandos manuais

```bash
# Se o container já estiver rodando
docker exec outsera-front npm test

# Se o container não estiver rodando
docker-compose up -d
docker exec outsera-front npm test
```

### Opção 3: Executar testes em modo watch

```bash
# Executar testes em modo watch (para desenvolvimento)
docker exec -it outsera-front npm test -- --watch
```

## Comandos úteis

```bash
# Parar o container
docker-compose down

# Ver logs do container
docker-compose logs -f

# Acessar o terminal do container
docker exec -it outsera-front sh

# Reconstruir a imagem (após mudanças no Dockerfile)
docker-compose up --build

# Limpar containers e imagens não utilizadas
docker system prune -a
```

## Estrutura do projeto

```
src/
├── app/
│   ├── core/
│   │   └── layout/
│   ├── features/
│   │   ├── dashboard/
│   │   └── movies/
│   └── shared/
│       ├── models/
│       └── services/
├── assets/
└── environments/
```

## Tecnologias utilizadas

- Angular 20
- Node.js 22.16.0
- Bootstrap 5
- Jasmine/Karma para testes
- Docker

## Desenvolvimento

O projeto está configurado com hot-reload, então as mudanças no código serão refletidas automaticamente no navegador.

Para desenvolvimento local sem Docker, você pode:

```bash
# Instalar dependências
npm install

# Executar o projeto
npm start

# Executar testes
npm test
```

## Notas importantes

- O projeto usa Node.js 22.16.0
- A porta padrão é 4200
- Os testes unitários usam Jasmine/Karma
- O Cypress foi removido conforme solicitado
