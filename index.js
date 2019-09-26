const stringify = require('csv-stringify');
const fs = require('fs');

const parameters = [
	{
		name: 'size',
		entries: [
			{ key: 'XS', value: 32 },
			{ key: 'S', value: 36 },
			{ key: 'M', value: 38 },
			{ key: 'L', value: 42 } ]
	},
	{
		name: 'country',
		entries: [
			{ key: 'DE', value: 'Deutschland' },
			{ key: 'US', value: 'United States of America' },
			{ key: 'ES', value: 'Spain' } ]
	},
	{
		name: 'dax',
		entries: [
			{ key: 'ADS', value: 'Adidas' },
			{ key: 'ALV', value: 'Allianz' },
			{ key: 'BAS', value: 'BASF' } ]
	}
];



const writeStream = fs.createWriteStream("output.csv");

const stringifier = stringify({
	delimiter: ',',
	header: true,
	columns:['id', 'size','country','dax']
});
stringifier.pipe(writeStream);

const generateTuples = function(keysPrefix, valuesPrefix, parameters, index) {
		index = index || 0;
		var parameter = parameters[index];
		var entries = parameter.entries;
		for (let entryIndex = 0; entryIndex < entries.length; entryIndex++) {
			let entry = entries[entryIndex];
			let key = entry.key;
			let value = entry.value;
			let keys = keysPrefix.slice();
			let values = valuesPrefix.slice();
			keys.push(key);
			values.push(value);
			if(index < parameters.length - 1) {
				generateTuples(keys, values, parameters, index+1);
			} else {
				let id = keys.join('-');
				values.splice(0, 0, id);
				stringifier.write(values);
			}
		}
};
generateTuples([], [], parameters);
stringifier.end();