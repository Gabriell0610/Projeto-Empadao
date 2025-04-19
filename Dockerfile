# Usa a versão do Node.js com suporte a LTS
FROM node:18

# Define o diretório de trabalho dentro do container
WORKDIR /usr/app

# Copia os arquivos necessários para instalar as dependências
COPY package.json package-lock.json ./
COPY prisma ./prisma

# Instala as dependências (somente produção para imagens menores)
RUN npm install

# Gera o Prisma Client antes da compilação
RUN npx prisma generate

# Copia o restante do código
COPY . .

# Compila os arquivos TypeScript para JavaScript
RUN npm run build

# Expõe a porta do backend
EXPOSE 1338

# Comando final para rodar a API
CMD ["npm", "run", "start"]
