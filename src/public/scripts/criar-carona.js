verificarLogado();

$(window).resize(function() {
  $(".mdc-select__menu").width($(".mdc-select").width());
});

// Carrega dados do form
$(document).ready(async () => {
  // Arruma o select ruim
  $(".mdc-select__menu").width($(".mdc-select").width());

  const requisicao = await fetch("/instituicoes", {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  const instituicoes = await requisicao.json();

  const lista = $("#listaInstituicoes");

  instituicoes.map(i => {
    lista.append(`
      <li class="mdc-list-item" data-value="${i.id}">
        ${i.nome}
      </li>
    `);
  });

  const dados = JSON.parse(localStorage.dadosUsuario);

  $("#campoEndereco").val(dados.endereco);
});

$("#carona-form").submit(async function(e) {
  e.preventDefault();

  const dias = [];

  $(".mdc-chip--selected span.mdc-chip__text").map(function() {
    dias.push($(this).text());
  });

  const dados = {
    id_instituicao: $("#campoInstituicao").val(),
    desc_carro: $("#campoVeiculo").val(),
    periodo: $("#campoPeriodo").val(),
    dias: dias
  };

  let requisicaoCarona = await fetch("/caronas", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.token}`
    },
    body: JSON.stringify(dados)
  });

  let respostaCarona = await requisicaoCarona.json();

  if (!respostaCarona.id) {
    return Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        "Ocorreu um erro ao criar sua carona, verifique os dados preenchidos e tente novamente. Lembre-se que todas as informações são obrigatórias"
    });
  }

  alert("Agora redireciona o user para a tela 'minhas caronas'");
});
