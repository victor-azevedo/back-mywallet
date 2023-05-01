# My Wallet App Back-end

Back-end for My Wallet, a finance manager. :moneybag:

## About

My Wallet is a web browser application with which you can manage your personal expenses and income.

[Front-End APP](https://github.com/victor-azevedo/front-mywallet)

## How to run

### Locally Option:

#### Requirements

Have Node.js (recommended version: 16.20.0) and MongoDB (recommended version: 6.0.5) installed in your machine.

1. Clone this repository;
2. Install all dependencies:

```bash
npm i
```

3. Create `.env` file based in and `.env.example`;
4. Run the back-end as development:

```bash
npm run dev
```

Application will run in default PORT 4000.

### Docker Option:

#### Requirements

Have Docker and Docker Compose installed.

1. Run Docker Compose file:

```bash
sudo docker compose up
```

Application will run in default PORT 4000 and a folder data/ will be created as mongo container volume.

## Building and starting for production

```bash
npm start
```
