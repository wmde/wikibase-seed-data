import meow from 'meow';

async function makeEntitySerialization( apiClient, statements, labelSuffix ) {
    return {
        labels: {
            en: {
                language: 'en', value: 'Large test item' + labelSuffix,
            },
        },
        descriptions: {
            en: {
                language: 'en', value: 'a large test item created by wikibase-seed-data large-item.js',
            },
        },
        claims: ( await Promise.all( statements.map( async ( [ statementsByProperty ] ) => {
            const datatype = statementsByProperty.type;
            const propertyIndex = statementsByProperty.index;
            const propertyId = await apiClient.findOrCreatePropertyByDataType( datatype, propertyIndex );
            if( propertyId ) {
                return statementsByProperty.values.map( value => {
                    return {
                        mainsnak: {
                            snaktype: 'value',
                            property: propertyId,
                            datavalue: value,
                        },
                        type: 'statement',
                        rank: 'normal',
                    };
                } );
            } else {
                console.log(
                    'Skipped creating a statement for datatype ' + datatype + ' with index ' + propertyIndex
                );
                return null;
            }
        } ).filter( s => s ) ) ).flatMap( s => s ),
    };
}

export default async function( apiClient ) {
    const cli = meow();
    const stringValue = {
        value: 'something',
        type: 'string'
    };

    let statements = [];
    // Create 60 string statements (two per property id)
    for ( let i = 0; i < 30; i++ ) {
        statements.push( [ { type: 'string', index: i, values: [ stringValue, stringValue ] } ] );
    }
    // Create 20 external-id statements (one per property id)
    for ( let i = 0; i < 20; i++ ) {
        statements.push( [ { type: 'external-id', index: i, values: [ stringValue ] } ] );
    }
    let labelSuffix = '';
    if ( cli.flags.randomLabel ) {
        labelSuffix = ' - ' + Math.random().toString().substring( 2 );
    }

    const entitySerialization = await makeEntitySerialization( apiClient, statements, labelSuffix );
    const itemId = await apiClient.createItem( entitySerialization );
    console.log( itemId );
}
