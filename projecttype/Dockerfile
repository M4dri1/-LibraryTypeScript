# Usar imagem base node
FROM node:18-alpine

# Diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copiar package.json e package-lock.json (se existir)
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar todo o projeto (src, public, tsconfig.json, etc)
COPY . .

# Build do TypeScript
RUN npm run build

# Porta que a aplicação vai usar
EXPOSE 3000

# Comando para rodar a aplicação
CMD ["node", "dist/index.js"]
