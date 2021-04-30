import buildPropertySampleLabelForDatatype from '../src/buildPropertySampleLabelForDatatype.js'

export default function propertyWithDatatype( datatype ) {
    return {
        datatype,
        labels: {
            en: { language: 'en', value: buildPropertySampleLabelForDatatype( datatype ) },
        },
    }
}