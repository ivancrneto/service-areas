(function() {
  serviceAreas.map = {
    mapobj: null,
    div: "map_canvas",

    init: function() {
      var mapOptions = {
        center: new google.maps.LatLng(37.775, -122.4183333),
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };

      serviceAreas.map.mapobj = new google.maps.Map(document.getElementById(
          serviceAreas.map.div), mapOptions);
    }
  }

  $(document).ready(function() {
    serviceAreas.map.init();
  });
})();
