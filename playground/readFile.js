console.log('Starting app');
const fs = require('fs');
const _ = require('lodash');
const yargs = require('yargs');

var csv = require('fast-csv');
var ws = fs.createWriteStream('csv/filteredCountry.csv');
var writeLowestPrice = fs.createWriteStream('csv/lowestPrice.csv');
const csvjson = require('csvtojson');
const ObjectsToCsv = require('objects-to-csv');

/*
|----------------------------------------------------------------------------
| READING THE COMPLETE DATA FROM THE MAIN.CSV FILE
|----------------------------------------------------------------------------
*/
var fetchData = () => {
    fs.createReadStream('csv/main.csv')
        .pipe(csv())
        .on('data', function (data) {
            console.log(data);
        })
        .on('end', function (data) {
            console.log('Read finished');
        });
        
};

// =====================  READ END HERE  =======================

/*
|----------------------------------------------------------------------------
| LIST ALL THE DATA OF MAIN.CSV FILE
|----------------------------------------------------------------------------
*/
var getAll = () => {
    return fetchData();
}
// ==================  LIST END HERE  =================

/*
|----------------------------------------------------------------------------
| FILTER DATA ACCORDING TO COUNTRY AND THEN TWO LOWEST PRICE FOR EACH SKU
|----------------------------------------------------------------------------
*/
var filterCountry_Price = (country) => {
    const csvFilePath = 'csv/main.csv';

    var filteredCountry = [];
    var filterSKUGroup = [];
    var array = [];

    var columns = ["SKU", "DESCRIPTION", "YEAR", "CAPACITY", "URL", "PRICE", "SELLER_INFORMATION", "OFFER_DESCRIPTION", "COUNTRY"];

    var col = ["SKU", "FIRST_MINIMUM_PRICE", "SECOND_MINIMUM_PRICE"];

    // Convert csv file to json
    csvjson()
        .fromFile(csvFilePath)
        .then((jsonObj) => {

            console.log('total: ' + jsonObj.length); // array of objects
            // console.log(typeof jsonObj); // object

            filteredCountry = jsonObj.filter((columns) => {
                return columns.COUNTRY.includes(country);

            });

            for (let i = 0; i < filteredCountry.length; i++) {

                // Removing special char from PRICE and convert to Number
                if (filteredCountry[i].PRICE.startsWith('$')) {
                    filteredCountry[i].PRICE = parseFloat(filteredCountry[i].PRICE.split('$')[1]);
                } else if (filteredCountry[i].PRICE.endsWith('?') || filteredCountry[i].PRICE.includes(',')) {
                    filteredCountry[i].PRICE = parseFloat(filteredCountry[i].PRICE.replace(/,/g, ''));
                }
                // console.log(filteredCountry[i]);

            }
            console.log('Total Items Found: ' + filteredCountry.length);
            console.log(typeof filteredCountry);

            // =============  WRITING TO filteredCountry.CSV  =======

            // writing file headers
            csv.
            write([columns], {
                    headers: true
                })
                .pipe(ws);

            // writing the data/entries to the file
            (async () => {
                let csv = new ObjectsToCsv(filteredCountry);

                // Save to file:
                await csv.toDisk('csv/filteredCountry.csv');

                // Return the CSV file as string:
                // console.log(await csv.toString());
            })();
            // =============  WRITING END HERE =======

            //============ writing data into lowestPrice.csv file ==============
            // writing headers
            csv.
            write([col], {
                    headers: true
                })
                .pipe(writeLowestPrice);

            // MAke group of SKU Values
            array = filteredCountry;
            const property = "SKU";
            filterSKUGroup = _.groupBy(array, property);
            console.log((filterSKUGroup)); // display group of arrays
            console.log('Total Groups Formed =' + Object.keys(filterSKUGroup).length);
            // console.log(Object.keys(filterSKUGroup));  // Print all the SKU NUMBER

            let priceList = [];
            let uniquePrice = [];
            let min1 = [];
            let min2 = [];

            let i, j, k;
            k = 0;
            for (i = 0; i < Object.keys(filterSKUGroup).length; i++) {
                for (j = 0; j < (Object.entries(filterSKUGroup)[i][1].length); j++) {
                    priceList[j] = Object.entries(filterSKUGroup)[i][1][j].PRICE;
                }

                // console.log(' ***************  For Group ' + (i + 1) + ' Prices are :  ************* ');
                priceList.sort((a, b) => {
                    return (a - b); // sort in ascending order
                });
                uniquePrice = _.uniq(priceList);


                if (uniquePrice.length == 1) {
                    min1[i] = uniquePrice[0];
                    min2[k] = "ONLY SINGLE PRICE IS THERE";
                } else {
                    min1[i] = uniquePrice[0];
                    min2[k] = uniquePrice[1];
                }

                // writing actual data into lowestPrice.csv file
                csv.
                write([
                        [],
                        [Object.entries(filterSKUGroup)[i][1][0].SKU, min1[i], min2[k]],
                    ])
                    .pipe(writeLowestPrice);
            }
        });
};

// ===================  FILTER END HERE  ======================

module.exports = {
    fetchData,
    getAll,
    filterCountry_Price
};