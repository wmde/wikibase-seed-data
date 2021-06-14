async function makeMainEntitySerialization( apiClient, statements ) {
    return {
        labels: {
            en: {
                language: 'en', value: 'Item linking to many large items',
            },
        },
        descriptions: {
            en: {
                language: 'en', value: 'item that has statments targetting many, large items',
            },
        },
        aliases: {},
        claims: await Promise.all( statements.map( async ( { datatype, value } ) => {
            // const propertyId = await apiClient.findOrCreatePropertyByDataType( datatype );
            const propertyId = 'P2';
            if( propertyId ) {
                return {
                    mainsnak: {
                        snaktype: 'value',
                        property: propertyId,
                        datavalue: value,
                        datatype: datatype,
                    },
                    type: 'statement',
                    rank: 'normal',
                };
            } else {
                console.log( 'Skipped creating a statement for datatype ' + datatype + ' and value ' + value );
                return null;
            }
        } ).filter( s => s ) ),
    };
}

function makeReferencedEntitySerialization( number, stringPropertyId ) {
    return {
        labels: {
            en: {
                language: 'en', value: 'Referenced Item Number: ' + number,
            },
        },
        descriptions: {
            en: {
                language: 'en', value: 'An item that is large number: ' + number,
            },
        },
        aliases: {},
        claims: [ ...Array( numberOfFakeStatements ).keys() ].map( i => {
            return { mainsnak: {
            snaktype: 'value',
            property: stringPropertyId,
            datavalue: {
                value: 'something ' + i,
                type: 'string'
            },
            datatype: stringDatatype,
        },
        type: 'statement',
        rank: 'normal',
            }
         } )
    }
}

const stringDatatype = 'string';
const numberOfFakeStatements = 10000;
const numberOfReferencedItems = 1;

export default async function( apiClient ) {
    const itemDatatype = 'wikibase-item';
    const stringPropertyId = await apiClient.findOrCreatePropertyByDataType( stringDatatype );
    const referencedItemIds = Promise.all( [ ...Array( numberOfReferencedItems ).keys() ].map( i => {
        return Promise.resolve( 'Q'+(i+2) );
        const referencedEntitySerialization = makeReferencedEntitySerialization( i, stringPropertyId );
        return apiClient.createItem( referencedEntitySerialization );
    } ) );

    const statements = (await referencedItemIds).map( referencedItemId => {
        return {datatype: itemDatatype, value: {type: 'wikibase-entityid', value: { 'entity-type': 'item', id: referencedItemId} } }
    } );

    const mainEntitySerialization = await makeMainEntitySerialization( apiClient, statements );
    const itemId = await apiClient.createItem( mainEntitySerialization );
    console.log( itemId );
};
