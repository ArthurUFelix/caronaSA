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
          <h6 class="mdc-dialog__title">${carona.instituicao.nome}</h6>
          <div class="mdc-switch mdc-switch--checked" data-mdc-auto-init="MDCSwitch">
            <div class="mdc-switch__track"></div>
            <div class="mdc-switch__thumb-underlay">
              <div class="mdc-switch__thumb">
                <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch" checked>
              </div>
            </div>
          </div>
          <p class="mdc-typography--body1">${carona.periodo}</p>
          <p class="mdc-typography--body1">${carona.dias}</p>
          <div class="linebreak"></div>
          <div class="mdc-card__actions">
            <button class="mdc-button mdc-card__action mdc-card__action--button">
              <span class="mdc-button__label">DELETAR</span>
            </button>
          </div>
        </div>
      </div>
      <script type="text/javascript">mdc.autoInit();</script>
    `);
  });
});
