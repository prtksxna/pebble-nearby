var UI = require('ui');

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

module.exports = Cards;
