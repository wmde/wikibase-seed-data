export default function( apiClient ) {
	[
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
	].forEach( async ( datatype ) => {
		await apiClient.createProperty( {
			datatype,
			labels: {
				en: { language: 'en', value: `${ datatype } property` },
			},
		} );
	} );
};
