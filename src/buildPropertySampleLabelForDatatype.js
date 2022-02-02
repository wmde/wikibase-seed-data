export default function ( datatype, index = null ){
	const ret = `${ datatype } property`;

	if ( Number.isInteger( index ) ) {
		return ret + ` No. ${ index }`;
	} else {
		return ret;
	}
}
