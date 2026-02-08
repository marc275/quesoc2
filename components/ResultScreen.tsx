import React, { useEffect } from 'react';
import { Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface ResultScreenProps {
  lang: Language;
  score: number;
  onRestart: () => void;
}

const ResultScreen: React.FC<ResultScreenProps> = ({ lang, score, onRestart }) => {
  const t = TRANSLATIONS[lang];
  
  const clickSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850892/Boto_play_gvndvk.mp3';
  const finalWinSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850893/he_guanyat_ti8unn.mp3';
  const finalLoseSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850891/he_perdut_final_pgsq2f.mp3';

  useEffect(() => {
    let audioToPlay: HTMLAudioElement | null = null;

    // Lògica actualitzada segons les peticions de l'usuari:
    if (score > 3) {
      // Guanyar: més de 3 (4 o 5 encerts)
      audioToPlay = new Audio(finalWinSoundUrl);
    } else if (score <= 2) {
      // Perdre: 2/5 o menor (0, 1 o 2 encerts)
      audioToPlay = new Audio(finalLoseSoundUrl);
    }

    if (audioToPlay) {
      audioToPlay.play().catch(err => console.error("Error playing final result sound:", err));
    }
  }, [score]);

  const handleRestart = () => {
    const audio = new Audio(clickSoundUrl);
    audio.play().catch(err => console.error("Error playing click sound:", err));
    onRestart();
  };
  
  // Obtenir el missatge basat en la puntuació, amb fallback de seguretat
  const displayMessage = t.resultMessages[score as keyof typeof t.resultMessages] || t.resultMessages[0];

  return (
    <div className="relative w-full h-full bg-white flex flex-col items-center justify-center overflow-hidden font-sans">
      {/* Confetti Background Mockup */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        {[...Array(30)].map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-sm animate-float"
            style={{
              width: Math.random() * 15 + 5 + 'px',
              height: Math.random() * 15 + 5 + 'px',
              backgroundColor: ['#E89C31', '#4FD1C5', '#F687B3', '#F6AD55', '#BEE3F8'][Math.floor(Math.random() * 5)],
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              transform: `rotate(${Math.random() * 360}deg)`,
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 3 + 3) + 's' 
            }}
          />
        ))}
        {/* Serpentine Confetti */}
        {[...Array(10)].map((_, i) => (
          <svg 
            key={`serp-${i}`}
            className="absolute animate-float-complex"
            style={{
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
              animationDuration: (Math.random() * 6 + 6) + 's' 
            }}
            width="30" height="50" viewBox="0 0 30 50"
          >
            <path 
              d="M15,0 C25,10 5,20 15,30 C25,40 5,50 15,60" 
              fill="none" 
              stroke={['#E89C31', '#4FD1C5', '#F687B3'][Math.floor(Math.random() * 3)]} 
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 max-w-3xl px-12">
        {/* Score Display */}
        <div className="text-[140px] md:text-[180px] font-black text-[#E89C31] leading-none tracking-tighter drop-shadow-sm">
          {score}/5
        </div>

        {/* Message - Letra entendible, clara y con ánimos */}
        <div className="min-h-[120px] flex items-center justify-center">
          <p className="text-3xl md:text-4xl font-bold text-gray-800 text-center leading-[1.3] max-w-2xl balance">
            {displayMessage}
          </p>
        </div>

        {/* Play Button */}
        <button 
          onClick={handleRestart}
          className="mt-6 w-[220px] h-[85px] bg-[#EFAC4F] rounded-[45px] shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group"
          aria-label={t.playAgain}
        >
          <svg className="w-14 h-14 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none">
            <path 
              d="M6 4V20L20 12L6 4Z" 
              fill="white" 
              stroke="white" 
              strokeWidth="2.5" 
              strokeLinejoin="round" 
            />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) rotate(0); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes float-complex {
          0% { transform: translateY(0) translateX(0) rotate(0); opacity: 1; }
          50% { transform: translateY(-50vh) translateX(20px) rotate(180deg); }
          100% { transform: translateY(-100vh) translateX(0) rotate(360deg); opacity: 0; }
        }
        .animate-float {
          animation: float linear infinite;
        }
        .animate-float-complex {
          animation: float-complex linear infinite;
        }
        .balance {
          text-wrap: balance;
        }
      `}</style>
    </div>
  );
};

export default ResultScreen;