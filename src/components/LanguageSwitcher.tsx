import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const languages = [
  { code: 'ar', label: 'العربية' },
  { code: 'en', label: 'English' },
  { code: 'tr', label: 'Türkçe' }
].sort((a, b) => a.label.localeCompare(b.label));

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [lang, setLang] = useState(i18n.language);

  const handleChange = (value: string) => {
    setLang(value);
    i18n.changeLanguage(value);
    localStorage.setItem('lang', value);
  };

  return (
    <Select value={lang} onValueChange={handleChange}>
      <SelectTrigger className="w-32">
        <SelectValue>{languages.find(l => l.code === lang)?.label || lang}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {languages.map(l => (
          <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}