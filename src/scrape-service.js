const request = require('request');
const cheerio = require('cheerio')

const ScrapeService = {


getData(){
    request('https://www.worldometers.info/coronavirus/' , (error, response, html) => { 
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html)

        let totalCases = $('.maincounter-number').text();
        console.log(totalCases)

        let values = totalCases.trim().split(' ');
        values = values.filter(el => {
            return el != '';
        })
        const cases = values[0];
        const deaths = values[1];
        const recovered = values[2]

       
        return cases;
       // [{cases : cases , deaths : deaths, recovered : recovered} ];
    }


})
return deaths;
}
}

module.exports = ScrapeService;