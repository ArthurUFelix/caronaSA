$(document).ready(async () => {
  const requisicao = await fetch(`/agenda`, {
    headers: {
      Authorization: `Bearer ${localStorage.token}`
    }
  });

  const resposta = await requisicao.json();

  const containerCards = $("#main-content");

  if (resposta.length === 0) {
    return containerCards.append(`
      <div class="cardWrapper mdc-elevation--z1">
        <div class="cardContainer">
          <h6 class="mdc-dialog__title">Sem carona!</h6>
          <p class="mdc-typography--body1">
            Ache uma carona ou crie uma carona para outros irem pra aula com
            você.
          </p>
          <div class="linebreak"></div>
          <div class="mdc-card__actions">
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <a href="/achar-carona.html" class="mdc-button__label">ACHAR CARONA</a>
            </button>
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <a href="/criar-carona.html" class="mdc-button__label">CRIAR CARONA</a>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  resposta.map(carona => {
    containerCards.append(`
      <div carona-id="${carona.id}" class="cardWrapper mdc-elevation--z1">
        <div class="cardContainer">
          <div class="cardTitle" style="">
            <h6 class="mdc-dialog__title">${carona.instituicao.nome}</h6>
            <div class="cardSwitch">
              <button style="cursor: inherit;" class="mdc-button mdc-button--unelevated ${
                carona.disponivel ? "caronaDisponivel" : "caronaIndisponivel"
              }">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">${
                  carona.disponivel ? "disponível" : "indisponível"
                }</span>
                <i class="material-icons mdc-button__icon" aria-hidden="true">${
                  carona.disponivel ? "check_circle" : "remove_circle"
                }</i>
              </button>
            </div>
          </div>
          <p class="mdc-typography--body1">${carona.dias}</p>
          <p class="mdc-typography--body1">${carona.periodo}</p>
          <div class="linebreak"></div>
          <div class="mdc-card__actions" style="display: flex; justify-content: space-between">
            <button class="mdc-button mdc-button--outlined mdc-card__action mdc-card__action--button btnDisponibilidade">
              <span class="mdc-button__label">MUDAR DISPONIBILIDADE</span>
            </button>
            <button class="mdc-button mdc-button--outlined mdc-card__action mdc-card__action--button" style="--mdc-theme-primary: #e53935">
              <span class="mdc-button__label btnDeletar">DELETAR</span>
            </button>
            
          </div>
        </div>
      </div>
      <script type="text/javascript">mdc.autoInit();</script>
    `);
  });

  $(".btnDisponibilidade").click(async function() {
    const id_carona = $(this)
      .closest(".cardWrapper")
      .attr("carona-id");

    const requisicao = await fetch(`/agenda/${id_carona}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });

    const carona = await requisicao.json();

    const icon = $(this)
      .closest(".cardWrapper")
      .find("i");

    if (carona.disponivel) {
      icon.removeClass("remove_circle").addClass("check_circle");
      icon
        .closest("button")
        .removeClass("caronaIndisponivel")
        .addClass("caronaDisponivel")
        .find("span")
        .text("disponível")
        .closest("button")
        .find("i")
        .text("check_circle");
    } else {
      icon.removeClass("check_circle").addClass("remove_circle");
      icon
        .closest("button")
        .removeClass("caronaDisponivel")
        .addClass("caronaIndisponivel")
        .find("span")
        .text("indisponível")
        .closest("button")
        .find("i")
        .text("remove_circle");;
    }
  });

  $(".btnDeletar").click(function() {
    Swal.fire({
      title: "Você tem certeza?",
      text: "Não será possível reverter essa ação",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sim, deletar!",
      cancelButtonText: "Cancelar"
    }).then(async result => {
      if (result.value) {
        const id_carona = $(this)
          .closest(".cardWrapper")
          .attr("carona-id");

        const requisicao = await fetch(`/caronas/${id_carona}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        });

        const resposta = await requisicao.json();

        if ((resposta.mensagem = "Carona exlcuida")) {
          $(this)
            .closest(".cardWrapper")
            .remove();

          return Swal.fire(
            "Deletada!",
            "Sua carona foi excluida com sucesso.",
            "success"
          );
        }
      }
    });
  });
});
