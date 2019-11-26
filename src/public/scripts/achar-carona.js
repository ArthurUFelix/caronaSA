$(document).ready(async () => {
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

  let resposta, distancia;

  await Swal.fire({
    html: `
      <input id="campoDistancia">
      <select id="campoInstituicao">
        <option value="2">Senai</option>
      </select>
    `,
    confirmButtonText: "Buscar",
    showCancelButton: true,
    cancelButtonText: "Cancelar",
    showCloseButton: true,
    allowOutsideClick: false,
    allowEscapeKey: false,
    showLoaderOnConfirm: true,
    onClose: () => {
      location = "/suas-caronas.html";
    },
    preConfirm: () => {
      const instituicao = $("#campoInstituicao :selected").text();
      const id_instituicao = $("#campoInstituicao").val();
      distancia = $("#campoDistancia").val();

      return fetch(`/buscar?id_instituicao=${id_instituicao}&distancia=${distancia}`, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`
        }
      })
        .then(async response => {
          const res = await response.json();

          if(res.length === 0) {
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

  const grupo = new H.map.Group();

  resposta.map(carona => {
    let marcador = new H.map.Marker({
      lat: carona.usuario.geoloc.coordinates[0],
      lng: carona.usuario.geoloc.coordinates[1]
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
          <p><b>Celular de Arthur: </b><span>${carona.usuario.telefone}</span></p>
        </div>
        `,
      showCloseButton: true,
      focusConfirm: false,
      confirmButtonText: "Fechar",
      confirmButtonAriaLabel: "Thumbs up, great!"
    });
  });

  const {
    geoloc: { coordinates }
  } = JSON.parse(localStorage.dadosUsuario);

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
