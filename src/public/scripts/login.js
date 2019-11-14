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

    let requisicao = await fetch("/sessoes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(dados)
    });

    let resposta = await requisicao.json();

    if (!resposta.token) {
      return alert("credenciais erradas pô");
    }

    localStorage.setItem("token", resposta.token);
    localStorage.setItem("dadosUsuario", JSON.stringify(resposta.usuario));

    location = "/public/pages/criar-carona.html";
  }
});
