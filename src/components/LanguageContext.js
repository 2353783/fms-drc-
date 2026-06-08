'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import fr from '../locales/fr.json';
import en from '../locales/en.json';
import zh from '../locales/zh.json';
import es from '../locales/es.json';

const translations = { fr, en, zh, es };

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [locale, setLocale] = useState('fr');

    useEffect(() => {
        const savedLocale = localStorage.getItem('locale');
        if (savedLocale && translations[savedLocale]) {
            setLocale(savedLocale);
        }
    }, []);

    const changeLocale = (newLocale) => {
        if (translations[newLocale]) {
            setLocale(newLocale);
            localStorage.setItem('locale', newLocale);
        }
    };

    const t = (key) => {
        const keys = key.split('.');
        let value = translations[locale];
        for (const k of keys) {
            value = value?.[k];
        }
        return value || key;
    };

    const getLocalizedContent = (content) => {
        if (typeof content === 'object' && content !== null) {
            return content[locale] || content.fr || content.en || '';
        }
        return content;
    };

    return (
        <LanguageContext.Provider value={{ locale, changeLocale, t, getLocalizedContent }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
