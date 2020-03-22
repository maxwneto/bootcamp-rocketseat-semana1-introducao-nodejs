//importar express.
const express = require('express');

//instanciar aplicação
const server = express();

// configurar xpress para ler json do escopo da requisição http
server.use(express.json());

const users = ["Max", "Sara", "Heitor"];

//middleware global para que seja sempre chamado indepentente da rota
server.use((req, res, next) => {
  console.time('Request');
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd('Request');
})

/*
middleware para verificar se existe dados do usuario no body para assim
executar determinada rota/requisição
*/
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: 'User name is required.' });
  }
  return next();
}

/*
middleware para verificar se indice informado retorna algum usuário existente
no array
*/
function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: 'User do not exists!' });
  }

  req.user = user;
  return next();
}

//rota que retorna todos os usuários
server.get('/users', (req, res) => {
  return res.json(users);
})

//rota que retorna usuário pelo indice
server.get('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params
  return res.json(req.user);
})

// rota para criação de um novo usuário
server.post('/users', checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
})

// rota para edição do usuário
server.put('/users/:index', checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
})

//rota para deleção do usuário
server.delete('/users/:index', checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);
  return res.send();
})

//configurar porta que o servidor irá ouvir para chamada
server.listen(3000);