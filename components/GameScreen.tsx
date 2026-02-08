import React, { useState, useEffect } from 'react';
import { Language, GameState } from '../types';
import { TRANSLATIONS } from '../constants';
import { generateNewGame } from '../services/gemini';

interface GameScreenProps {
  lang: Language;
  onBack: () => void;
  onFinish: (score: number) => void;
}

const ConfettiPiece: React.FC<{ delay: number; color: string; duration: number }> = ({ delay, color, duration }) => {
  const size = Math.random() * 8 + 6;
  const xBurst = (Math.random() - 0.5) * 600;
  const yBurst = -(Math.random() * 350 + 250);
  const xDrift = (Math.random() - 0.5) * 400;
  const rotX = Math.random() * 720 + 360;
  const rotY = Math.random() * 720 + 360;
  const rotZ = Math.random() * 360;
  const swaySpeed = Math.random() * 0.8 + 0.4;

  return (
    <div 
      className="absolute top-1/2 left-1/2 animate-confetti-fall opacity-0 pointer-events-none"
      style={{ 
        backgroundColor: color,
        animationDelay: `${delay}ms`,
        animationDuration: `${duration}ms`,
        width: `${size}px`,
        height: `${size * (Math.random() > 0.5 ? 0.7 : 1)}px`,
        borderRadius: Math.random() > 0.8 ? '50%' : '1px',
        zIndex: 100,
        '--x-burst': `${xBurst}px`,
        '--y-burst': `${yBurst}px`,
        '--x-drift': `${xDrift}px`,
        '--rot-x': `${rotX}deg`,
        '--rot-y': `${rotY}deg`,
        '--rot-z': `${rotZ}deg`,
        '--sway-speed': `${swaySpeed}s`,
      } as React.CSSProperties}
    >
      <div className="w-full h-full animate-confetti-flutter" />
    </div>
  );
};

