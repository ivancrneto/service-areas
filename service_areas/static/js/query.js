(function() {
  serviceAreas.query = {
    pol: null,

    init: function() {
      for(p in points) {
        points[p] = new google.maps.LatLng(points[p][0], points[p][1]);
      }

      serviceAreas.query.pol = new google.maps.Polygon({
        map: serviceAreas.map.mapobj, paths: points,
        fillColor: "#8888ff", fillOpacity: 0.35,
        strokeColor: "#0000ff", strokeOpacity: 0.45, clickable: false
      });

      serviceAreas.query.pol.setMap(serviceAreas.map.mapobj);
    }
  };

  $(document).ready(function() {
    serviceAreas.query.init();
  });
})();
