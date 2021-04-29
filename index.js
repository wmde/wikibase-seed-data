import meow from 'meow';
import fetch from 'node-fetch';

const cli = meow( {
	flags: {
		script: {
			type: 'string',
			alias: 's',
			isRequired: true,
		}
	}
} );

class ApiClient {

	constructor( apiUrl ) {
		this.apiUrl = apiUrl;
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

		let response;
		try {
			response = await ( await fetch( url, {
				method: 'POST',
				body: payload,
			} ) ).json();
		} catch( e ) {
			console.log( 'Request to create entity failed: ' + e.message );
		}

		if( response && response.success !== 1 ) {
			console.log( `Server failed to create entity: ${ response.error.info }` );
		}

		return response;
	}
}

const apiClient = new ApiClient(process.env.MW_SERVER + process.env.MW_SCRIPT_PATH + '/api.php');

const { default: script } = await import( cli.flags.script );

script( apiClient );
