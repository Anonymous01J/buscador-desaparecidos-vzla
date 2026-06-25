const puppeteer = require('puppeteer');

(async () => {
  try {
    console.log('Launching browser...');
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    console.log('Navigating...');
    await page.goto('https://venezuela-te-busca-app.hellogafaro.workers.dev/?query=', { waitUntil: 'networkidle2' });
    const content = await page.content();
    console.log('Content length:', content.length);
    console.log(content.substring(0, 1000));
    
    // Check if there are specific items we can extract
    const items = await page.evaluate(() => {
       return document.body.innerText.substring(0, 500);
    });
    console.log('Inner text preview:', items);
    
    await browser.close();
    console.log('Browser closed.');
  } catch (e) {
    console.error(e);
  }
})();
