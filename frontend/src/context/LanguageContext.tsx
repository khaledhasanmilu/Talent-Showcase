import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, Translations, translations } from '../utils/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  toggleLanguage: () => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('talent_app_lang');
    return (saved === 'bn' || saved === 'en') ? saved : 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('talent_app_lang', lang);
  };

  const toggleLanguage = () => {
    const nextLang: Language = language === 'en' ? 'bn' : 'en';
    setLanguage(nextLang);
  };

  useEffect(() => {
    if (language === 'bn') {
      document.body.classList.add('lang-bn');
      document.documentElement.lang = 'bn';
    } else {
      document.body.classList.remove('lang-bn');
      document.documentElement.lang = 'en';
    }
  }, [language]);

  const value: LanguageContextType = {
    language,
    setLanguage,
    t: translations[language],
    toggleLanguage
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
