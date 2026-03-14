import { useState, useEffect } from 'react';
import { useTranslation } from '../contexts/LanguageContext';
import categoriesData from '../data/categories.json';

// Helper pour localiser une catégorie
function localizeCategory(cat, lang) {
    if (!cat || lang === 'fr') return cat;
    return { ...cat, nom: cat[`nom_${lang}`] || cat.nom };
}

export function useCategories() {
    const { language } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        try {
            const localized = categoriesData.map(c => localizeCategory(c, language));
            setCategories(localized);
        } catch (err) {
            console.error('useCategories error:', err);
        } finally {
            setLoading(false);
        }
    }, [language]);

    return { categories, loading };
}
