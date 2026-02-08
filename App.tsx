import React, { useState } from 'react';
import { View, Language } from './types';
import HomeScreen from './components/HomeScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';

const App: React.FC = () => {
  const [view, setView] = useState<View>('home');
  const [lang, setLang] = useState<Language>(Language.CATALAN);
  const [finalScore, setFinalScore] = useState(0);

  const toggleLanguage = () => {
    setLang(prev => prev === Language.CATALAN ? Language.SPANISH : Language.CATALAN);
  };

  const startGame = () => setView('game');
  const goHome = () => setView('home');
  const showResults = (score: number) => {
    setFinalScore(score);
    setView('result');
  };

  return (
    <div className="relative w-full h-screen bg-[#fcfcfc] overflow-hidden">
      {view === 'home' && (
        <HomeScreen 
          lang={lang} 
          onStart={startGame} 
          onToggleLang={toggleLanguage} 
        />
      )}
      
      {view === 'game' && (
        <GameScreen 
          lang={lang} 
          onBack={goHome} 
          onFinish={showResults}
        />
      )}

      {view === 'result' && (
        <ResultScreen 
          lang={lang} 
          score={finalScore} 
          onRestart={goHome}
        />
      )}
    </div>
  );
};

export default App;