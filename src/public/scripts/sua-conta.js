$(document).ready(async () => {
  // console.log(
  //   await coordenadasCep({
  //     prox: "-27.600407, -48.525815",
  //     mode: "retrieveAddresses",
  //     maxresults: "1",
  //     jsonattributes: 1
  //   })
  // );

  // console.log(await cepEndereco(88040401));

  const id = JSON.parse(localStorage.dadosUsuario).id;

  const requisicao = await fetch(`/usuarios/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  const usuario = await requisicao.json();

  definirValor($("#campoNome"), usuario.nome);
  definirValor($("#campoEmail"), usuario.email);
  definirValor($("#campoTelefone"), usuario.telefone);
  definirValor($("#campoEndereco"), usuario.endereco);

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

  // $("#campoCep").mask("00000-000");
});

$("#perfil-form").submit(async function(e) {
  e.preventDefault();

  const dados = {
    nome: $("#campoNome").val(),
    email: $("#campoEmail").val(),
    telefone: $("#campoTelefone").cleanVal(),
    endereco: $("#campoEndereco").val(),
    senha: $("#campoNovaSenha").val() ? $("#campoNovaSenha").val() : undefined,
    confirmarSenha: $("#campoConfirmarNovaSenha").val()
      ? $("#campoConfirmarNovaSenha").val()
      : undefined,
    senhaAntiga: $("#campoSenhaAntiga").val()
      ? $("#campoSenhaAntiga").val()
      : undefined,
    lat: "-27.586",
    lon: "-48.5049"
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
  console.log(respostaCarona);

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
