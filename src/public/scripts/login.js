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

    location = "/public/pages/suas-caronas.html";
  }
});

$("#btnRecuperarSenha").click(() => {
  Swal.fire({
    title: "Recuperar Conta",
    input: "text",
    inputAttributes: {
      placeholder: "Digite seu email",
      autocapitalize: "off"
    },
    showCancelButton: true,
    confirmButtonText: "Recuperar",
    cancelButtonText: "Cancelar",
    showLoaderOnConfirm: true,
    preConfirm: inputEmail => {
      return fetch("/recuperacao", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: inputEmail })
      })
        .then(response => {
          if (!response.ok) {
            throw new Error(response.statusText);
          }
          return response.json();
        })
        .catch(error => {
          Swal.showValidationMessage(
            "Não encontramos nenhuma conta com o email informado"
          );
        });
    },
    allowOutsideClick: () => !Swal.isLoading()
  }).then(result => {
    if (result.value.id) {
      Swal.fire({
        icon: "success",
        title: "Sucesso!",
        text: "Enviamos uma mensagem para seu email com as informações de login"
      });
    }
  });
});
