# caronaSA

### Passos para instalação

- Na pasta do projeto, executar um `yarn` pelo terminal, para baixar todas as dependencias
- Criar um arquivo na pasta raiz chamado `.env` preenchendo-o com o conteúdo do `.env.example`

  #### Caso for usar outro banco de dados

- Executar a instalação do PostGis via Query no seu banco: `create extension postgis`
- Comando para executar as migrations: `yarn sequelize db:migrate`

### Tarefas

- [x] Criar migrations
- [x] Criar models
- [] Criar crud básico para todas as models
- [] Verificar e criar funções extras para as models
- [] Configurar Multer para o armazenamento de imagens
- [] Configurar mecanismo de envio de emails
