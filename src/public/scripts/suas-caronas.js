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
              <span class="mdc-button__label">ACHAR CARONA</span>
            </button>
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <span class="mdc-button__label">CRIAR CARONA</span>
            </button>
          </div>
        </div>
      </div>
    `);
  }

  resposta.map(carona => {
    containerCards.append(`
      <div class="cardWrapper mdc-elevation--z1">
        <div class="cardContainer">
          <div class="cardTitle" style="">
            <h6 class="mdc-dialog__title">${carona.instituicao.nome}</h6>
            <div class="cardSwitch">
            <button class="mdc-button mdc-button--unelevated caronaIndisponivel">
            <div class="mdc-button__ripple"></div>
            <span class="mdc-button__label">Indisponível</span>
            <i class="material-icons mdc-button__icon" aria-hidden="true">remove_circle</i>
          </button>
              <button class="mdc-button mdc-button--unelevated caronaDisponivel">
                <div class="mdc-button__ripple"></div>
                <span class="mdc-button__label">Disponível</span>
                <i class="material-icons mdc-button__icon" aria-hidden="true">check_circle</i>
              </button>
            </div>
          </div>
          <p class="mdc-typography--body1">${carona.periodo}</p>
          <p class="mdc-typography--body1">${carona.dias}</p>
          <div class="linebreak"></div>
          <div class="mdc-card__actions" style="display: flex; justify-content: space-between">
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <span class="mdc-button__label">DELETAR</span>
            </button>
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <span class="mdc-button__label">TROCAR DISPONIBILIDADE</span>
            </button>
          </div>
        </div>
      </div>
      <script type="text/javascript">mdc.autoInit();</script>
    `);
  });
});
