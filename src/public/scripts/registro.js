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

$("#btnMostrarSenha2").click(function() {
  if ($(this).text() == "visibility") {
    $(this).text("visibility_off");
    $("#campoConfirmarSenha").attr("type", "text");
  } else {
    $(this).text("visibility");
    $("#campoConfirmarSenha").attr("type", "password");
  }
});

// Troca passos
$("#registroContinuar").click(function(e) {
  e.preventDefault();

  $.when($("#registroParte1").fadeOut(200)).then(() => {
    $("#registroParte2").fadeIn();
  });
});

$("#registroVoltar").click(function(e) {
  e.preventDefault();

  $.when($("#registroParte2").fadeOut(200)).then(() => {
    $("#registroParte1").fadeIn();
  });
});

$(document).ready(() => {
  var padraoTelefone = function(val) {
      return val.replace(/\D/g, "").length === 11
        ? "(00) 00000-0000"
        : "(00) 0000-00009";
    },
    opcoes = {
      onKeyPress: function(val, e, field, options) {
        field.mask(SPMaskBehavior.apply({}, arguments), options);
      }
    };

  $("#campoTelefone").mask(padraoTelefone, opcoes);

  $("#campoCEP").mask("00000-000");
});

$("#campoCEP").keyup(async function() {
  if ($(this).cleanVal().length !== 8) {
    return $(this).attr("pattern", "invalido");
  }

  const loc = await cepEndereco($(this).cleanVal());

  if (loc.erro === true) {
    return $(this).attr("pattern", "invalido");
  }

  $(this).removeAttr("pattern");

  $("#campoEndereco").val(`${loc.bairro}, ${loc.logradouro}`);

  $("#campoLoc").val(
    `${loc.logradouro} replaceNumero, ${loc.localidade}, ${loc.uf}, ${loc.cep}`
  );
});

// Registra
$("#registro-form").submit(async function(e) {
  e.preventDefault();

  const coords = await enderecoCoordenadas(
    $("#campoLoc")
      .val()
      .replace("replaceNumero", $("#campoNumero").val())
  );

  const dados = {
    nome: $("#campoNome").val(),
    email: $("#campoEmail").val(),
    senha: $("#campoSenha").val(),
    telefone: $("#campoTelefone").cleanVal(),
    endereco: `${$("#campoEndereco").val()}, ${$("#campoNumero").val()}`,
    lat: coords.latitude,
    lon: coords.longitude
  };

  let requisicaoRegistro = await fetch("/usuarios", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  let respostaRegistro = await requisicaoRegistro.json();

  if (!respostaRegistro.id) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Informações inválidas ou email já em uso!"
    });
  }

  let respostaLogin = await realizarLogin(dados.email, dados.senha);

  localStorage.setItem("token", respostaLogin.token);
  localStorage.setItem("dadosUsuario", JSON.stringify(respostaLogin.usuario));

  location = "/suas-caronas.html";
});
