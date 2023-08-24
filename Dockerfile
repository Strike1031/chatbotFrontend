# Use a base Node.js image
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner
WORKDIR /app

# Copia o package.json e o package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instala as dependências
RUN npm install --production

# Copia o restante do código-fonte
COPY . .

# Constrói o aplicativo
RUN npm run build

# Define o comando para executar o aplicativo
CMD ["npm", "start"]
