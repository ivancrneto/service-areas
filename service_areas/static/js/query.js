(function() {
  serviceAreas.query = {
    pol: [],
    points: [],
    marker: null,
    isquerying: false,

    init: function() {
      var points;
      for(c in coords) {
        for(pol in coords[c]) {
          points = [];
          var point;
          for(p in coords[c][pol]) {
            point = new google.maps.LatLng(coords[c][pol][p][0], coords[c][pol][p][1]);
            points.push(point);

            // we need to store all points
            serviceAreas.query.points.push(point);
          }

          // draw the polygon in map
          serviceAreas.query.pol.push(new google.maps.Polygon({
            map: serviceAreas.map.mapobj, paths: points,
            fillColor: "#8888ff", fillOpacity: 0.35,
            strokeColor: "#0000ff", strokeOpacity: 0.45, clickable: false
          }));

        }
      }

      $('button[name="query-area"]').mouseup(serviceAreas.query.handleQuery);
      $('button[name="show-coordinates"]').click(serviceAreas.query.showCoords);

      // here we can use the map object set up in maps.js
      google.maps.event.addListener(serviceAreas.map.mapobj, 'click',
        serviceAreas.query.mapClicked);
    },

    showCoords: function(e) {
      e.preventDefault();

      if(!serviceAreas.query.points.length) {
        return;
      }

      var points = serviceAreas.query.points;
      var button = $(this);
      setTimeout(function(){
        if(button.hasClass('active')) {
          serviceAreas.mapUtils.showCoordinates(points, serviceAreas.map.mapobj);
        } else {
          serviceAreas.mapUtils.hideCoordinates();
        }
      }, 100);
    },

    handleQuery: function(e) {
      e.preventDefault();

      // for some reason bootstrap takes long to add the class active to
      // a clicked checkbox
      var button = $(this);
      setTimeout(function(){
        if(button.hasClass('active')) {
          serviceAreas.query.isquerying = true;
        } else {
          serviceAreas.query.isquerying = false;
        }
      }, 100);
    },

    mapClicked: function(event) {
      if (!serviceAreas.query.isquerying) {
          return;
      }

      var point = event.latLng.lat() + ',' + event.latLng.lng();

      // add marker to the clicked point to give a better user experience
      if(serviceAreas.query.marker != null) {
        serviceAreas.query.marker.setMap(null);
      }
      serviceAreas.query.marker = new google.maps.Marker({
        position: event.latLng,
        map: serviceAreas.map.mapobj,
      });

      // submit the points is enough
      var url = $('[name="query-url"]').val();
      var data = {
        point: point,
        csrfmiddlewaretoken: $('[name="csrfmiddlewaretoken"]').val()
      }

      $.ajax({
        url: url,
        type: 'GET',
        data: data,
        success: function(data) {
          if(data.success == true) {
            var alertMsg = $('[name="alert-message"]');
            if(data.result == true) {
              alertMsg.text('This area is covered by us!');
              alertMsg.addClass('alert-success');
              alertMsg.removeClass('alert-danger');
            } else {
              alertMsg.text('This area is not covered by us...');
              alertMsg.addClass('alert-danger');
              alertMsg.removeClass('alert-success');
            }
            alertMsg.show();
            setTimeout(alertMsg.hide, 1000);
          } else {
            alert(data.message);
          }
        },
        error: function() {
          alert('An error occurred. Please try again.');
        }
      });

    }
  };

  $(document).ready(function() {
    serviceAreas.query.init();
  });
})();
