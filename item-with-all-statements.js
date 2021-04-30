async function makeEntitySerialization( apiClient, statements ) {
    return {
        labels: {
            en: {
                language: 'en', value: 'statement showcase item',
            },
        },
        descriptions: {
            en: {
                language: 'en', value: 'item that has statements for every datatype',
            },
        },
        aliases: {
            en: [
                {
                    language: 'en', value: 'goats',
                },
                {
                    language: 'en', value: 'potato',
                },
            ],
        },
        claims: await Promise.all( statements.map( async ( { datatype, value } ) => {
            const propertyId = await apiClient.findOrCreatePropertyByDataType( datatype );
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
                console.log( 'Skipped creating a statement for datatype ' + datatype );
                return null;
            }
        } ).filter( s => s ) ),
    };
}

export default async function( apiClient ) {
    const stringValue = {
            value: 'something',
            type: 'string'
        };
    const stringDatatype = 'string';
    const timeValue = {
        value: {
            time: '+2021-04-30T00:00:00Z',
            timezone: 0,
            before: 0,
            after: 0,
            precision: 11,
            calendarmodel: 'http://www.wikidata.org/entity/Q1985727',
        },
        type: 'time',
    };
    const timeDatatype = 'time';
    const statements = [
        { datatype: stringDatatype, value: stringValue },
        { datatype: timeDatatype, value: timeValue },
    ];
    const entitySerialization = await makeEntitySerialization( apiClient, statements );
    const itemId = await apiClient.createItem( entitySerialization );
    console.log( itemId );
}
