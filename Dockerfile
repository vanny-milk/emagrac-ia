# 1. Baixa uma imagem do Linux com Node.js versão 20 já instalado
FROM node:20-alpine

# 2. Cria uma pasta chamada 'app' dentro desse computador virtual
WORKDIR /app

# 3. Copia os arquivos que dizem quais bibliotecas o Vue precisa
COPY package*.json ./

# 4. Instala as bibliotecas dentro do computador virtual
RUN npm install

# 5. Copia todo o resto do seu código para dentro do container
COPY . .

# 6. Abre uma "janela" (porta) para o navegador conseguir ver o app
EXPOSE 5173

# 7. Liga o servidor do Vue com o parâmetro --host (necessário para Docker)
CMD ["npm", "run", "dev", "--", "--host"]