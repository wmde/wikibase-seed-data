import EntityCreationError from './src/EntityCreationError.js';

export default function( apiClient ) {
	const datatypes = [
		'commons-media',
		'external-id',
		'geo-shape',
		'globe-coordinate',
		'math',
		'monolingualtext',
		'musical-notation',
		'quantity',
		'string',
		'tabular-data',
		'time',
		'url',
		'wikibase-form',
		'wikibase-item',
		'wikibase-property',
		'wikibase-lexeme',
	];
	datatypes.forEach( async ( datatype ) => {
		try {
			const id = await apiClient.createProperty( {
				datatype,
				labels: {
					en: { language: 'en', value: `${ datatype } property` },
				},
			} );
			console.log( `Created ${ id }!` );
		} catch( e ) {
			if ( e instanceof EntityCreationError ) {
				console.log( e.message )
			} else {
				throw e;
			}
		}
	} );
};
