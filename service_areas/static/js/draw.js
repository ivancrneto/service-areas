(function() {
  serviceAreas.draw = {
    pols: [], // we start with polygons as empty
    currentPol: null,
    points: [], // points that make the polygon
    allPoints: [],
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
      $('button[name="show-coordinates"]').click(serviceAreas.draw.showCoords);
      $('button[name="submit-area"]').click(serviceAreas.draw.submit);

      // here we can use the map object set up in maps.js
      google.maps.event.addListener(serviceAreas.map.mapobj, 'click',
        serviceAreas.draw.mapClicked);
    },

    start: function() {
      // if there is no polygon, we create one
      if (!serviceAreas.draw.currentPol) {
        serviceAreas.draw.currentPol = new google.maps.Polygon({map: null, paths: [],
          fillColor: "#8888ff", fillOpacity: 0.35,
          strokeColor: "#0000ff", strokeOpacity: 0.45, clickable: false
        });
      }

      serviceAreas.draw.isdrawing = true;
    },

    finish: function() {
      // append currentPol to the array of pols, set current pol and points to
      // null and set isdrawing to false
      if(serviceAreas.draw.currentPol.getPath()) {
        serviceAreas.draw.pols.push(serviceAreas.draw.currentPol);
      }
      serviceAreas.draw.currentPol = null;
      serviceAreas.draw.points = [];
      serviceAreas.draw.isdrawing = false;
    },

    clear: function() {
      // remove all pols from the map
      for(pol in serviceAreas.draw.pols) {
        serviceAreas.draw.pols[pol].setMap(null);
      }

      // remove the last drawn pol from the map and also hide coordinates if
      // they are showing up
      serviceAreas.draw.currentPol.setMap(null);
      serviceAreas.mapUtils.hideCoordinates();

      // general clean up
      serviceAreas.draw.pols = [];
      serviceAreas.draw.currentPol = null;
      serviceAreas.draw.points = [];
      serviceAreas.draw.allPoints = [];
    },

    showCoords: function(e) {
      e.preventDefault();

      if(!serviceAreas.draw.allPoints.length) {
        serviceAreas.mapUtils.hideCoordinates();
        return;
      }

      var points = serviceAreas.draw.allPoints;
      var button = $(this);
      setTimeout(function(){
        if(button.hasClass('active')) {
          serviceAreas.mapUtils.showCoordinates(points, serviceAreas.map.mapobj);
        } else {
          serviceAreas.mapUtils.hideCoordinates();
        }
      }, 100);
    },

    submit: function() {
      if(!serviceAreas.draw.pols.length) {
        alert('You should draw at leat one area before submitting.');
        return;
      }

      var pols = [];

      // iterate over the polygons
      for(pol in serviceAreas.draw.pols) {
        // for each polygon, get its path
        var path = serviceAreas.draw.pols[pol].getPath();

        var points = [];
        for(var p = 0; p < path.length; p++) {
          point = path.getAt(p);
          points.push([point.lat(), point.lng()]);
        }

        pols.push(points);
      }
      pols = JSON.stringify(pols)

      var url = $(this).data('url');
      var data = {
        pols: pols,
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

      var latLng = event.latLng;
      serviceAreas.draw.points.push(latLng);
      serviceAreas.draw.allPoints.push(latLng);

      // to form a polygon, we must have more than 2 points clicked
      if (serviceAreas.draw.points.length >= 2) {
          serviceAreas.draw.currentPol.setPath(serviceAreas.draw.points);
          serviceAreas.draw.currentPol.setMap(serviceAreas.map.mapobj);
      }
    },

  };

  $(document).ready(function() {
    serviceAreas.draw.init();
  });
})();
