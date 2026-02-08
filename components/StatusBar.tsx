
import React from 'react';

const StatusBar: React.FC = () => {
  // Hem eliminat tota la informació de la barra d'estat (hora, bateria, icones) a petició de l'usuari.
  return (
    <div className="absolute top-0 left-0 w-full px-8 py-2 h-12 flex justify-between items-center z-50 pointer-events-none">
      {/* Contingut buit per mantenir la zona superior neta */}
    </div>
  );
};

export default StatusBar;
