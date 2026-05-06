import https from 'https';
import fs from 'fs';

const options = {
  hostname: 'nominatim.openstreetmap.org',
  path: '/search?state=Ibaraki&country=Japan&format=json&polygon_geojson=1',
  headers: {
    'User-Agent': 'IbarakiDiscoveryApp/1.0 (contact: your-email@example.com)'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    try {
      const results = JSON.parse(data);
      if (results.length > 0) {
        const ibaraki = results[0];
        const geojson = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: {
                name: "Ibaraki Prefecture"
              },
              geometry: ibaraki.geojson
            }
          ]
        };
        fs.writeFileSync('src/data/ibaraki-boundary.json', JSON.stringify(geojson, null, 2));
        console.log('Boundary downloaded and saved successfully.');
      } else {
        console.error('No results found.');
      }
    } catch (err) {
      console.error('Error parsing JSON:', err);
    }
  });
}).on('error', (err) => {
  console.error('Error fetching data:', err.message);
});
