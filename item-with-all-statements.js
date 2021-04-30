import EntityCreationError from './src/EntityCreationError.js';

export default async function( apiClient ) {

    const itemId = await apiClient.createItem( 
        {
            labels: { 
                en: { 
                    language: 'en', value: 'statement showcase item' 
                } 
            },
            descriptions: {
                en: { 
                    language: 'en', value: 'item that has statements for every datatype' 
                } 
            },
            aliases: {
                en: [
                    { 
                        language: 'en', value: 'goats' 
                    },
                    { 
                        language: 'en', value: 'potato' 
                    }
                ]
            },
            claims: [
                    {
                        mainsnak: {
                            snaktype: "value",
                            property: "P9",
                            datavalue: {
                                value: "something",
                                type: "string"
                            },
                            datatype: "string"
                        },
                        type: "statement",
                        rank: "normal"
                    }
            ]
        } 
    );
    console.log( itemId );
}