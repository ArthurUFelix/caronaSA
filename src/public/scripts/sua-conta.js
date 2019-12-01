$(window).resize(function() {
  if ($("#divContaEndereco").is(":visible") == false) {
    $("#divContaEndereco input, #divContaEndereco button").each(function() {
      $(this).attr(
        "id",
        `${$(this)
          .attr("id")
          .replace("-MQ", "")}-MQ`
      );
    });

    $("#divContaEndereco-MQ input, #divContaEndereco-MQ button").each(
      function() {
        $(this).attr(
          "id",
          $(this)
            .attr("id")
            .replace("-MQ", "")
        );
      }
    );
  } else {
    $("#divContaEndereco-MQ input, #divContaEndereco-MQ button").each(
      function() {
        $(this).attr(
          "id",
          `${$(this)
            .attr("id")
            .replace("-MQ", "")}-MQ`
        );
      }
    );

    $("#divContaEndereco input, #divContaEndereco button").each(function() {
      $(this).attr(
        "id",
        $(this)
          .attr("id")
          .replace("-MQ", "")
      );
    });
  }

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

  $("#buttonContaGPS").click(function() {
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
});

$(window).trigger("resize");

$(document).ready(async () => {
  const requisicao = await fetch(`/usuarios/${localStorage.idUsuario}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  const usuario = await requisicao.json();

  const endereco = usuario.endereco.split(",");

  const separador = {
    cep: await coordenadasCep(
      `${usuario.geoloc.coordinates[0]}, ${usuario.geoloc.coordinates[1]}`
    ),
    logradouro: `${endereco[0]},${endereco[1]}`,
    numero: endereco[2].trim()
  };

  definirValor($("#campoNome"), usuario.nome);
  definirValor($("#campoEmail"), usuario.email);
  definirValor($("#campoTelefone"), usuario.telefone);
  definirValor($("#campoCEP"), separador.cep);
  definirValor($("#campoEndereco"), separador.logradouro);
  definirValor($("#campoNumero"), separador.numero);

  definirValor($("#campoCEP-MQ"), separador.cep);
  definirValor($("#campoEndereco-MQ"), separador.logradouro);
  definirValor($("#campoNumero-MQ"), separador.numero);

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
  $("#campoCEP-MQ").mask("00000-000");

  $("#campoCEP").trigger("keyup");
});

$("#perfil-form").submit(async function(e) {
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
    telefone: $("#campoTelefone").cleanVal(),
    endereco: `${$("#campoEndereco").val()}, ${$("#campoNumero").val()}`,
    senha: $("#campoNovaSenha").val() ? $("#campoNovaSenha").val() : undefined,
    confirmarSenha: $("#campoConfirmarNovaSenha").val()
      ? $("#campoConfirmarNovaSenha").val()
      : undefined,
    senhaAntiga: $("#campoSenhaAntiga").val()
      ? $("#campoSenhaAntiga").val()
      : undefined,
    lat: coords.latitude,
    lon: coords.longitude
  };

  let requisicaoUsuario = await fetch("/usuarios", {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`
    },
    body: JSON.stringify(dados)
  });

  let respostaCarona = await requisicaoUsuario.json();

  if (!respostaCarona.id) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        "Ocorreu um erro ao atualizar seu perfil, verifique os dados preenchidos e tente novamente. Lembre-se que todas as informações são obrigatórias, exceto as que se referem a senha"
    });
  }

  Swal.fire({
    icon: "success",
    title: "Sucesso!",
    text: "As informações de seu perfil foram atualizadas"
  }).then(() => {
    location.reload();
  });
});
