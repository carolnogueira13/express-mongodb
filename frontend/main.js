// import 'core-js/stable';
// import 'regenerator-runtime/runtime.js';

// import './assets/css/style.css';

import Login from './modules/Login.js';
import Contato from './modules/Contato.js';

const login = new Login('.form-login');
const cadastro = new Login('.form-cadastro');

const novoContato = new Contato('.form-registro')
const editContato = new Contato('.form-edit')

login.init();
cadastro.init();

novoContato.init();
editContato.init();


