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
		Cards.gettingLocation.hide();
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
		var url = 'https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=' + lat + '|' + lon + '&format=json';
		ajax( { url: url, type: 'json' },
							function(json) {
								WP.showPlaces( json.query.geosearch, { latitude: lat, longitude: lon } );
							},
							function(error) {
								Cards.error.show();
							}
						);
	},

	showArticle: function ( title, distance, pageid ) {
		// open a card
		var loadingCard = new UI.Card( {
			title: title,
			subtitle: 'Loading…'
		} ).show();

		// make ajax call
		var url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&pageids=' + pageid + '&prop=extracts&explaintext=true&exintro=true&exsentences=2';
		ajax( { url: url, type: 'json' },
							function ( json ) {
								new UI.Card( {
									title: title,
									subtitle: distance,
									body: json.query.pages[ pageid ].extract,
									scrollable: true,
									style: 'small'
								} ).show();
								loadingCard.hide();
							},
							function ( error ) {
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
				subtitle: Math.ceil( place.dist / 1000 ) + ' km',
				pageid: place.pageid
			} );
		}
		placeMenu = new UI.Menu( {
			sections: [
				{
					title: 'Get new places',
					items: [ {
						title: 'Refresh',
						subtitle: 'Get your current location…'
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
			} else {
				WP.showArticle( e.item.title, e.item.subtitle, e.item.pageid );
			}
		} );

		placeMenu.show();
		Cards.loadingArticles.hide();
	}
};

// Init
Location.getCurrentLocation();
