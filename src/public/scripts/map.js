

 // Obtain the default map types from the platform object:
 var platform = new H.service.Platform({
  apikey: "JTmW8dYA61h9fZ39sGHsfsorV2KDWYHlWRlyC3kPGa4"
});
var defaultLayers = platform.createDefaultLayers();

// Instantiate (and display) a map object:

var  map = new H.Map(
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
var ui = H.ui.UI.createDefault(map, defaultLayers);

// Instantiate the default behavior, providing the mapEvents object:
var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

function addMarkerToGroup(group, coordinates, html) {
  var marker = new H.map.Marker(coordinates);
  //add custom data to the marker
  marker.setData(html);
  group.addObject(marker);
}

const locs = [
  {
    coords: {
      latitude: -27.48,
      longitude: -48.20
    }
  },
  {
    coords: {
      latitude: -27.58,
      longitude: -48.50
    }
  }
];

locs.forEach(a => {
  var group = new H.map.Group();
  map.addObject(group);
  addMarkerToGroup(
    group,
    { lat: a.coords.latitude , lng: a.coords.longitude },
    ` 
      Nome:    
      Destino:
      Dias:
      Periodo
      <button>Iniciar Chat</button>
    `
  );
});


// criar função para criar marcador com o id no banco
// .forEach(a => {
//     adicionarMarcador(coordenadas, id)
// });
// criar função para pegar o id no tap
// tap => fetch('api/caronas/{id}') => tudo

function addInstMarkerAndSetViewBounds() {
var senai = new H.map.Marker({ lat: -27.5479, lng: -48.4978}),
    ufsc = new H.map.Marker({lat: -27.601111, lng: -48.52}),
    udesc = new H.map.Marker({lat: -27.586, lng: -48.5049}),
    univale = new H.map.Marker({lat: -27.54338, lng: -48.50351}),
    ifscCen = new H.map.Marker({lat: -27.59418, lng: -48.54325}),
    ifscCon = new H.map.Marker({lat: -27.59704, lng: -48.57133}),

  // const institucoes = [
  //   {
  //     coords: {
  //       alt:
  //     },
  //     id
  //   },
  //   ...
  // ] 
    
    inst = new H.map.Group();

// add markers to the group
    inst.addObjects([senai, ufsc, udesc, univale, ifscCen, ifscCon]);
    map.addObject(inst);

    senai.setData("instituição");
    // function buscarCarona(){

      inst.addEventListener('tap', function(evt){
        console.log(evt.target.getData());
      });
    // }
    

// get geo bounding box for the group and set it to the map
map.getViewModel().setLookAtData({
bounds: inst.getBoundingBox()
});
}
addInstMarkerAndSetViewBounds(map);
// buscarCarona();







    


// FUNCTION TO GET CURRENT POSITION
// getPosition = options => {
//   return new Promise((resolve, reject) => {
//     navigator.geolocation.getCurrentPosition(resolve, reject, options);
//   });
  
// LOCATION OPTIONS
// locationOptions = {
//   enableHighAccuracy: true,
//   timeout: 10000,
//   maximumAge: 0
// };
// }



