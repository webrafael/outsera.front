# Usar a imagem oficial do Node.js 22.16.0
FROM node:22.16.0-alpine

# Definir o diretório de trabalho
WORKDIR /app

# Copiar os arquivos de configuração do projeto
COPY package*.json ./
COPY angular.json ./
COPY tsconfig*.json ./

# Desabilitar o analytics do Angular CLI
RUN export NG_CLI_ANALYTICS=off off

# Instalar as dependências
RUN npm install

# Copiar o código fonte
COPY . .

# Expor a porta 4200 (padrão do Angular)
EXPOSE 4200

# Comando padrão para iniciar o servidor de desenvolvimento
CMD ["sh", "-c", "npm start -- --host 0.0.0.0 --port 4200"]
