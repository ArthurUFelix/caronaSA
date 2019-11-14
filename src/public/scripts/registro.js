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

// Registra
$("#registro-form").submit(async function(e) {
  e.preventDefault();

  const dados = {
    nome: $("#campoNome").val(),
    email: $("#campoEmail").val(),
    senha: $("#campoSenha").val(),
    telefone: $("#campoEmail").val(),
    endereco: "Endereço ficticio, de teste, 32", //$("#campoEndereco").val(),
    lat: "-27.600407", //$("#campoLatitude").val(),
    lon: "-48.525815" //$("#campoLongitude").val()
    // campoCEP
    // campoEndereco
    // campoNumero
    //Rio Tavares, Servidão Quadros, 519
  };

  let requisicao = await fetch("/usuarios", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(dados)
  });

  let resposta = await requisicao.json();

  console.log(resposta);
});
