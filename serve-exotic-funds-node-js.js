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
    request('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000T21Q', (err, schroderRes, schroderBody) => {
        if (err) { return console.log(err); }
        const $ = cheerio.load(schroderBody);
        const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
        const schroderPriceInPounds = parseFloat($(selector).text().replace("GBX","").trim());

        request('http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F0GBR06XQ5', (err, goldRes, goldBody) => {
            if (err) { return console.log(err); }
            const $ = cheerio.load(goldBody);
            const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
            const goldPriceInPences = $(selector).text().replace("GBX","").trim();
            const goldPriceInPounds = parseFloat(goldPriceInPences / 100);
                
            const fundsPrices = {};

            fundsPrices.Schroder_Tokyo_Fund_H_Accumulation_GBP = schroderPriceInPounds;
            fundsPrices.Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP = goldPriceInPounds;

            res.send(JSON.stringify(fundsPrices));
        });
    });
})
