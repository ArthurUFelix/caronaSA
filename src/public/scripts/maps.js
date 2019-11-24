const platform = new H.service.Platform({
  apikey: "JTmW8dYA61h9fZ39sGHsfsorV2KDWYHlWRlyC3kPGa4"
});

const defaultLayers = platform.createDefaultLayers();

async function coordenadasCep(coordenadas) {
  const geocoder = platform.getGeocodingService();

  const request = await geocoder.reverseGeocode(coordenadas);

  return request.response.view[0].result[0].location.address.postalCode;
}

async function cepEndereco(cep) {
  const request = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  return request.json();
}
