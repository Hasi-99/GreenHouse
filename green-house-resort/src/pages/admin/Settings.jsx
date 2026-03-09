import { useAppStore } from '../../store/useAppStore';
import { supabase } from '../../services/supabase';
import { Palette, Moon, Sun, MonitorSmartphone } from 'lucide-react';

export default function Settings() {
  const { theme, setTheme, isDarkMode, toggleDarkMode } = useAppStore();

  const themes = [
    { id: 'theme-classic', name: 'Classic Forest', description: 'Deep greens and warm wood tones.' },
    { id: 'theme-modern', name: 'Modern Minimalist', description: 'Clean whites, soft greens, and grays.' },
    { id: 'theme-luxury', name: 'Luxury Eco-Resort', description: 'Rich teal, elegant beige, and dark accents.' },
  ];

  // Save the theme to Supabase so it persists for all users visiting the site
  const handleThemeChange = async (newTheme) => {
    setTheme(newTheme); // Instantly updates the UI via Zustand store

    // Update the global settings table in the database
    const { error } = await supabase
      .from('settings')
      .update({ active_theme: newTheme })
      .eq('id', 1);

    if (error) {
      console.error("Failed to save theme to database:", error);
    }
  };

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-3xl font-bold text-forest-primary mb-2">Platform Settings</h1>
      <p className="text-forest-text/70 mb-8">Customize the appearance and behavior of your hotel system.</p>

      {/* --- APPEARANCE & THEMING --- */}
      <div className="bg-white dark:bg-forest-bg/50 p-6 rounded-xl shadow-sm border border-forest-secondary/20 mb-8">
        <div className="flex items-center gap-3 mb-6 border-b border-forest-secondary/20 pb-4">
          <Palette className="text-forest-primary" size={24} />
          <h2 className="text-xl font-semibold text-forest-text">Global Theme</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => handleThemeChange(t.id)}
              className={`p-4 rounded-lg border-2 text-left transition-all duration-300 ${
                theme === t.id 
                  ? 'border-forest-primary bg-forest-primary/10 shadow-md' 
                  : 'border-forest-secondary/30 hover:border-forest-primary/50 bg-white'
              }`}
            >
              <h3 className="font-bold text-forest-primary mb-1">{t.name}</h3>
              <p className="text-sm text-forest-text/70">{t.description}</p>
              
              {/* Little visual color preview for the admin */}
              <div className={`mt-3 h-2 w-full rounded-full ${t.id === 'theme-classic' ? 'bg-[#2d5a27]' : t.id === 'theme-modern' ? 'bg-[#4a5d4e]' : 'bg-[#116466]'}`}></div>
            </button>
          ))}
        </div>
      </div>

      {/* --- DARK MODE TOGGLE --- */}
      <div className="bg-white dark:bg-forest-bg/50 p-6 rounded-xl shadow-sm border border-forest-secondary/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isDarkMode ? <Moon className="text-forest-primary" size={24} /> : <Sun className="text-forest-primary" size={24} />}
            <div>
              <h2 className="text-xl font-semibold text-forest-text">Dark Mode</h2>
              <p className="text-sm text-forest-text/70">Toggle the dark mode aesthetic for the dashboard.</p>
            </div>
          </div>
          
          <button 
            onClick={toggleDarkMode}
            className={`w-14 h-8 flex items-center rounded-full p-1 transition-colors duration-300 ${isDarkMode ? 'bg-forest-primary' : 'bg-gray-300'}`}
          >
            <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>
      </div>
    </div>
  );
}