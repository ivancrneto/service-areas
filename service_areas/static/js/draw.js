(function() {
  serviceAreas.draw = {
    pol: null, // we start with polygon as null
    points: [], // points that make the polygon
    isdrawing: false, // we start with isdrawing control as false

    init: function() {
      $('button[name="draw-area"]').click(serviceAreas.draw.start);
      $('button[name="clear-area"]').click(serviceAreas.draw.clear);

      // here we can use the map object set up in maps.js
      google.maps.event.addListener(serviceAreas.map.mapobj, 'click',
        serviceAreas.draw.mapClicked);
    },

    start: function() {
      // if there is no polygon, we create one
      if (!serviceAreas.draw.pol) {
        serviceAreas.draw.pol = new google.maps.Polygon({map: null, paths: [],
          fillColor: "#8888ff", fillOpacity: 0.35,
          strokeColor: "#0000ff", strokeOpacity: 0.45, clickable: false
        });
      }

      serviceAreas.draw.clear();
      serviceAreas.draw.isdrawing = true;
    },

    clear: function() {
      serviceAreas.draw.pol.setMap(null);
      serviceAreas.draw.points = [];
      serviceAreas.draw.isdrawing = false;
    },

    mapClicked: function(event) {
      if (!serviceAreas.draw.isdrawing) {
          return;
      }

      latLng = event.latLng;
      serviceAreas.draw.points.push(latLng);

      // to form a polygon, we must have more than 2 points clicked
      if (serviceAreas.draw.points.length >= 2) {
          serviceAreas.draw.pol.setPath(serviceAreas.draw.points);
          serviceAreas.draw.pol.setMap(serviceAreas.map.mapobj);
      }
    },

  };

  $(document).ready(function() {
    serviceAreas.draw.init();
  });
})();
