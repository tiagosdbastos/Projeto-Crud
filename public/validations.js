function validarEmail(email) {
    return /\S+@\S+\.\S+/.test(email); /*igual no mysql quando queremos filtrar com algo antes e depois, retorna true or false*/
  }