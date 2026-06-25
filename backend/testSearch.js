const cheerio = require('cheerio');

async function test(query) {
    try {
        console.log(`\n--- Searching for: ${query} ---`);
        
        // 1. Venezuela Te Busca
        const res1 = await fetch(`https://venezuela-te-busca-app.hellogafaro.workers.dev/?query=${query}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        const text1 = await res1.text();
        console.log('\n[Venezuela Te Busca]');
        try {
            const data = JSON.parse(text1);
            console.log('Returned JSON array of length:', data.length);
            if(data.length > 0) console.log('Sample:', data[0]);
        } catch(e) {
            console.log('Returned HTML snippet:', text1.substring(0, 150).replace(/\n/g, ' '));
        }
        
        // 2. Venezuela Reporta
        const res2 = await fetch(`https://venezuelareporta.org/buscar?q=${query}`);
        const text2 = await res2.text();
        const $ = cheerio.load(text2);
        const names = [];
        $('a.card').each((i, el) => {
            names.push($(el).find('h3').text().trim());
        });
        console.log('\n[Venezuela Reporta]');
        console.log(`Found ${names.length} cards:`, names.slice(0, 5));
    } catch(e) {
        console.error(e);
    }
}

test('carlos');
