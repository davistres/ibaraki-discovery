import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, GeoJSON } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { usePlaces } from '../hooks/usePlaces';
import { useFestivals } from '../hooks/useFestivals';
import { MapPin, Calendar } from 'lucide-react';
import { useTranslation } from '../contexts/LanguageContext';
import ibarakiBoundary from '../data/ibaraki-boundary.json';

// Correction pour les icônes Leaflet par défaut dans React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const placeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const festivalIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const InteractiveMap = () => {
  const { places } = usePlaces();
  const { festivals } = useFestivals();
  const { t, language } = useTranslation();

  // Position par défaut : centre d'Ibaraki
  const center = [36.3418, 140.4468]; // Mito environ
  const zoom = 9;

  const getImagePath = (imageName) => {
    return `${import.meta.env.BASE_URL}Photo/${imageName}`;
  };

  const validPlaces = places.filter(
    p => p.coordonnees && p.coordonnees.lat !== 0 && p.coordonnees.lng !== 0
  );

  // Pour les festivals, s'ils n'ont pas de coordonnées exactes (0, 0),
  // on utilise les coordonnées d'un lieu situé dans la même ville, avec un léger décalage
  // pour éviter que les pins ne se superposent parfaitement.
  const festivalsWithCoords = festivals.map((f, index) => {
    if (f.coordonnees && f.coordonnees.lat !== 0 && f.coordonnees.lng !== 0) {
      return f;
    }
    
    const placeInCity = validPlaces.find(p => p.ville_id === f.ville_id);
    if (placeInCity) {
      // Décalage pour ne pas masquer le lieu existant ni les autres festivals
      const offsetLat = 0.008 + (index % 4) * 0.003;
      const offsetLng = 0.008 - (index % 3) * 0.003;
      
      return {
        ...f,
        coordonnees: {
          lat: placeInCity.coordonnees.lat + offsetLat,
          lng: placeInCity.coordonnees.lng + offsetLng
        }
      };
    }
    return null;
  }).filter(Boolean);

  return (
    <div className="h-[700px] w-full rounded-xl overflow-hidden shadow-lg border border-gray-200 z-0 relative">
      <MapContainer center={center} zoom={zoom} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <GeoJSON 
          data={ibarakiBoundary} 
          style={{
            color: '#ef4444', // Tailwind red-500
            weight: 3,
            opacity: 0.8,
            fillColor: '#ef4444',
            fillOpacity: 0.05,
            dashArray: '5, 10'
          }}
        />

        {validPlaces.map(place => (
          <Marker
            key={`place-${place.id}`}
            position={[place.coordonnees.lat, place.coordonnees.lng]}
            icon={placeIcon}
          >
            <Popup>
              <div className="w-48 text-center pb-1">
                {place.imagePrincipale && (
                  <img
                    src={getImagePath(place.imagePrincipale)}
                    alt={place.nom}
                    className="w-full h-28 object-cover rounded mb-2"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Ibaraki';
                    }}
                  />
                )}
                <h3 className="font-bold text-gray-900 mb-1 leading-tight">{place.nom}</h3>
                <div className="flex items-center justify-center text-xs text-gray-500 mb-2">
                  <MapPin className="w-3 h-3 mr-1 text-red-500" />
                  <span>{place.ville?.nom || 'Ibaraki'}</span>
                </div>
                <Link
                  to={`/lieu/${place.id}`}
                  className="inline-block w-full text-center bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded transition-colors"
                >
                  {t('home.explore')}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        {festivalsWithCoords.map(festival => (
          <Marker
            key={`festival-${festival.id}`}
            position={[festival.coordonnees.lat, festival.coordonnees.lng]}
            icon={festivalIcon}
          >
            <Popup>
              <div className="w-48 text-center pb-1">
                {festival.image && (
                  <img
                    src={getImagePath(festival.image)}
                    alt={festival.nom}
                    className="w-full h-28 object-cover rounded mb-2"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x300?text=Festival';
                    }}
                  />
                )}
                <h3 className="font-bold text-gray-900 mb-1 leading-tight">{festival.nom}</h3>
                <div className="flex items-center justify-center text-xs text-orange-500 mb-2 font-medium">
                  <Calendar className="w-3 h-3 mr-1" />
                  <span>{festival.periode}</span>
                </div>
                <Link
                  to="/festivals"
                  className="inline-block w-full text-center bg-orange-500 hover:bg-orange-600 text-white text-xs font-semibold py-1.5 rounded transition-colors"
                >
                  {t('header.festivals')}
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
