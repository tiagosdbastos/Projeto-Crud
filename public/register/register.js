const formElements = {
    confirmPassword: () => document.getElementById('Csenha'),
    email: () => document.getElementById('email'),
    password: () => document.getElementById('senha')
};

firebase.auth().onAuthStateChanged(user =>{
    if (user){
        window.location.href = "../home/home.html"
    }
})

function validacaoCampos() {
    /* funcao para validacao de campos*/
    alterarBotoes();
}
function onChangePassword() {
    const password = formElements.password().value;
    validatePasswordMatch();
    
    if (!password || password.length < 6) {
        alert('A senha deve conter mais que 6 caracteres');
    }

    allowButton() // Chama para verificar o estado do botão após a validação
}

function onChangeCPassword() {
    validatePasswordMatch();
    allowButton() // Chama para verificar o estado do botão após a validação
}

function validatePasswordMatch() {
    const Cpassword = formElements.confirmPassword().value;
    const password = formElements.password().value; 
    
    // Corrigido: Retirado o alert se a senha não for igual e usei a lógica de permitir o botão aqui mesmo
    if (!Cpassword || Cpassword !== password) { 
        alert('As senhas devem ser iguais');
    }
}

function onChangeEmail() {
    const emailValido = _emailValido(); /* constante emailValido recebe o retorno da funcao de _emailvalido */
   
    if (!emailValido || formElements.email().value === "") {
        alert("Email inválido ou vazio");
    }
    allowButton() // Chama para verificar o estado do botão após a validação
}

function _emailValido() {
    /* se o valor de email for vazio retorne falso, no caso botão desativado */
    const email = formElements.email().value;
    
    if (!email) {
        return false;
    }
    return validarEmail(email); /* se o valor de email existir e estiver true no na função de validarEmail retorne */
}

function isFormValid() {
    const email = formElements.email().value;
    if (!email || !validarEmail(email)) {
        return false;
    }
    const password = formElements.password().value;
    if (!password || password.length < 6) {
        return false;
    }
    const Cpassword = formElements.confirmPassword().value;
    if (!Cpassword || Cpassword !== password) { 
        return false;
    } 
    return true; // Se todos os campos forem válidos, retorna true
}

function allowButton() {
    const btn = document.getElementById('regB');
    
    // Corrigido: Habilita o botão somente se o formulário for válido
    btn.disabled = !isFormValid() 
}

function register(){
    showLoading();
    const email = formElements.email().value;
    const password = formElements.password().value;

    firebase.auth().createUserWithEmailAndPassword(email, password
    ).then(() => { 
        hideLoading();
        allow();
    }).catch(error =>{
        hideLoading();
        alert(getErrorMessage(error));
    })
}

function getErrorMessage(error){
    if(error.code == "auth/email-already-in-use"){
        return "Este email ja está em uso"
    }
    return error.message;

}

function allow() {
    const btn2 = document.getElementById('logar');
    
    // Corrigido: Criação do parágrafo de sucesso
    const novoParagrafo = document.createElement("p");
    novoParagrafo.innerHTML = 'Conta criada com sucesso! Clique no botão <strong>Entrar</strong>'; // Usa innerHTML para interpretar a tag <strong>

    // Corrigido: Seleção correta do formulário e adição do parágrafo
    const form = document.querySelector(".form");
    form.appendChild(novoParagrafo);

    // Habilita o botão "Entrar"
    btn2.disabled = false;
}
function login(){
    window.location.href = "../index.html";
}