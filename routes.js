import { Router } from 'express';
const route = Router();
import { index } from './src/controllers/homeController.js';
import { index as _index, register, login, logout } from './src/controllers/loginController.js';
import { index as __index, register as _register, editIndex, edit, deletes as _delete } from './src/controllers/contatoController.js';
import { loginRequired } from './src/middlewares/middleware.js';

// Rotas da home
route.get('/', index);

// Rotas de login
route.get('/login/', _index);
route.post('/login/register', register);
route.post('/login/login', login);
route.get('/login/logout', logout);

// Rotas de contato
route.get('/contato', loginRequired, __index);
route.post('/contato/register', loginRequired, _register);
route.get('/contato/:id', loginRequired, editIndex);
route.post('/contato/edit/:id', loginRequired, edit);
route.get('/contato/delete/:id', loginRequired, _delete);


export default route;