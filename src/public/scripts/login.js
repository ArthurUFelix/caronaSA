// Se usuário estiver logado, redireciona ele para a pagina inicial
verificarLogado();

// Mostrar e ocultar senha
$("#btnMostrarSenha").click(function() {
  if ($(this).text() == "visibility") {
    $(this).text("visibility_off");
    $("#campoSenha").attr("type", "text");
  } else {
    $(this).text("visibility");
    $("#campoSenha").attr("type", "password");
  }
});

// Login
$("#login-form").submit(async function(e) {
  e.preventDefault();
  if ($(this).is(":valid")) {
    const dados = {
      email: $("#campoEmail").val(),
      senha: $("#campoSenha").val()
    };

    let respostaLogin = await realizarLogin(dados.email, dados.senha);
    console.log(respostaLogin);

    if (!respostaLogin.token) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Credênciais inválidas"
      });
    }

    localStorage.setItem("token", respostaLogin.token);
    localStorage.setItem("dadosUsuario", JSON.stringify(respostaLogin.usuario));

    location = "/public/pages/criar-carona.html";
  }
});
