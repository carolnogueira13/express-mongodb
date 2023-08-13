import Contato from '../models/ContatoModel.js';

export async function index(req, res) {
    const contatos = await Contato.buscaContatos();
    res.render('index', { contatos });
} 



