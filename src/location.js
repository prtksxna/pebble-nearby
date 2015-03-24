var Cards = require( 'cards' );
var WP = require( 'wp' );

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
		Pebble.addEventListener('ready', function( e ) {
			navigator.geolocation.getCurrentPosition(
				Location.successCallback,
				Location.errorCallback,
				Location.option
			);
		} );
	}
};

module.exports = Location;