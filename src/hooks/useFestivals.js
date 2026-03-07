import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001';

export function useFestivals() {
    const { language } = useTranslation();
    const [festivals, setFestivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFestivals = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/festivals?lang=${language}`);
            if (!res.ok) throw new Error('Failed to fetch festivals');
            const data = await res.json();
            setFestivals(data);
        } catch (err) {
            console.error('useFestivals error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchFestivals();
    }, [fetchFestivals]);

    return { festivals, loading, error, refetch: fetchFestivals };
}
