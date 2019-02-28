console.log('Starting app');
const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

var csv = require('fast-csv');

var readFile = require('./playground/readFile');

var command = process.argv[2];
console.log('command', command);
console.log('process', process.argv);

const skuOptions = {
    description: 'SKU',
    demand: true,
    alias: 's'
};
const priceOptions = {
    description: 'Price',
    demand: true,
    alias: 'p'
};
const countryOptions = {
    description: 'Country',
    demand: true,
    alias: 'c'
};
var args = yargs
    .command('listAll', 'Reading the complete data')
    .command('filter', 'Filter Country', {
        country: countryOptions,
    })
    .help()
    .argv;
console.log('yargs', args);


if (command === 'listAll') {
    var allData = readFile.getAll();
    console.log('Printing', allData);

} else if (command === 'filter') {
    console.log('Filtering Country: ', args.country);
    readFile.filterCountry_Price(args.country);

} else {
    console.log('command not recognized');
}