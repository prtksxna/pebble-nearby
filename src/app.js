/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var ajax = require('ajax');


// Init
var gettingLocationCard = new UI.Card({
  title: 'Nearby',
  subtitle: 'Getting location…'
});

var loadingArticlesCard = new UI.Card({
  title: 'Nearby',
  subtitle: 'Loading Wikipedia articles…'
});

var errorCard = new UI.Card({
  title: 'Error',
  subtitle: 'There was some problem'
})

gettingLocationCard.show();


// Location
var locationOptions = {
  enableHighAccuracy: true, 
  maximumAge: 10000, 
  timeout: 10000
};

function locationSuccess(pos) {
  console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
  loadingArticlesCard.show();
  loadArticles( pos.coords.latitude, pos.coords.longitude );
}

function locationError(err) {
  console.log('location error (' + err.code + '): ' + err.message);
  errorCard.show()
}

Pebble.addEventListener('ready',
  function(e) {
    // Request current position
    navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
);

// Wikipedia
function loadArticles ( lat, lon ) {
  var url = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lon + '&format=json';
  ajax({url: url, type: 'json'},
  function(json) {
    showPlaces( json.query.geosearch )
  },
  function(error) {
    console.log('Ajax failed: ' + error);
  }
);
}

function showPlaces ( places ){  
  var sections = [];
  for( var i = 0; i < places.length; i ++)   {
    var place = places[ i ];
    sections.push( {title: place.title })
  }
  var placeMenu = new UI.Menu({ sections: sections });
  placeMenu.show();
}