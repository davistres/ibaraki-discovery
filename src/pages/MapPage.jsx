import { useTranslation } from '../contexts/LanguageContext';
import { Map } from 'lucide-react';
import InteractiveMap from '../components/InteractiveMap';

const MapPage = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="flex justify-center mb-4">
            <Map className="w-16 h-16" />
          </div>
          <h1 className="font-display font-bold text-5xl mb-4">
            {t('mapPage.title')}
          </h1>
          <p className="text-xl text-red-100 max-w-2xl mx-auto">
            {t('mapPage.subtitle')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-700 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" alt="Lieu" className="w-4 h-6 mr-2" />
            <span>Lieux à visiter</span>
          </div>
          <div className="flex items-center">
            <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png" alt="Festival" className="w-4 h-6 mr-2" />
            <span>Festivals</span>
          </div>
        </div>
        
        <InteractiveMap />
      </div>
    </div>
  );
};

export default MapPage;
