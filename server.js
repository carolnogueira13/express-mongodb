require('dotenv').config();

const express = require('express');
const app = express();

const mongoose = require('mongoose');
mongoose.connect(process.env.CONNECTIONSTRING)
    .then(() => {
        app.emit('pronto')})
    .catch(e => console.log(e));

// Sessões para identificar o navegador de um cliente    
const session = require('express-session');

// MongoStore para salvar as sessões na base de dados
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const routes = require('./routes');
const path = require('path');
const helmet = require('helmet');

// CSRF Tokens - Para que nenhum site externo consiga postar coisas para dentro na nossa aplicação
const csrf = require('csurf');
const { middlewareGlobal, checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');

app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.resolve(__dirname, 'public')));


// Configurações de sessão
const sessionOptions = session({
    secret: 'abhghghgd hsjddjsjd kshdkshdkshdk kdhsdkhskd shdskdhsk',
    store: MongoStore.create({ mongoUrl: process.env.CONNECTIONSTRING }),
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
app.set('views', path.resolve(__dirname, 'src', 'views'));
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




