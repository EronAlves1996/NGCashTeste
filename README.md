# NG Cash Teste

Applicação feita para fins de teste para a NG Cash

## Stack Utilizada

### Front End

- React
- React Router
- Vite

### Back End

- Express
- js-sha256
- jsonwebtoken
- Prima

### Observações

Nos dois lados foi utilizado código em conjunto com typescript para garantir type safety (e também o atingimento dos requisitos)

## Estrutura

```
.
├── back
│   ├── prisma
│   └── src
│       ├── routes
│       ├── services
│       └── utils
└── front
    └── src
        ├── GuardedComps
        ├── styles
        └── utils
```

Por se tratar de uma aplicação fullstack, foi preferida uma organização dos arquivos através de um monorepo.

### Back

Repositório onde se localizam os arquivos relativos ao Back End da Aplicação

- Prisma: Contém o arquivo para modelagem das tabelas no banco de dados;
- Routes: Contém arquivos onde são configuradas as rotas e ações de manipulação de metadados de request/responses (cookies, headers, status code, etc.);
- Services: Contém arquivos que correspondem as ações tomadas com as informações recebidas em cada endpoint, inclui verificações e acesso ao banco de dados;
- Utils: Possui apenas o arquivo relativo ao middleware que protege as rotas que ncessitam de autenticação.

### Front

Repositório onde se localizam os arquivos relativos ao Front End

- Guarded Comps: Componentes que são acessíveis através de autenticação;
- Styles: Contém folhas de estilo css utilizadas na aplicação;
- Utils: Contém apenas a função que realiza comunicação com o back-end por padrão.

## Flow de deploy

Esta não é uma descrição de como rodar a aplicação, apenas é uma explicação sucinta de como o deploy ocorre no docker. Consiste nos seguintes passos:

1. Roda-se o script de build na parte de front-end da aplicação que irá gerar arquivos estáticos dentro da pasta public no Diretório 'Back';
2. É realizada a migração do modelo de dados para criação das tabelas no banco de dados postgresql;
3. O server então é iniciado e passa a servir, tanto a api quanto os arquivos gerados no build da parte front-end.

## Rodando a aplicação

A aplicação já possui um script de deploy configurado. É necessário que o banco de dados esteja já funcionando. Como a aplicação é dockerizada, a mesma já está pré-configurada para tal. Nesse caso, é recomendável modificar o arquivo .env que contém o endereço de acesso ao banco de dados para cada caso em específico. Após isso, basta rodar os seguintes comandos:

```bash
$ npm install
$ npm run deploy
```

Espere executar. Ao final do deploy você verá a seguinte mensagem:

```bash
Listening on port 3000
```

Basta acessar o aplicativo em localhost:3000.

### Decoupled Mode

Além do modo normal, em que o server, além de disponibilizar a API, disponibiliza também os arquivos relativos ao front-end, o server possui o Decoupled Mode. Nesse modo, o server não serve arquivos de front-end e passa a servir apenas a api. Para rodar este modo, será necessária tambéma a migração. Execute os seguintes comandos:

```bash
$ npm run migrate --workspace back
$ npm run server --workspace back -- --decoupled
```

Basta realizar as chamadas à api em localhost:3000

## Deploy no docker

Uma opção mais simples, em que o aplicativo já está pronto para a produção é rodando-o direto no docker. Para isso, não é necessário instalar nada, nem mesmo o banco de dados, pois tudo estará rodando no docker.
É necessário apenas que tenha o Docker e o Docker-Compose (preferencialmente as últimas versões) instaladas na sua máquina.
Apenas rode o comando abaixo:

```bash
$ docker-compose up
```

Espere executar. Ao final do deploy você verá a seguinte mensagem:

```bash
Listening on port 3000
```

Basta acessar o aplicativo em localhost:3000.
