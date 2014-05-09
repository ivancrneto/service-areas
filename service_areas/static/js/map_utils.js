(function() {
  serviceAreas.mapUtils = {
    infos: [],

    showCoordinates: function(points, map) {
      var info;
      for(p in points) {
        info = new google.maps.InfoWindow({
          position: points[p],
          content: 'lat: ' + points[p].lat()  + '<br/>lng: ' + points[p].lng(),
        });

        serviceAreas.mapUtils.infos.push(info);
        info.open(map);
      }
    },

    hideCoordinates: function() {
      for(info in serviceAreas.mapUtils.infos) {
        serviceAreas.mapUtils.infos[info].close();
      }
    }
  };

})();
