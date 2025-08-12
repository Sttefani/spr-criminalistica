# ---- Estágio de Build ----
# Usamos uma imagem oficial do Node.js como base
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de manifesto de dependências
COPY package*.json ./

# Instala as dependências de produção
RUN npm install 
# Copia o resto do código da aplicação
COPY . .

# Compila o código TypeScript para JavaScript
RUN npm run build

# ---- Estágio de Produção ----
# Começamos de novo com uma imagem limpa para manter a imagem final pequena
FROM node:18-alpine

WORKDIR /app

# Copia os arquivos de manifesto novamente
COPY package*.json ./

# Instala APENAS as dependências de produção
RUN npm install --only=production

# Copia o código já compilado do estágio de 'builder'
COPY --from=builder /app/dist ./dist

# Expõe a porta que a aplicação NestJS usa
EXPOSE 3000

# Comando para iniciar a aplicação quando o container rodar
CMD ["node", "dist/main"]
