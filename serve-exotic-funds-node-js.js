const express = require('express');
const request = require('request');
const cheerio = require('cheerio');

const app = express();

const port = process.env.PORT || 3000;

const server = app.listen(port);

server.timeout = 1000 * 60 * 10; // 10 minutes

// Use middleware to set the default Content-Type
app.use(function (req, res, next) {
    res.header('Content-Type', 'application/json');
    next();
});

app.get('/', (req, res) => {
     //http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F000002QT3 
       //http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000QTMH	
        //request('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000QTMH', (err, legalBody, schroderBody) => {
	request('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000QTMH', (err, legalRes, legalBody) => {
	if (err) { return console.log(err); }
        const $ = cheerio.load(legalBody);
        const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
        const legalPriceInPounds = parseFloat($(selector).text().replace("GBX","").trim());
        request('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F0GBR06XQ5', (err, goldRes, goldBody) => {
            if (err) { return console.log(err); }
            const $ = cheerio.load(goldBody);
            const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
            const goldPriceInPences = $(selector).text().replace("GBX","").trim();
            const goldPriceInPounds = parseFloat(goldPriceInPences / 100);
                
            const fundsPrices = {};

            fundsPrices.Legal_and_General_US_Index_Trust_C_Class = legalPriceInPounds;
            fundsPrices.Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP = goldPriceInPounds;

            res.send(JSON.stringify(fundsPrices));
        });
    });
})
