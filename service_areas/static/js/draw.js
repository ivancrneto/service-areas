(function() {
  serviceAreas.draw = {
    pol: null, // we start with polygon as null
    points: [], // points that make the polygon
    isdrawing: false, // we start with isdrawing control as false

    init: function() {
      $('button[name="draw-area"]').click(function() {
        $(this).hide();
        $('button[name="finish-draw-area"]').show();
        serviceAreas.draw.start();
      });

      $('button[name="finish-draw-area"]').click(function() {
        $(this).hide();
        $('button[name="draw-area"]').show();
        serviceAreas.draw.finish();
      });
      $('button[name="clear-area"]').click(serviceAreas.draw.clear);
      $('button[name="submit-area"]').click(serviceAreas.draw.submit);

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

    finish: function() {
      // just set is drawing to false;
      serviceAreas.draw.isdrawing = false;
    },

    clear: function() {
      serviceAreas.draw.pol.setMap(null);
      serviceAreas.draw.points = [];
    },

    submit: function() {
      if(!serviceAreas.draw.points.length) {
        alert('You should draw an area before submitting.');
        return;
      }

      // format points that are in latLng Google format to string with commas
      var points = []
      for(p in serviceAreas.draw.points) {
        points.push(serviceAreas.draw.points[p].lat() + ','
            + serviceAreas.draw.points[p].lng());
      }

      // submit the points is enough
      var url = $(this).data('url');
      var data = {
        points: points,
        csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()
      }

      $.ajax({
        url: url,
        type: 'POST',
        data: data,
        success: function(data) {
          if(data.success == true) {
            alert('Area submitted sucessfully.');
          } else {
            alert(data.message);
          }
        },
        error: function() {
          alert('An error occurred. Please try again.');
        }
      });

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
