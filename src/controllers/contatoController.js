const Contato = require('../models/ContatoModel');

exports.index = function(req, res){
    res.render('contato', { contato: {} });
}

exports.register = async function(req, res){
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

exports.editIndex = async function(req,res) {
    if (!req.params.id) return res.render('404');

    const contato = await Contato.buscaPorId(req.params.id);
    if (!contato) return res.render('404');

    res.render('contato', { contato });
}

exports.edit = async function(req,res) {
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
