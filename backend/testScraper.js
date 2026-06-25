const puppeteer = require('puppeteer');
const cheerio = require('cheerio');

async function testVzlaTeBusca() {
    try {
        const url = 'https://venezuela-te-busca-app.hellogafaro.workers.dev/?query=';
        console.log('Fetching with fetch:', url);
        const response = await fetch(url);
        const html = await response.text();
        console.log('Fetch returned length:', html.length);
        console.log('HTML snippet:', html.substring(0, 500));
        
        const $ = cheerio.load(html);
        console.log('Items found with Cheerio in body:', $('body').text().substring(0, 500));
        
    } catch (e) {
        console.error(e);
    }
}

testVzlaTeBusca();
