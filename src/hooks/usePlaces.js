import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '../contexts/LanguageContext';

const API_BASE = 'http://localhost:3001';

export function usePlaces() {
    const { language } = useTranslation();
    const [places, setPlaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPlaces = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/api/places?lang=${language}`);
            if (!res.ok) throw new Error('Failed to fetch places');
            const data = await res.json();
            setPlaces(data);
        } catch (err) {
            console.error('usePlaces error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [language]);

    useEffect(() => {
        fetchPlaces();
    }, [fetchPlaces]);

    return { places, loading, error, refetch: fetchPlaces };
}

export function usePlace(id) {
    const { language } = useTranslation();
    const [place, setPlace] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        setError(null);
        fetch(`${API_BASE}/api/places/${id}?lang=${language}`)
            .then(res => {
                if (!res.ok) throw new Error('Place not found');
                return res.json();
            })
            .then(data => setPlace(data))
            .catch(err => {
                console.error('usePlace error:', err);
                setError(err.message);
            })
            .finally(() => setLoading(false));
    }, [id, language]);

    return { place, loading, error };
}
