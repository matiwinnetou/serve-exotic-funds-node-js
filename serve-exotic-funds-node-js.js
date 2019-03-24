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

const morningStar = (ticker) => {
    return rp(`http://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=${ticker}`).then(function(htmlString) {
      const $ = cheerio.load(htmlString);
      const selector = "#overviewQuickstatsDiv > table > tbody > tr:nth-child(2) > td.line.text";
      const price = parseFloat($(selector).text().replace("GBX", "").trim());

      return price;
    }).catch(function(err) {
      console.log("Unexpected error:" + err);
      throw "boom";
    });
}

const szybkoPl = () => {
    return rp("https://ceny.szybko.pl/zachodniopomorskie-Szczecin-ul.-Jagiello%C5%84ska-ceny-mieszkan.html").then(function(htmlString) {
      const $ = cheerio.load(htmlString);
      const selector = "#content > div > div:nth-child(1) > div:nth-child(1) > div > h3 > span.average-price";
      const priceInPln = parseInt($(selector).attr("data-value"));
      
      return priceInPln;
    }).catch(function(err) {
      console.log("Unexpected error:" + err);
      throw "boom";
    });
}

const numbero = (city) => {
  return rp(`https://www.numbeo.com/property-investment/in/${city}`).then(function(htmlString) {
    const $ = cheerio.load(htmlString);
    const selectorCenter = "body > div > table > tbody > tr:nth-child(7) > td.priceValue";
    const selectorOutside = "body > div > table > tbody > tr:nth-child(8) > td.priceValue.tr_highlighted"

    const priceCenterInEur = parseFloat($(selectorCenter).text().replace(",", "").replace("€", "").trim());
    const priceOutsideInEur = parseFloat($(selectorOutside).text().replace(",", "").replace("€", "").trim());

    const pricesObject = {}

    pricesObject.center = priceCenterInEur;
    pricesObject.outside = priceOutsideInEur;

    return pricesObject
  }).catch(function(err) {
    console.log("Unexpected error:" + err);
    throw "boom";
  });
}

const p1 = morningStar("F00000QTMH").then(priceInPence => priceInPence / 100);
const p2 = morningStar("F0GBR06XQ5").then(priceInPence => priceInPence / 100);
const p3 = szybkoPl();
const p4 = numbero("Berlin");

const promises = [p1, p2, p3, p4];

Promise.all(promises)
    .then(data => {
	      //console.log(JSON.stringify(data));
        const prices = {};
        prices.Legal_and_General_US_Index_Trust_C_Class_GBP = data[0];
        prices.Smith_and_Williamson_Global_Gold_and_Resources_Inclusive_Class_A_Income_GBP = data[1];
        prices.Szczecin_Centrum_Jagiellonska_za_m2_PLN = data[2];
        prices.Berlin_Price_Per_SQM_Center_EUR = data[3].center;
        prices.Berlin_Price_Per_SQM_Outside_EUR = data[3].outside;

        res.send(JSON.stringify(prices));
    });
});
