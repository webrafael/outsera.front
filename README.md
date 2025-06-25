# Outsera Frontend

Projeto Angular para o frontend da aplicação Outsera.

## Pré-requisitos

- Docker
- Docker Compose

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
