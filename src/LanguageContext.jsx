import { createContext, useContext, useState } from "react";
import { t } from "./i18n";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("English");
  return (
    <LanguageContext.Provider value={{ lang, setLang, t: (k) => t(lang, k) }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