const GameScreen: React.FC<GameScreenProps> = ({ lang, onBack, onFinish }) => {
  const t = TRANSLATIONS[lang];
  const [loading, setLoading] = useState(true);
  const [isRevealed, setIsRevealed] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameState, setGameState] = useState<GameState>({
    currentObject: null,
    clue: null,
    history: [],
    isGameOver: false,
    score: 0,
    round: 0
  });

  const clickSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850892/Boto_play_gvndvk.mp3';
  const cardFlipSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850892/Card_Flip_koef9l.mp3';
  const winSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850891/acertar_carta_kmnm9k.mp3';
  const loseSoundUrl = 'https://res.cloudinary.com/dla44twvf/video/upload/v1768850892/he_perdut_q2ph1c.mp3';

  const playClickSound = () => {
    const audio = new Audio(clickSoundUrl);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  const playCardFlipSound = () => {
    const audio = new Audio(cardFlipSoundUrl);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  const playWinSound = () => {
    const audio = new Audio(winSoundUrl);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  const playLoseSound = () => {
    const audio = new Audio(loseSoundUrl);
    audio.play().catch(err => console.error("Error playing audio:", err));
  };

  const handleBack = () => {
    playClickSound();
    window.location.href = 'https://entrenament.netlify.app/'();
  };

  const getObjectImage = (obj: string | null) => {
    if (!obj) return '';
    const upperObj = obj.toUpperCase();
    
    // Mapeig d'imatges que suporta ambdós idiomes
    if (upperObj === 'BUFANDA') {
      return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768848767/Captura_de_pantalla_2026-01-19_a_les_19.52.35_qichzg.png';
    }
    if (upperObj === 'FLORS' || upperObj === 'FLORES') {
      return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768848632/Captura_de_pantalla_2026-01-19_a_les_19.50.13_jghdij.png';
    }
    if (upperObj === 'ALVOCAT' || upperObj === 'AGUACATE') {
      return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768849043/Captura_de_pantalla_2026-01-19_a_les_19.57.13_fwptvv.png';
    }
    if (upperObj === 'RESPALL DE DENTS' || upperObj === 'CEPILLO DE DIENTES') {
      return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768848845/Captura_de_pantalla_2026-01-19_a_les_19.53.55_uneatf.png';
    }
    if (upperObj === 'PINTA' || upperObj === 'PEINE') {
      return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768847987/Captura_de_pantalla_2026-01-19_a_les_19.39.32_eqcu3t.png';
    }
    
    return 'https://res.cloudinary.com/dla44twvf/image/upload/v1768848767/Captura_de_pantalla_2026-01-19_a_les_19.52.35_qichzg.png';
  };

  const initGame = async (isFirstTime = false, roundToUse?: number, scoreToUse?: number) => {
    setLoading(true);
    setShowHelp(false);
    setShowConfetti(false);
    
    const currentRoundIdx = roundToUse !== undefined ? roundToUse : gameState.round;
    const currentScore = scoreToUse !== undefined ? scoreToUse : gameState.score;

    try {
      const fixedObjects = [
        { 
          ca: 'BUFANDA', 
          es: 'BUFANDA', 
          clue: lang === Language.CATALAN ? "Em portes al coll quan fa fred." : "Me llevas al cuello cuando hace frío." 
        },
        { 
          ca: 'FLORS', 
          es: 'FLORES', 
          clue: lang === Language.CATALAN ? "Som de molts colors i fem molt bona olor." : "Somos de muchos colores y olemos muy bien." 
        },
        { 
          ca: 'ALVOCAT', 
          es: 'AGUACATE', 
          clue: lang === Language.CATALAN ? "Soc verd per dins i tinc un pinyol molt gros." : "Soy verde por dentro y tengo un hueso muy grande." 
        },
        { 
          ca: 'RESPALL DE DENTS', 
          es: 'CEPILLO DE DIENTES', 
          clue: lang === Language.CATALAN ? "Em fas servir cada dia després de menjar per netejar-te les dents." : "Me usas cada día después de comer para limpiarte los dientes." 
        },
        { 
          ca: 'PINTA', 
          es: 'PEINE', 
          clue: lang === Language.CATALAN ? "Tinc moltes dents però no mossego, i t'ajudo a estar ben pentinat." : "Tengo muchos dientes pero no muerdo, y te ayudo a estar bien peinado." 
        }
      ];

      if (currentRoundIdx < 5) {
        const item = fixedObjects[currentRoundIdx];
        const localizedName = lang === Language.CATALAN ? item.ca : item.es;
        
        setGameState(prev => ({
          ...prev,
          currentObject: localizedName,
          clue: item.clue,
          history: [{ role: 'assistant', content: item.clue }],
          round: currentRoundIdx,
          score: currentScore,
          isGameOver: false
        }));
        setLoading(false);
        return;
      }

      const data = await generateNewGame(lang);
      setGameState(prev => ({
        ...prev,
        currentObject: data.object.toUpperCase(),
        clue: data.initialClue,
        history: [{ role: 'assistant', content: data.initialClue }],
        isGameOver: false,
        round: currentRoundIdx,
        score: currentScore
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initGame(true);
  }, [lang]);

  const handleReveal = () => {
    if (!loading && !isRevealed) {
      playCardFlipSound();
      setIsRevealed(true);
    }
  };

  const handleWin = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setIsRevealed(false);
      setTimeout(() => {
        const finalScore = gameState.score + 1;
        if (gameState.round === 4) {
          onFinish(finalScore);
          return;
        }
        const nextRound = gameState.round + 1;
        initGame(false, nextRound, finalScore);
      }, 400);
    }, 2000);
  };

  const handleLose = () => {
    setIsRevealed(false);
    setTimeout(() => {
      if (gameState.round === 4) {
        onFinish(gameState.score);
        return;
      }
      const nextRound = gameState.round + 1;
      initGame(false, nextRound, gameState.score);
    }, 400);
  };

  const currentRoundNumber = gameState.round + 1;
  const confettiColors = ['#E89C31', '#EFAC4F', '#FFFFFF', '#FFD580', '#F6AD55', '#FFFBF0'];

  return (
    <div className="relative w-full h-screen bg-[#fcfcfc] overflow-hidden font-sans">
      <div 
        className="absolute bottom-0 left-0 w-full bg-[#E89C31] rounded-tl-[300px] shadow-lg transition-all duration-700"
        style={{ zIndex: 0, height: 'calc(94% + 10px)' }}
      />

      <div className="absolute top-0 left-0 w-full flex justify-between items-start p-8 z-30 pointer-events-none">
        <button 
          onClick={handleBack}
          className="w-14 h-14 bg-black rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform pointer-events-auto ml-[10px] mt-[10px]"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <div className="flex flex-col items-end gap-4 pointer-events-auto mr-[100px] mt-[70px]">
          <button 
            onClick={() => { playClickSound(); setShowHelp(true); }}
            className="bg-white w-[210px] h-[72px] rounded-[36px] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-transform group"
          >
            <div className="w-11 h-11 flex items-center justify-center">
              <img 
                src="https://res.cloudinary.com/dla44twvf/image/upload/v1769177821/Captura_de_pantalla_2026-01-23_a_les_15.15.44_blqaum.png" 
                alt="Help Icon" 
                className="w-full h-full object-contain"
              />
            </div>
            <span className="text-3xl font-bold text-black tracking-wide">
              {lang === Language.CATALAN ? 'Ajuda' : 'Ayuda'}
            </span>
          </button>
          
          <div className="bg-white w-[210px] h-[72px] rounded-[36px] shadow-xl flex items-center justify-center">
            <span className="text-4xl font-extrabold text-[#E89C31]">
              {currentRoundNumber} / 5
            </span>
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-[50px] px-12">
        
        <div className="flex-1 flex items-center justify-center -translate-y-[25px]">
          <div 
            onClick={handleReveal}
            className={`relative w-[280px] h-[414px] perspective-1000 group transition-all duration-500 transform ${!isRevealed && !loading ? 'cursor-pointer hover:scale-105' : ''}`}
          >
            <div className="absolute inset-0 bg-black/10 rounded-[40px] translate-y-3" />
            
            <div className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isRevealed ? 'rotate-y-180' : ''}`}>
              
              <div className="absolute inset-0 backface-hidden bg-[#EFAC4F] border-[6px] border-white rounded-[40px] shadow-xl flex flex-col items-center justify-center p-8 z-10">
                {loading ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="text-white font-bold opacity-80 uppercase tracking-widest text-sm">
                      {lang === Language.CATALAN ? 'Carregant...' : 'Cargando...'}
                    </span>
                  </div>
                ) : (
                  <h3 className="text-white text-4xl font-extrabold text-center uppercase tracking-tighter opacity-40 select-none pointer-events-none">
                    {t.title}
                  </h3>
                )}
              </div>

              <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white border-[6px] border-white rounded-[40px] shadow-xl ring-[6px] ring-[#E89C31] ring-inset flex flex-col items-center justify-center p-8 z-20 overflow-visible">
                {showConfetti && (
                  <div className="absolute inset-0 pointer-events-none z-[100] overflow-visible perspective-1000">
                    {[...Array(100)].map((_, i) => (
                      <ConfettiPiece 
                        key={i} 
                        delay={Math.random() * 300} 
                        color={confettiColors[Math.floor(Math.random() * confettiColors.length)]}
                        duration={1800 + Math.random() * 1000}
                      />
                    ))}
                  </div>
                )}

                <div className="flex flex-col items-center justify-center gap-8">
                   <img 
                    src={getObjectImage(gameState.currentObject)} 
                    alt="Revelat"
                    className="w-[197px] h-[197px] object-contain rounded-2xl shadow-sm"
                   />
                   <div className="flex flex-col items-center gap-2">
                     <h3 className="text-[#E89C31] text-4xl font-black text-center uppercase tracking-widest drop-shadow-sm">
                      {gameState.currentObject}
                    </h3>
                    <div className="w-12 h-1.5 bg-[#E89C31]/20 rounded-full" />
                   </div>
                </div>
              </div>
              
            </div>
          </div>
        </div>

        <div className="w-full max-w-4xl flex flex-col items-center gap-8 pb-12 transform -translate-y-8">
          
          <div className={`flex flex-row items-center justify-center gap-6 w-full transition-all duration-700 ease-out ${isRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12 pointer-events-none'}`}>
            <button 
              onClick={() => { playWinSound(); handleWin(); }}
              disabled={showConfetti}
              className="flex-1 bg-white px-8 py-5 rounded-[50px] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border-b-4 border-gray-100 disabled:opacity-50"
            >
              <img 
                src="https://res.cloudinary.com/dla44twvf/image/upload/v1769177820/Captura_de_pantalla_2026-01-23_a_les_15.15.31_f3urwq.png" 
                alt="Win Icon" 
                className="w-11 h-11 object-contain"
              />
              <span className="text-2xl font-black text-black truncate">{t.win}</span>
            </button>

            <button 
              onClick={() => { playLoseSound(); handleLose(); }}
              disabled={showConfetti}
              className="flex-1 bg-white px-8 py-5 rounded-[50px] shadow-2xl flex items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all border-b-4 border-gray-100 disabled:opacity-50"
            >
              <img 
                src="https://res.cloudinary.com/dla44twvf/image/upload/v1769177820/Captura_de_pantalla_2026-01-23_a_les_15.15.36_ubbd4u.png" 
                alt="Lose Icon" 
                className="w-11 h-11 object-contain"
              />
              <span className="text-2xl font-black text-black truncate">{t.lose}</span>
            </button>
          </div>

          <div className="relative flex justify-between items-center w-full px-2">
            <div className="absolute top-1/2 left-[40px] right-[40px] h-6 bg-white rounded-full -translate-y-1/2 shadow-inner" />
            
            {[1, 2, 3, 4, 5].map((num) => {
              const isActive = num === currentRoundNumber;
              const iPast = num < currentRoundNumber;
              const isFirstAndRevealed = isActive && isRevealed;
              
              return (
                <div 
                  key={num}
                  className={`relative z-20 w-16 h-16 rounded-full flex items-center justify-center text-3xl font-extrabold shadow-2xl transition-all duration-500 border-4 border-white ${
                    isActive 
                      ? isFirstAndRevealed 
                        ? 'bg-[#B36D12] text-white scale-110' 
                        : 'bg-white text-black scale-110 ring-4 ring-[#E89C31]/20' 
                      : iPast
                        ? 'bg-[#E89C31] text-white'
                        : 'bg-white text-black/40'
                  }`}
                >
                  {num}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showHelp && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-[340px] bg-white border-[14px] border-[#D67E0F] rounded-[60px] p-8 flex flex-col items-center gap-4 shadow-2xl">
            {t.helpQuestions.map((q, idx) => (
              <button 
                key={idx}
                onClick={playClickSound}
                className="w-full bg-[#FFC27A] py-4 px-6 rounded-[30px] text-black font-bold text-xl hover:scale-[1.02] active:scale-95 transition-transform text-center shadow-md"
              >
                {q}
              </button>
            ))}
            <button 
              onClick={() => { playClickSound(); setShowHelp(false); }}
              className="mt-4 w-32 h-14 bg-[#D67E0F] rounded-[30px] flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-transform"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }

        @keyframes confetti-fall {
          0% { transform: translate(-50%, -50%) scale(0) rotateZ(0deg); opacity: 1; }
          10% { transform: translate(calc(-50% + var(--x-burst)), calc(-50% + var(--y-burst))) scale(1) rotateZ(45deg); opacity: 1; }
          25% { opacity: 1; }
          100% { transform: translate(calc(-50% + var(--x-burst) + var(--x-drift)), 100vh) scale(0.6) rotateZ(var(--rot-z)); opacity: 0; }
        }

        @keyframes confetti-flutter {
          0% { transform: rotateX(0) rotateY(0); }
          25% { transform: rotateX(180deg) rotateY(90deg) translateX(15px); }
          50% { transform: rotateX(360deg) rotateY(180deg) translateX(-15px); }
          75% { transform: rotateX(540deg) rotateY(270deg) translateX(15px); }
          100% { transform: rotateX(720deg) rotateY(360deg) translateX(0); }
        }

        .animate-confetti-fall { animation: confetti-fall linear forwards; }
        .animate-confetti-flutter { animation: confetti-flutter var(--sway-speed) ease-in-out infinite; }
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default GameScreen;
