import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import placesData from '../data/places.json';
import categoriesData from '../data/categories.json';

// Helper pour localiser un lieu
function localizePlace(place, lang) {
    if (lang === 'fr') return place;
    
    return {
        ...place,
        nom: place[`nom_${lang}`] || place.nom,
        description: place[`description_${lang}`] || place.description,
        descriptionLongue: place[`descriptionLongue_${lang}`] || place.descriptionLongue,
        adresse: place[`adresse_${lang}`] || place.adresse,
        acces: place[`acces_${lang}`] || place.acces,
        horaires: place[`horaires_${lang}`] || place.horaires,
        tarif: place[`tarif_${lang}`] || place.tarif,
        dureeVisite: place[`dureeVisite_${lang}`] || place.dureeVisite,
    };
}

// Helper pour localiser une catégorie
function localizeCategory(cat, lang) {
    if (!cat || lang === 'fr') return cat;
    return { ...cat, nom: cat[`nom_${lang}`] || cat.nom };
}

export function usePlaces() {
    const { language } = useTranslation();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        try {
            // Simulation d'un chargement asynchrone pour garder la structure existante si besoin
            const localized = placesData.map(p => {
                const loc = localizePlace(p, language);
                
                // Joindre les données de catégories, ville, région, accessibilité
                const region = categoriesData.find(c => c.id === p.region_id);
                const ville = categoriesData.find(c => c.id === p.ville_id);
                const accessibilite = categoriesData.find(c => c.id === p.accessibilite_id);
                const categories = (p.category_ids || []).map(cid => categoriesData.find(c => c.id === cid)).filter(Boolean);

                return {
                    ...loc,
                    region: localizeCategory(region, language),
                    ville: localizeCategory(ville, language),
                    accessibilite: localizeCategory(accessibilite, language),
                    categories: categories.map(c => localizeCategory(c, language)),
                };
            });
            setPlaces(localized);
        } catch (err) {
            console.error('usePlaces error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    return { places, loading, error, refetch: () => {} };
}

export function usePlace(id) {
    const { language } = useTranslation();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        try {
            const p = placesData.find(item => item.id === id);
            if (!p) throw new Error('Place not found');
            
            const loc = localizePlace(p, language);
            
            const region = categoriesData.find(c => c.id === p.region_id);
            const ville = categoriesData.find(c => c.id === p.ville_id);
            const accessibilite = categoriesData.find(c => c.id === p.accessibilite_id);
            const categories = (p.category_ids || []).map(cid => categoriesData.find(c => c.id === cid)).filter(Boolean);

            setPlace({
                ...loc,
                region: localizeCategory(region, language),
                ville: localizeCategory(ville, language),
                accessibilite: localizeCategory(accessibilite, language),
                categories: categories.map(c => localizeCategory(c, language)),
            });
        } catch (err) {
            console.error('usePlace error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id, language]);

    return { place, loading, error };
}
