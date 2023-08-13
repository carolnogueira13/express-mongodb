import { Schema, model } from 'mongoose';
import validator from "validator";

const ContatoSchema = new Schema({
    nome: { type: String, required: false },
    sobrenome: { type: String, required: false, default: '' },
    email: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now }
});

const ContatoModel = model('Contato', ContatoSchema);

class Contato {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.contato = null;
    }

    async register(){
        this.valida();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.create(this.body);
    }

    valida(){
        // Validação dos campos
        this.cleanUp();

        // O e-mail precisa ser valido
        if(this.body.email && !validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');
        if (!this.body.nome) this.errors.push('Nome é um campo obrigatório');
        if (!this.body.email && !this.body.telefone) this.errors.push('Pelo menos um contato precisa ser enviado: e-mail ou telefone');
    }

    cleanUp(){
        // Garantir que todos os campos do formulario sejam strings
        // E garantir que o objeto tenha apenas os campos nome, sobrenome, email e telefone
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
              this.body[key] = '';
            }
          }
      
        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone
        };
    }

    async edit(id){
        if (typeof id !== 'string') return;
        this.valida();
        if (this.errors.length > 0) return;
        this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });  
    }

    static async buscaPorId(id){
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findById(id);
        return contato;
    }

    static buscaContatos = async function () {
        const contatos = await ContatoModel.find()
            .sort({criadoEm: -1});
        return contatos;
    } 

    static async deletes(id){
        if (typeof id !== 'string') return;
        const contato = await ContatoModel.findOneAndDelete({ _id : id});
        return contato;
    }
};

export default Contato;

