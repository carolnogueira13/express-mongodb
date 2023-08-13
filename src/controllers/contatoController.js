import Contato from '../models/ContatoModel.js';


export function index(req, res){
    res.render('contato', { contato: {} });
}

export async function register(req, res){
    try {
        const contato = new Contato(req.body);
        await contato.register();

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(()=> res.redirect('/contato'));
            return;
        }
    
        req.flash('success', 'Contato registrado com sucesso');
        req.session.save(()=> res.redirect(`/contato/${contato.contato._id}`));
        return;
        
    } catch (e) {
        console.log(e);
        res.render('404');
    }
}

export async function editIndex(req,res) {
    if (!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('404');

    res.render('contato', { contato });
}

export async function edit(req,res) {
    try {
        if (!req.params.id) return res.render('404');
        const contato = new Contato(req.body);
        let id = req.params.id;
        await contato.edit(req.params.id);

        if (contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(()=> res.redirect(`/contato/${id}`));
            return;
        }

        req.flash('success', 'Contato editado com sucesso');
        req.session.save(()=> res.redirect(`/contato/${id}`));
        return;

    } catch(e) {
        console.log(e);
        res.render('404');
    }
    
}

export async function deletes(req, res){
    if (!req.params.id) return res.render('404');

    const contato = await Contato.deletes(req.params.id);
    if (!contato) return res.render('404');

    req.flash('success', 'Contato apagado com sucesso');
    req.session.save(()=> res.redirect('back'));
};




