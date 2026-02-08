import React from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface HomeScreenProps {
  lang: Language;
  onStart: () => void;
  onToggleLang: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ lang, onStart, onToggleLang }) => {
  const t = TRANSLATIONS[lang];
  const clickSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850892/Boto_play_gvndvk.mp3';

  const playSound = () => {
    const audio = new Audio(clickSoundUrl);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  const handleStart = () => {
    playSound();
    onStart();
  };

  const handleToggleLang = () => {
    playSound();
    onToggleLang();
  };

  return (
    <div className="relative w-full h-full bg-[#fcfcfc] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Blob - Alçada augmentada per reduir el marge superior */}
      <div 
        className="absolute bottom-0 left-0 w-full bg-[#E89C31] rounded-tl-[300px] shadow-lg transition-all duration-700"
        style={{ zIndex: 0, height: 'calc(94% + 10px)' }}
      />

      {/* Botó de tornar (Visual a la Home) - Posició ajustada top-[42px] left-[42px] */}
      <button 
        onClick={playSound}
        className="absolute top-[42px] left-[42px] w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-lg hover:scale-110 transition-transform z-10"
      >
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Contingut Principal - S'ha mantingut el títol en una posició equilibrada */}
      <div className="relative z-10 flex flex-col items-center gap-6 text-center transform -translate-y-6">
        <h1 className="text-white text-8xl font-[800] tracking-tight drop-shadow-md px-4">
          {t.title}
        </h1>
        <p className="text-white text-3xl font-semibold opacity-90 mb-4">
          {t.start}
        </p>
        
        {/* Botó de Play - S'ha ajustat a -translate-y-4 per baixar-lo una mica respecte a la versió anterior */}
        <button 
          onClick={handleStart}
          className="w-[313px] h-[106px] bg-white rounded-[60px] shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-transform transform -translate-y-4"
        >
          <svg className="w-20 h-20 ml-2" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 3V21L21 12L6 3Z" 
              fill="#E89C31" 
              stroke="#E89C31" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
            />
          </svg>
        </button>
      </div>

      {/* Selector d'Idioma - S'ha mogut a la esquerra amb right-20 */}
      <div className="absolute bottom-16 right-20 z-20">
        <button 
          onClick={handleToggleLang}
          className="bg-white p-4 px-7 rounded-[40px] shadow-2xl flex items-center gap-6 hover:bg-gray-50 transition-all active:scale-95 border-2 border-gray-100"
        >
          <div className={`transition-all duration-300 ${lang === Language.SPANISH ? 'opacity-100 scale-[1.35]' : 'opacity-20 grayscale scale-90'}`}>
            <img src="https://flagcdn.com/w80/es.png" className="w-12 h-12 rounded-full object-cover shadow-sm border border-gray-200" alt="ES" />
          </div>
          <div className={`transition-all duration-300 ${lang === Language.CATALAN ? 'opacity-100 scale-[1.35]' : 'opacity-20 grayscale scale-90'}`}>
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm flex flex-col border border-gray-200">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => (
                <div key={i} className={`h-full w-full ${i % 2 === 0 ? 'bg-red-600' : 'bg-yellow-400'}`} />
              ))}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

export default HomeScreen;