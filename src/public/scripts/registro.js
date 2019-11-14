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
