import { Schema, model } from 'mongoose';
import validator from "validator";
import pkg from 'bcryptjs';
const { compareSync, genSaltSync, hashSync } = pkg;

const LoginSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true }
    
});

const LoginModel = model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

    async login(){
        this.valida();
        if (this.errors.length > 0) return;
        this.user = await LoginModel.findOne({email: this.body.email});

        if (!this.user){
            this.errors.push('Usuário não existe!');
            return;
        }

        if (!compareSync(this.body.password, this.user.password)) {
            this.errors.push('Senha inválida');
            this.user = null;
        }
    }

    async register(){
        // Registrar o usuario
        this.valida();
        if (this.errors.length > 0) return;

        await this.userExists();

        if (this.errors.length > 0) return;

        const salt = genSaltSync();
        this.body.password = hashSync(this.body.password, salt);

        this.user = await LoginModel.create(this.body);
        
    }

    async userExists(){
        // Método para checar se o usuário já está cadastradp na base de dados
        this.user = await LoginModel.findOne({email: this.body.email});
        if (this.user) this.errors.push('Usuário já cadastrado');
    }

    valida(){
        // Validação dos campos
        
        this.cleanUp();

        // O e-mail precisa ser valido
        if(!validator.isEmail(this.body.email)) this.errors.push('E-mail inválido');

        // A senha precisa ter entre 3 e 50
        if(this.body.password.length < 3 || this.body.password.length > 50) {
        this.errors.push('A senha precisa ter entre 3 e 50 caracteres.');
        }
    }

    cleanUp(){
        // Garantir que todos os campos do formulario sejam strings
        // E garantir que o objeto tenha apenas os campos email e password
        for(const key in this.body) {
            if(typeof this.body[key] !== 'string') {
              this.body[key] = '';
            }
          }
      
        this.body = {
        email: this.body.email,
        password: this.body.password};
    }
};

export default Login;

