const platform = new H.service.Platform({
  apikey: "JTmW8dYA61h9fZ39sGHsfsorV2KDWYHlWRlyC3kPGa4"
});

const defaultLayers = platform.createDefaultLayers();

function pegarCoordenadas() {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
}

// Endereco = Rua Numero, Cidade, UF
async function enderecoCoordenadas(endereco) {
  const geocoder = platform.getGeocodingService();

  const opcoesHere = {
    searchText: endereco,
    jsonattributes: 1
  };

  const request = await geocoder.geocode(opcoesHere);

  return request.response.view[0].result[0].location.displayPosition;
}

// Coordenadas = Lat, Lon
async function coordenadasCep(coordenadas) {
  const geocoder = platform.getGeocodingService();

  const opcoesHere = {
    prox: coordenadas,
    mode: "retrieveAddresses",
    maxresults: "1",
    jsonattributes: 1
  };

  const request = await geocoder.reverseGeocode(opcoesHere);

  return request.response.view[0].result[0].location.address.postalCode;
}

async function cepEndereco(cep) {
  const request = await fetch(`https://viacep.com.br/ws/${cep}/json/`);

  return request.json();
}
