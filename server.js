import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();

import { connect } from 'mongoose';
connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto')})
    .catch(e => console.log(e));

// Sessões para identificar o navegador de um cliente    
import session from 'express-session';

// MongoStore para salvar as sessões na base de dados
import pkg from 'connect-mongo';
const { create } = pkg;
import flash from 'connect-flash';

import routes from './routes.js';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import helmet from 'helmet';

// CSRF Tokens - Para que nenhum site externo consiga postar coisas para dentro na nossa aplicação
import csrf from 'csurf';
import { middlewareGlobal, checkCsrfError, csrfMiddleware } from './src/middlewares/middleware.js';

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(resolve(__dirname, 'public')));


// Configurações de sessão
const sessionOptions = session({
    secret: 'abhghghgd hsjddjsjd kshdkshdkshdk kdhsdkhskd shdskdhsk',
    store: create({ mongoUrl: process.env.CONNECTIONSTRING }),
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true
    }
});

app.use(sessionOptions);
app.use(flash());

// Arquivos que reenderiza na tela (view)
app.set('views', resolve(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

app.use(csrf());

// Nossos próprios middlewares (que interceptam as rotas)
app.use(csrfMiddleware);
app.use(middlewareGlobal);
app.use(checkCsrfError);
app.use(routes);

// Liberar a porta para o express acessar, nesse caso a porta 3000
app.on('pronto', () => app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');
    console.log('Servidor executando na porta 3000');
}));




