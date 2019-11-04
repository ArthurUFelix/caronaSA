# caronaSA

### Passos para instalação

- Na pasta do projeto, executar um `yarn` pelo terminal, para baixar todas as dependencias
- Criar um arquivo na pasta raiz chamado `.env` preenchendo-o com o conteúdo do `.env.example`
- Executar o comando `yarn dev`, no terminal, para inicializar o servidor

  #### Caso for usar outro banco de dados

- Executar a instalação do PostGis via Query no seu banco: `create extension postgis`
- Comando para executar as migrations: `yarn sequelize db:migrate`

**Utilize o arquivo `Workspace-CaronaSA.json` para realizar a importação do Workspace para o [Insomnia](https://insomnia.rest/). Siga os passos abaixo para a importação**
![](insomnia.gif)

### Tarefas

- [x] Criar migrations
- [x] Criar models
- [x] Criar crud básico para todas as models
- [ ] Verificar e criar funções extras para as models
- [ ] Configurar Multer para o armazenamento de imagens
- [ ] Configurar mecanismo de envio de emails
