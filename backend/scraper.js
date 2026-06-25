const cheerio = require('cheerio');

async function searchVenezuelaReporta(query) {
    if (!query) return [];
    console.log(`Searching venezuelareporta.org for: ${query}`);
    try {
        const response = await fetch(`https://venezuelareporta.org/buscar?q=${encodeURIComponent(query)}`);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const people = [];
        $('a.card').each((i, el) => {
            const card = $(el);
            const name = card.find('h3').text().trim();
            const photo = card.find('img').attr('src');
            let status = card.find('.chip').text().trim() || 'Se busca';
            
            if (name) {
                people.push({
                    id: `vr-${name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
                    name,
                    photo,
                    status,
                    source: 'venezuelareporta.org',
                    sourceUrl: 'https://venezuelareporta.org' + (card.attr('href') || ''),
                    updatedAt: new Date().toISOString()
                });
            }
        });
        return people;
    } catch (e) {
        console.error('Error in searchVenezuelaReporta:', e.message);
        return [];
    }
}

async function searchVenezuelaTeBusca(query) {
    if (!query) return [];
    console.log(`Searching venezuela-te-busca-app for: ${query}`);
    try {
        const response = await fetch(`https://venezuela-te-busca-app.hellogafaro.workers.dev/?query=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
            }
        });
        const text = await response.text();
        const $ = cheerio.load(text);
        
        let people = [];
        
        $('div.card, li.person, .perfil, .tarjeta, div[class*="card"], div[class*="item"]').each((i, el) => {
             const name = $(el).find('h2, h3, .nombre, .name, [class*="name"], [class*="nombre"]').first().text().trim();
             let photo = $(el).find('img').attr('src');
             if (photo && photo.startsWith('/')) {
                 photo = 'https://venezuela-te-busca-app.hellogafaro.workers.dev' + photo;
             }
             const status = $(el).find('.estado, .status, .badge, [class*="status"], [class*="estado"]').text().trim() || 'Se busca';
             
             if (name && name.length > 2 && !name.includes('Reporta')) {
                 people.push({
                    id: `vtb-${name.toLowerCase().replace(/\s+/g, '-')}-${i}`,
                    name,
                    photo,
                    status,
                    source: 'venezuela-te-busca',
                    sourceUrl: `https://venezuela-te-busca-app.hellogafaro.workers.dev/?query=${encodeURIComponent(query)}`,
                    updatedAt: new Date().toISOString()
                 });
             }
        });
        
        return people;
    } catch (e) {
        console.error('Error in searchVenezuelaTeBusca:', e.message);
        return [];
    }
}

async function searchDesaparecidosTerremoto(query) {
    if (!query) return [];
    console.log(`Searching desaparecidos-terremoto-api for: ${query}`);
    try {
        const response = await fetch(`https://desaparecidos-terremoto-api.theempire.tech/api/personas?page=1&pageSize=50&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        
        let people = [];
        if (data && data.items && Array.isArray(data.items)) {
            people = data.items.map(item => {
                let statusLabel = item.estado;
                if (item.estado === 'sin-contacto') statusLabel = 'Se busca';
                if (item.estado === 'localizado') statusLabel = 'Encontrado';
                
                return {
                    id: `dt-${item.id}`,
                    name: item.nombre || 'Desconocido',
                    photo: item.foto || null,
                    status: statusLabel,
                    source: 'desaparecidos-terremoto',
                    sourceUrl: `https://desaparecidosterremotovenezuela.com/?persona=${item.id}`,
                    contact: item.contacto || null,
                    updatedAt: new Date().toISOString()
                };
            });
        }
        return people;
    } catch (e) {
        console.error('Error in searchDesaparecidosTerremoto:', e.message);
        return [];
    }
}

async function searchAll(query) {
    if (!query || query.trim() === '') return [];
    
    console.log(`--- Starting real-time search for: "${query}" ---`);
    const [vrPeople, vtbPeople, dtPeople] = await Promise.all([
        searchVenezuelaReporta(query),
        searchVenezuelaTeBusca(query),
        searchDesaparecidosTerremoto(query)
    ]);
    
    const allPeople = [...vrPeople, ...vtbPeople, ...dtPeople];
    
    // De-duplicate by name
    const unique = [];
    const names = new Set();
    
    for (let p of allPeople) {
        const lowerName = p.name.toLowerCase();
        if (!names.has(lowerName)) {
            names.add(lowerName);
            unique.push(p);
        }
    }
    
    console.log(`Search finished. Total unique found: ${unique.length}`);
    return unique;
}

module.exports = {
    searchAll
};
