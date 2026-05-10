const fs = require('fs');

const ccContent = fs.readFileSync('Photo/CC.txt', 'utf16le');
const lines = ccContent.split('\n');
const attrMap = {};

for (const line of lines) {
  const parts = line.split('\t');
  if (parts.length >= 2) {
    attrMap[parts[0].trim()] = parts[1].trim();
  }
}

const places = JSON.parse(fs.readFileSync('src/data/places.json', 'utf8'));
const files = fs.readdirSync('Photo');

const matchRules = {
  'Aqua World Ibaraki Prefectural Oarai Aquarium': 'oarai-aquarium',
  'Colline des arts de Kasama': 'colline-arts-kasama',
  'Côte rocheuse de KitaIbaraki': 'cote-rocheuse-kitaibaraki',
  'Daigo, Ibaraki, Japan.jpg': 'daigo', // Daigo is not a place ID, but there is Fukuroda... wait! Let's check place IDs.
  'Gorge de Hananuki': 'gorge-hananuki',
  'Gorges de la rivière Kuji': 'gorges-kuji',
  'Kairaku-en': 'kairaku-en',
  'Marais de Watarase': 'marais-watarase',
  'Mont Tsukuba': 'mont-tsukuba',
  'Musée d\'Art Céramique': 'musee-art-ceramique-ibaraki',
  'Musée des sciences du centre civique': 'musee-sciences-hitachi',
  'Parc Kasama no Mori': 'colline-arts-kasama', 
  'Plage de Takado Kohama': 'plage-takado-kohama',
  'Pont suspendu de Ryujin': 'pont-suspendu-ryujin',
  'Sanctuaire Oiwa': 'sanctuaire-oiwa',
  'Temple Amabiki Kannon': 'temple-amabiki-kannon',
  'Tissage de Yuki-tsumugi': 'yuki-tsumugi',
  'Ville d\'Itako et ses canaux': 'itako-canaux',
  'Ville de Koga et son patrimoine': 'koga-ville-musee',
};

function extractUrl(text) {
  const match = text.match(/https?:\/\/[^\s<>"]+/);
  if (match) {
    let url = match[0];
    if (url.endsWith('>')) url = url.slice(0, -1);
    return url;
  }
  return null;
}

function processMedia(mediaString) {
  if (!mediaString.includes('CC')) {
    return { type: 'image', url: mediaString };
  }

  const baseName = mediaString.replace(/\.[^/.]+$/, ""); // remove extension
  let attr = attrMap[baseName] || attrMap[mediaString];
  
  if (!attr) {
    console.warn(`WARNING: Missing attribution for ${mediaString}`);
    return { type: 'image', url: mediaString }; // fallback
  }

  const attrLower = attr.toLowerCase();
  
  if (attrLower.includes('youtube.com') || attrLower.includes('youtu.be')) {
    const url = extractUrl(attr);
    let videoId = '';
    if (url) {
      try {
        const urlObj = new URL(url);
        videoId = urlObj.searchParams.get('v') || '';
      } catch (e) {
         const match = url.match(/v=([^&]+)/);
         if (match) videoId = match[1];
      }
    }
    return {
      type: 'youtube',
      url: videoId ? `https://www.youtube.com/embed/${videoId}` : url,
      attribution: attr
    };
  } else if (attrLower.includes('site') || attrLower.includes('http')) {
    if (attrLower.includes('wikimedia')) {
      return {
        type: 'wikimedia',
        url: mediaString,
        attribution: attr
      };
    } else {
      const url = extractUrl(attr);
      return {
        type: 'iframe',
        url: url || '',
        attribution: attr
      };
    }
  }

  return {
    type: 'wikimedia',
    url: mediaString,
    attribution: attr
  };
}

const placeMediaMap = {};

for (const file of files) {
  if (file === 'CC.txt' || file === 'CC.xlsx') continue;
  
  let matchedPlaceId = null;
  
  for (const [key, id] of Object.entries(matchRules)) {
     if (file.startsWith(key)) {
        matchedPlaceId = id;
        break;
     }
  }

  if (!matchedPlaceId) {
      for (const place of places) {
        if (file.startsWith(place.nom) || 
            file.startsWith(place.nom_en) || 
            (place.nomJaponais && file.startsWith(place.nomJaponais)) ||
            file.startsWith(place.id)) {
           matchedPlaceId = place.id;
           break;
        }
      }
  }

  if (matchedPlaceId) {
     if (!placeMediaMap[matchedPlaceId]) {
         placeMediaMap[matchedPlaceId] = [];
     }
     placeMediaMap[matchedPlaceId].push(file);
  }
}

// Now update places.json
let modifiedCount = 0;

for (let i = 0; i < places.length; i++) {
  const place = places[i];
  const myFiles = placeMediaMap[place.id] || [];
  
  if (myFiles.length > 0) {
     const newImages = myFiles.map(img => processMedia(img));
     
     // Determine imagePrincipale
     let principal = "";
     const pureImages = newImages.filter(img => img.type === 'image');
     if (pureImages.length > 0) {
        principal = pureImages[0].url;
     } else {
        const wikiImages = newImages.filter(img => img.type === 'wikimedia');
        if (wikiImages.length > 0) {
           principal = wikiImages[0].url;
        }
     }
     
     place.images = newImages;
     place.imagePrincipale = principal;
     modifiedCount++;
  }
}

fs.writeFileSync('src/data/places.json', JSON.stringify(places, null, 2), 'utf8');
console.log(`Done. Updated ${modifiedCount} places with their respective media.`);
