import validator from "validator";

export default class Contato {
    constructor(formClass) {
        this.form = document.querySelector(formClass);
    }

    init(){
        this.events();
    }

    events(){
        if (!this.form) return;
        this.form.addEventListener('submit', e => {
            e.preventDefault();
            this.validate(e);
        })
    }

    validate(e){
        for (let errorText of this.form.querySelectorAll('.text-danger')){
            errorText.remove();
        }

        const el = e.target;

        const nomeInput = el.querySelector('input[name="nome"]');
        const emailInput = el.querySelector('input[name="email"]');
        const telefoneInput = el.querySelector('input[name="telefone"]');

        let error = false;

        if (!validator.isEmail(emailInput.value)) {
            this.createError(emailInput, "Email inválido!");
            error = true;
        }

        if (!nomeInput.value) {
            this.createError(nomeInput, "Precisa preencher o nome!");
            error = true; 
        }

        if (!emailInput.value && !telefoneInput.value) {
            this.createError(telefoneInput, "Pelo menos um contato precisa ser enviado: e-mail ou telefone!");
            error = true; 
        }

        if (!error) el.submit();

    }

    createError(campo, msg ){
        const div = document.createElement('div');
        div.innerHTML = msg;
        div.classList.add('text-danger');
        campo.insertAdjacentElement('afterend', div);
    }
}