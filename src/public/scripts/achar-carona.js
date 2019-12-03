$(document).ready(async () => {
  let resposta, distancia;

  await Swal.fire({
    html: `
      <div class="alertContainer">
        <h6 class="mdc-typography--headline6">Achar Carona</h6>
  
        <p class="mdc-typography--overline">DESTINO</p>
        <div class="mdc-select mdc-select--outlined mdc-select--required" data-mdc-auto-init="MDCSelect" style="width: 100%">
          <input
            id="campoInstituicao"
            type="hidden"
            name="enhanced-select"
            required
          />
          <i class="mdc-select__dropdown-icon"></i>
          <div
            class="mdc-select__selected-text"
            aria-required="true"
          ></div>
          <div
            class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class"
            style="z-index: 1061;"
          >
            <ul class="mdc-list" id="listaInstituicoes">
              <li
                class="mdc-list-item mdc-list-item--selected"
                data-value=""
                aria-selected="true"
              ></li>
            </ul>
          </div>
          <div class="mdc-notched-outline">
            <div class="mdc-notched-outline__leading"></div>
            <div class="mdc-notched-outline__notch">
              <label class="mdc-floating-label">Instituição</label>
            </div>
            <div class="mdc-notched-outline__trailing"></div>
          </div>
        </div>
        
        <p class="mdc-typography--overline">RAIO DE BUSCA: <span id="raioBusca">250</span> metros</p>
        <div class="mdc-slider mdc-slider--discrete mdc-slider--display-markers" tabindex="0" role="slider"
            aria-valuemin="250" aria-valuemax="2000" aria-valuenow="250" data-step="250"
            aria-label="Select Value"
            id="divDistancia">
          <div class="mdc-slider__track-container">
            <div class="mdc-slider__track"></div>
            <div class="mdc-slider__track-marker-container"></div>
          </div>
          <div class="mdc-slider__thumb-container">
            <div class="mdc-slider__pin" style="width: 40px; height: 40px; margin-top: -18px; margin-left: -9px;">
              <span class="mdc-slider__pin-value-marker"></span>
            </div>
            <svg class="mdc-slider__thumb" width="21" height="21">
              <circle cx="10.5" cy="10.5" r="7.875">        </circle>
              </svg>
              <div class="mdc-slider__focus-ring"></div>
            </div>
          </div>
        </div>
      </div>
    `,
    confirmButtonText: "Buscar",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    showCloseButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showLoaderOnConfirm: true,
    onClose: () => {
      if (!resposta) location = "/suas-caronas.html";
    },
    onOpen: async () => {
      mdc.autoInit();

      const slider = new mdc.slider.MDCSlider(
        document.querySelector(".mdc-slider")
      );

      slider.listen("MDCSlider:change", () => {
        $("#raioBusca").text(slider.value);
      });

      setTimeout(() => {
        slider.layout();
      }, 230);

      $(window).resize(function() {
        $(".mdc-select__menu").width($(".mdc-select").width());
      });

      $(window).trigger("resize");

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
    },
    preConfirm: () => {
      const instituicao = $(".mdc-select__selected-text").text();
      const id_instituicao = $("#campoInstituicao").val();
      distancia = $("#divDistancia").attr("aria-valuenow");

      if (!id_instituicao) {
        return Swal.showValidationMessage(
          `Selecione uma instituição para prosseguir`
        );
      }

      return fetch(
        `/buscar?id_instituicao=${id_instituicao}&distancia=${distancia}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`
          }
        }
      )
        .then(async response => {
          const res = await response.json();

          if (!res.length) {
            throw new Error();
          }

          resposta = res;

          return;
        })
        .catch(error => {
          Swal.showValidationMessage(
            `Não encontramos nenhuma carona para o seu destino (${instituicao}) dentro do raio informado`
          );
        });
    }
  });

  let map = new H.Map(
    document.getElementById("map"),
    defaultLayers.vector.normal.map,
    {
      zoom: 15,
      center: { lat: -27, lng: -48 }
    }
  );

  // add a resize listener to make sure that the map occupies the whole container
  window.addEventListener("resize", () => map.getViewPort().resize());

  // Create the default UI:
  let ui = H.ui.UI.createDefault(map, defaultLayers);

  // Instantiate the default behavior, providing the mapEvents object:
  let behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

  const grupo = new H.map.Group();

  const carIcon = new H.map.Icon('/public/images/car.svg', {size: {w: 32, h: 32}});
    
  resposta.map(carona => {
    let marcador = new H.map.Marker({
      lat: carona.usuario.geoloc.coordinates[0],
      lng: carona.usuario.geoloc.coordinates[1]
    },
    {
      icon: carIcon
    });

    marcador.setData(carona.id);

    grupo.addObject(marcador);
  });

  // Adiciona grupo com os marcadores ao mapa
  map.addObject(grupo);

  grupo.addEventListener("tap", async function(evt) {
    const id_carona = evt.target.getData();

    const req = await fetch(`/caronas/${id_carona}`, {
      headers: {
        Authorization: `Bearer ${localStorage.token}`
      }
    });

    const carona = await req.json();

    Swal.fire({
      title: `Carona de ${carona.usuario.nome}`,
      html: `
        <div style="text-align: left;">
          <p><b>Período: </b><span>${carona.periodo}</span></p>
          <p><b>Dias: </b><span>${carona.dias}</span></p>
          <p><b>Descrição do veículo: </b><span>${carona.desc_carro}</span></p>
          <p><b>Celular de <span>${carona.usuario.nome.split(" ")[0]}</span>: </b><span id="telefone-${id_carona}">${carona.usuario.telefone}</span></p>
        </div>
        `,
      showCloseButton: true,
      confirmButtonText: "Fechar",
      confirmButtonAriaLabel: "Thumbs up, great!",
      onOpen: () => {
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

        $(`#telefone-${id_carona}`).mask(padraoTelefone, opcoes);
      }
    });
  });

  const {
    geoloc: { coordinates }
  } = dadosUsuario;

  circulo = new H.map.Circle(
    // The central point of the circle
    { lat: coordinates[0], lng: coordinates[1] },
    // The radius of the circle in meters
    distancia,
    {
      style: {
        strokeColor: "rgba(31, 38, 42, 1)",
        lineWidth: 2,
        fillColor: "rgba(31, 38, 42, 0.1)"
      }
    }
  );
  map.addObject(circulo);

  // Define zoom no mapa para englobar todos os marcadores
  map.getViewModel().setLookAtData({
    bounds: circulo.getBoundingBox()
  });
});

function adicionarMarcador(grupo, coordenadas, id) {
  var marcador = new H.map.Marker(coordenadas);

  marker.setData(id);
  grupo.addObject(marker);
}
