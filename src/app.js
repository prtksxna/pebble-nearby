var UI = require('ui');
var ajax = require( 'ajax' );

var Cards = {
	gettingLocation: new UI.Card( {
		title: 'Nearby',
		subtitle: 'Getting location…'
	} ),

	loadingArticles: new UI.Card( {
		title: 'Nearby',
		subtitle: 'Loading Wikipedia articles…'
	} ),
	
	error: new UI.Card( {
		title: 'Error',
		subtitle: 'There was some problem'
	} ),

	loadingArcitle: new UI.Card( {
		title: '',
		subtitle: 'Loading'
	} )
};

var Location = {
	options: {
		enableHighAccuracy: true, 
		maximumAge: 10000, 
		timeout: 10000
	},

	successCallback: function ( pos ) {
		console.log('lat= ' + pos.coords.latitude + ' lon= ' + pos.coords.longitude);
		Cards.loadingArticles.show();
		WP.loadArticles( pos.coords.latitude, pos.coords.longitude );
	},

	errorCallback: function ( err ) {
		console.log('location error (' + err.code + '): ' + err.message);
		Cards.error.show();
	},

	getCurrentLocation: function () {
		Cards.gettingLocation.show();
		console.log( 'getting location ');
		navigator.geolocation.getCurrentPosition(
			Location.successCallback,
			Location.errorCallback,
			Location.options
		);
	}
};

var WP = {
	loadArticles: function ( lat, lon ) {
		var url = 'http://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lon + '&format=json';
		ajax( { url: url, type: 'json' },
							function(json) {
								WP.showPlaces( json.query.geosearch, { latitude: lat, longitude: lon } );
							},
							function(error) {
								Cards.error.show();
							}
						);
	},

	showPlaces: function ( places, currentLocation ) {
		var items = [], placeMenu;
		for( var i = 0; i < places.length; i ++) {
			var place = places[ i ];
			items.push( {
				title: place.title,
				subtitle: place.dist + ' km'
			} );
		}
		placeMenu = new UI.Menu( { 
			sections: [
				{
					title: 'Get new places',
					items: [ {
						title: 'Refresh',
						subtitle: 'Get you current location…'
					} ]
				},
				{
					title: 'Places',
					items: items
				}
			]
		} );

		placeMenu.on( 'select', function ( e ) { 
			if ( e.itemIndex === 0 && e.sectionIndex === 0 ){
				Location.getCurrentLocation();
			}
		} );

		placeMenu.show();
	}
};

Pebble.addEventListener('ready', function( e ) {
	Location.getCurrentLocation();
} );
