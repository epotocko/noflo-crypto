const noflo = require('noflo');
console.log(process.env);
try {
	// Node.js
	const crypto = require('crypto');
	if(!crypto) throw 'not found';
	function hash(data, algorithm, encoding) {
		const hash = crypto.createHash(algorithm);
		hash.update(data);
		return Promise.resolve(hash.digest(encoding));
	}
	console.log('node.js')
}
catch(e) {
	// Browser
	const ALGORITHM_MAP = {
		'sha1': 'SHA-1',
		'sha256': 'SHA-256',
		'sha384': 'SHA-384',
		'sha512': 'SHA-512'
	}
	async function hash(text, algorithm, encoding) {
		const encoded = new TextEncoder().encode(text);
		const hashBuffer = await crypto.subtle.digest(ALGORITHM_MAP[algorithm], encoded);
		const uint8Array = new Uint8Array(hashBuffer);
		if(encoding == 'hex') {
			const hashArray = Array.from(uint8Array);
			return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
		}
		else if(encoding == 'base64') {
			return btoa(
				uint8Array.reduce((data, byte) => data + String.fromCharCode(byte), '')
			);
		}
		return null;
	}
}

exports.getComponent = () => {
	const c = new noflo.Component();
	c.description = 'Calculate the hash of a string';
	c.icon = 'hashtag';
	c.inPorts.add('in', {
		datatype: 'string',
		required: true
	});
	c.inPorts.add('algorithm', {
		description: 'Hash algorithm to use',
		datatype: 'string',
		required: true,
		control: true,
		values: [
			'md5',
			'sha1',
			'sha224',
			'sha256',
			'sha384',
			'sha512',
			'whirlpool',
			'ripemd160',
		],
	});
	c.inPorts.add('encoding', {
		description: 'Encoding of output string',
		datatype: 'string',
		required: 'true',
		control: true,
		default: 'hex',
		values: [
			'hex',
			'base64',
		],
	});
	c.outPorts.add('out', {
		datatype: 'string',
	});
	c.process(async(input, output) => {
		if(!input.hasData('in', 'algorithm')) { return; }
		if(input.attached('encoding').length && !input.hasData('encoding')) { return; }
		const [data, algorithm, encoding] = input.getData('in', 'algorithm', 'encoding');
		const result = await hash(data, algorithm, encoding);
		output.sendDone({ out: result });
	});
	return c;
};