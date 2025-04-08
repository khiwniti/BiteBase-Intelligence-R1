import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('en')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'en' ? 'bg-primary text-white' : 'bg-gray-200'
        }`}
      >
        EN
      </button>
      <button
        onClick={() => changeLanguage('th')}
        className={`px-2 py-1 rounded ${
          i18n.language === 'th' ? 'bg-primary text-white' : 'bg-gray-200'
        }`}
      >
        TH
      </button>
    </div>
  );
};

export default LanguageSwitcher; 