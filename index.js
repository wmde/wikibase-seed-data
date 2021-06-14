import meow from 'meow';
import fetch from 'node-fetch';
import RequestError from './src/RequestError.js';
import EntityCreationError from './src/EntityCreationError.js';
import buildPropertySampleLabelForDatatype from './src/buildPropertySampleLabelForDatatype.js';
import propertyWithDatatype from './entityTemplates/propertyWithDatatype.js';

const cli = meow( {
	flags: {
		script: {
			type: 'string',
			alias: 's',
			isRequired: true,
		}
	}
} );

const TIME_BETWEEN_REQUESTS = 0;

class ApiClient {

	constructor( apiUrl ) {
		this.apiUrl = apiUrl;
		this.pendingRequests = [];
	}

	async createItem( entitySerialization ) {
		return this._createEntity( 'item', entitySerialization );
	}

	async createProperty( entitySerialization ) {
		return this._createEntity( 'property', entitySerialization );
	}

	async _createEntity( type, entitySerialization ) {
		const url = new URL( this.apiUrl );
		const payload = new URLSearchParams( {
			action: 'wbeditentity',
			new: type,
			data: JSON.stringify( entitySerialization ),
			format: 'json',
			token: '+\\'
		} );

		let request;
		try {
			request = this._queueRequest( async () => await ( await fetch( url, {
				method: 'POST',
				body: payload,
			} ) ).json() );
		} catch( e ) {
			console.log( 'Request to create entity failed: ' + e.message );
			throw new RequestError( e.message );
		}

		const response = await request;
		if( response && response.success !== 1 ) {
			console.log( `Server failed to create entity: ${ response.error.info }` );
			throw new EntityCreationError( response.error.info );
		}

		return response.entity.id;
	}

	async _queueRequest( requestCallback ) {
		if( this.pendingRequests.length === 0 ) {
			const request = requestCallback();
			this.pendingRequests.push( request )
			return request;
		}

		const request = new Promise( ( async ( resolve ) => {
			await Promise.all( [ ...this.pendingRequests ] );

			setTimeout( () => {
				resolve( requestCallback() );
			}, TIME_BETWEEN_REQUESTS )
		} ) );

		this.pendingRequests.push( request );

		return request;
	}

	async findOrCreatePropertyByDataType( datatype ){
		const label = buildPropertySampleLabelForDatatype( datatype )
		const propertyId = await this._findPropertyByLabel( label )
		if ( propertyId !== null ) {
			return propertyId
		} else {
			return await this.createProperty( propertyWithDatatype( datatype ) )
		}
	}

	async _findPropertyByLabel( label ){
		const url = new URL( this.apiUrl );
		const payload = new URLSearchParams( {
			action: 'wbsearchentities',
			type: 'property',
			search: label,
			format: 'json',
			language: 'en'
		} );

		url.search = payload

		let request;
		try {
			request = this._queueRequest( async () => await ( await fetch( url, {
				method: 'GET',
			} ) ).json() );
		} catch( e ) {
			console.log( 'Request to lookup property by label failed: ' + e.message );
			throw new RequestError( e.message );
		}
		const response = await request

		const property = response.search.find( p => p.label === label )
		return property ? property.id : null
	}
}

const apiClient = new ApiClient(process.env.MW_SERVER + process.env.MW_SCRIPT_PATH + '/api.php');

const { default: script } = await import( cli.flags.script );

script( apiClient );
