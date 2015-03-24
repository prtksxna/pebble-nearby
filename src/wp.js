var ajax = require( 'ajax' );
var Cards = require( 'cards' );
var UI = require( 'ui' );
var Location = require( 'location' );

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
			console.log( e.itemIndex, e.sectionIndex )
			if ( e.itemIndex === 0 && e.sectionIndex === 0 ){
				console.log( 'sdf')
				Location.getCurrentLocation();
			}
		} );

		placeMenu.show();
	}
};

module.exports = WP;