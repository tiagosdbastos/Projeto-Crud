const form = {
  email: () => document.getElementById("email"),
  password: () => document.getElementById("senha"),
  recoverPassword: () => document.getElementById("recuperarSenha"),
  loginBtn: () => document.getElementById("logar"),
};

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    window.location.href = "home/home.html";
  }
});

function validacaoCampos() {
  /* funcao para validacao de campos*/
  alterarBotoes();
}

function _emailValido() {
  /* se o valor de email for vazio retorne falso, o caso botao desativado */
  const email = form.email().value;
  if (!email) {
    return false;
  }
  return validarEmail(
    email
  ); /* se o valor de email existir e estiver true no na funcao de validarEmail retorne */
}

function _senhaValida() {
  const password = form.password().value;
  if (!password) {
    return false;
  }
  return true;
}

function login() {
  showLoading();
  firebase
    .auth()
    .signInWithEmailAndPassword(form.email().value, form.password().value)
    .then((response) => {
      hideLoading();
      window.location.href = "home/home.html";
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
    });
}

function getErrorMessage(error) {
  if (error.code == "auth/invalid-credential") {
    return "Usuário não encontrado ou credenciais invalidas";
  }
  return error.message;
}

function register() {
  showLoading();
  window.location.href = "register/register.html";
}

function recoverPass() {
  showLoading();
  firebase
    .auth()
    .sendPasswordResetEmail(form.email().value)
    .then(() => {
      hideLoading();
      alert("Email de recuperação enviado");
    })
    .catch((error) => {
      hideLoading();
      alert(getErrorMessage(error));
    });
}

function alterarBotoes() {
  const emailValido =
    _emailValido(); /* constante emialValido recebe o retorno da funcao de _emailvalido*/
  form.recoverPassword().disabled =
    !emailValido; /* pega o id do botao recuperar senha, para destivar ou ativar o botao*/
  if (!emailValido || form.email().value === "") {
    alert("Email inválido ou vazio");
  }

  const senhaValida =
    _senhaValida(); /* recebe o retorno da funcao de verificacao true or false */
  form.loginBtn().disabled = !emailValido || !senhaValida;

  /**
     passa a passo apra entender
     a varivel const recebe o valor true or false
     ai na linha de baixo o document(no caso o elemento html) destivo recebe o valor da varivel entao se a validacao for false ele vai colocar no document !false no caso deixando true o botao desativado e se for true ele vira false (!true) desativando o botao
     */
}
