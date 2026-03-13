import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001';

export function useCategories() {
    const { language } = useTranslation();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE}/api/categories?lang=${language}`);
            if (!res.ok) throw new Error('Failed to fetch categories');
            const data = await res.json();
            setCategories(data);
        } catch (err) {
            console.error('useCategories error:', err);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    return { categories, loading };
}
