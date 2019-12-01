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
    $("#campoEndereco").val("");
    $("#campoLoc").val("");
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

$("#buttonRegistroGPS").click(function() {
  Swal.fire({
    title: "Deseja usar sua localização atual?",
    text:
      "Caso você esteja em um dispositivo sem GPS, para melhor experiência com o aplicativo, é recomendado não utilizar esta função, e digitar seu endereço manualmente",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    cancelButtonText: "Digitar manualmente",
    confirmButtonText: "Buscar localização"
  }).then(async result => {
    if (result.value) {
      const { coords } = await pegarCoordenadas();

      $("#campoLatitude").val(coords.latitude);
      $("#campoLongitude").val(coords.longitude);

      const cep = await coordenadasCep(
        `${coords.latitude}, ${coords.longitude}`
      );

      definirValor($("#campoCEP"), "");

      $("#campoCEP")
        .val(cep)
        .trigger("keyup");
    } else {
      $("#campoCEP").val("");
      $("#campoEndereco").val("");
      $("#campoLatitude").val("");
      $("#campoLongitude").val("");
    }
  });
});

// Registra
$("#registro-form").submit(async function(e) {
  e.preventDefault();

  let coords = {};
  if ($("#campoLatitude").val() && $("#campoLongitude").val()) {
    coords = {
      latitude: $("#campoLatitude").val(),
      longitude: $("#campoLongitude").val()
    };
  } else {
    coords = await enderecoCoordenadas(
      $("#campoLoc")
        .val()
        .replace("replaceNumero", $("#campoNumero").val())
    );
  }

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
  localStorage.setItem("idUsuario", respostaLogin.usuario.id);

  location = "/suas-caronas.html";
});
