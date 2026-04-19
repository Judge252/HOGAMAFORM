const bidi = require('./node_modules/bidi-js/dist/bidi.js');
console.log('type', typeof bidi);
console.log('keys', Object.keys(bidi));
console.log('has getReorderedString', typeof bidi.getReorderedString);
console.log('has getReorderedIndices', typeof bidi.getReorderedIndices);
console.log('constructor', typeof bidi === 'function' ? bidi.name : 'not function');
