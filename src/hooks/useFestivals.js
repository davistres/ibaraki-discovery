import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import festivalsData from '../data/festivals.json';
import categoriesData from '../data/categories.json';

// Helper pour localiser un festival
function localizeFestival(festival, lang) {
    if (lang === 'fr') return festival;

    return {
        ...festival,
        nom: festival[`nom_${lang}`] || festival.nom,
        description: festival[`description_${lang}`] || festival.description,
        lieu: festival[`lieu_${lang}`] || festival.lieu,
        periode: festival[`periode_${lang}`] || festival.periode,
        mois: festival[`mois_${lang}`] || festival.mois,
        activites: festival[`activites_${lang}`] || festival.activites,
    };
}

// Helper pour localiser une catégorie
function localizeCategory(cat, lang) {
    if (!cat || lang === 'fr') return cat;
    return { ...cat, nom: cat[`nom_${lang}`] || cat.nom };
}

export function useFestivals() {
    const { language } = useTranslation();
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        try {
            const localized = festivalsData.map(f => {
                const loc = localizeFestival(f, language);
                
                // Joindre les données de catégories, ville, région
                const region = categoriesData.find(c => c.id === f.region_id);
                const ville = categoriesData.find(c => c.id === f.ville_id);
                const categories = (f.category_ids || []).map(cid => categoriesData.find(c => c.id === cid)).filter(Boolean);

                return {
                    ...loc,
                    region: localizeCategory(region, language),
                    ville: localizeCategory(ville, language),
                    categories: categories.map(c => localizeCategory(c, language)),
                };
            });
            setFestivals(localized);
        } catch (err) {
            console.error('useFestivals error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    return { festivals, loading, error, refetch: () => {} };
}
