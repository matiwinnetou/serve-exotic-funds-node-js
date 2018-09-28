const express = require('express');
const request = require('request');
const rp = require('request-promise');
const cheerio = require('cheerio');

const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port);

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function(req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {

const p1 = rp('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000QTMH').then(function(htmlString) {
    const $ = cheerio.load(htmlString);
    const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
    const legalPriceInPounds = parseFloat($(selector).text().replace("GBX", "").trim());

    return legalPriceInPounds;
}).catch(function(err) {
    console.log("Unexpected error:" + err);
});

const p2 = rp('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F0GBR06XQ5').then(function(htmlString) {
    const $ = cheerio.load(htmlString);
    const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
    const goldPriceInPences = parseFloat($(selector).text().replace("GBX", "").trim());
    const goldPriceInPounds = goldPriceInPences / 100;

    return goldPriceInPounds;
}).catch(function(err) {
    console.log("Unexpected error:" + err);
});

const promises = [p1, p2];

Promise.all(promises)
    .then(data => {
        const fundsPrices = {};
        fundsPrices.Legal_and_General_US_Index_Trust_C_Class = data[0];
        fundsPrices.Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP = data[1];

        res.send(JSON.stringify(fundsPrices));
    });
});
