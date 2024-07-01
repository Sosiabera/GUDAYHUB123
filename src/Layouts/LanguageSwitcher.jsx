import React from 'react';
import { useTranslation } from 'react-i18next';
import { CiGlobe } from "react-icons/ci";
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  //const { t } = useTranslation();

  const changeLanguage = (lng) => {
    console.log(`Attempting to change language to ${lng}`);
    i18n.changeLanguage(lng)
      .then(() => {
        console.log(`Language changed to ${lng}`);
        localStorage.setItem('i18nextLng', lng);
      })
      .catch((error) => {
        console.error('Failed to change language', error);
      });
  };

  const handleLanguageChange = (e) => {
    const selectedLanguage = e.target.value;
    changeLanguage(selectedLanguage);
  };

  return (
    <div className="lng">
      <select onChange={handleLanguageChange} defaultValue={i18n.language}>
        <option value="en">English</option>
        <option value="am">አማርኛ</option>
        <option value="ao">Afan Oromoo</option>
      </select>
    </div>
  );
};

export default LanguageSwitcher;
