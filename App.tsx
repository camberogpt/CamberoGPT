
import React, { useState, useEffect, useCallback } from 'react';
import { JudgeApp } from './components/JudgeApp';
import { NotaryApp } from './components/NotaryApp';
import { AppState, JudgeData } from './types';
import { JUDGES_COUNT } from './constants';

// ID único para el concurso (en un escenario real, esto vendría de la URL o login)
const CONTEST_ID = "Caceres_2025_Cookie_Final";

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(() => {
    const saved = localStorage.getItem('cookie_contest_state');
    return saved ? JSON.parse(saved) : {
      currentJudgeId: null,
      isNotary: false,
      allJudgesData: {}
    };
  });

  // Persistencia Local
  useEffect(() => {
    localStorage.setItem('cookie_contest_state', JSON.stringify(appState));
  }, [appState]);

  // Sincronización Real-Time (Simulada con un intervalo para demostración)
  // En producción, aquí conectarías con Firebase .on('value') o Supabase Realtime
  useEffect(() => {
    const syncInterval = setInterval(() => {
      const globalData = localStorage.getItem(`global_${CONTEST_ID}`);
      if (globalData) {
        const parsed = JSON.parse(globalData);
        setAppState(prev => ({
          ...prev,
          allJudgesData: { ...prev.allJudgesData, ...parsed }
        }));
      }
    }, 2000); // Poll cada 2 segundos

    return () => clearInterval(syncInterval);
  }, []);

  const handleSelectRole = (role: 'judge' | 'notary', id?: number) => {
    setAppState(prev => ({
      ...prev,
      isNotary: role === 'notary',
      currentJudgeId: role === 'judge' ? (id || null) : null
    }));
  };

  const updateJudgeData = useCallback((judgeId: number, data: JudgeData) => {
    setAppState(prev => {
      const newState = {
        ...prev,
        allJudgesData: {
          ...prev.allJudgesData,
          [judgeId]: data
        }
      };
      // Simulamos el envío a la nube guardando en un prefijo global
      // En una app real, aquí harías: await db.collection('votes').doc(judgeId).set(data)
      const currentGlobal = JSON.parse(localStorage.getItem(`global_${CONTEST_ID}`) || '{}');
      currentGlobal[judgeId] = data;
      localStorage.setItem(`global_${CONTEST_ID}`, JSON.stringify(currentGlobal));
      
      return newState;
    });
  }, []);

  const resetSession = () => {
    if (confirm("¿Cambiar de rol? Los votos enviados se mantienen en la nube.")) {
      setAppState(prev => ({ ...prev, currentJudgeId: null, isNotary: false }));
    }
  };

  if (!appState.currentJudgeId && !appState.isNotary) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#fdfaf3] text-[#2c1810]">
        <div className="max-w-md w-full text-center space-y-8 animate-fadeIn">
          <div className="relative">
             <div className="text-6xl mb-4 drop-shadow-lg">🎄</div>
             <h1 className="text-3xl font-bold tracking-tight text-[#8b0000]">II CONCURSO INTERNACIONAL DE GALLETAS</h1>
             <p className="text-sm font-semibold opacity-70 mt-2 italic text-[#4a2c1d]">Sincronización en Tiempo Real</p>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-red-50 space-y-6">
            <h2 className="text-xl font-serif font-bold text-[#b8860b]">Panel de Acceso</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {Array.from({ length: JUDGES_COUNT }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectRole('judge', i + 1)}
                  className="py-4 px-4 bg-white hover:bg-red-50 text-[#8b0000] rounded-2xl border-2 border-red-100 transition-all font-bold shadow-sm active:scale-95"
                >
                  Juez {i + 1}
                </button>
              ))}
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={() => handleSelectRole('notary')}
                className="w-full py-4 bg-[#2c1810] hover:bg-[#4a2c1d] text-[#fdfaf3] rounded-2xl transition-all font-serif font-bold tracking-widest shadow-lg flex items-center justify-center gap-2 active:scale-95"
              >
                <span>📜</span> NOTARIO / RESULTADOS
              </button>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-2 opacity-50">
            <p className="text-[10px] uppercase tracking-[0.2em] font-bold">Powered by CloudSync Technology</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fdfaf3] flex flex-col">
      <nav className="bg-[#8b0000] text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg border-b border-white/10">
        <div className="flex items-center gap-3">
           <span className="text-2xl drop-shadow-md">🍪</span>
           <div className="flex flex-col">
             <span className="font-serif font-bold text-xs tracking-wider leading-none">CONCURSO 2025</span>
             <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">
               {appState.isNotary ? 'SALA DEL NOTARIO' : `JUEZ #${appState.currentJudgeId}`}
             </span>
           </div>
        </div>
        <button 
          onClick={resetSession}
          className="text-[10px] font-bold bg-white/10 px-4 py-2 rounded-full border border-white/20 active:bg-white/30"
        >
          SALIR
        </button>
      </nav>

      <main className="max-w-2xl mx-auto w-full flex-1">
        {appState.isNotary ? (
          <NotaryApp allJudgesData={appState.allJudgesData} />
        ) : (
          <JudgeApp 
            judgeId={appState.currentJudgeId!} 
            initialData={appState.allJudgesData[appState.currentJudgeId!]}
            onSave={(data) => updateJudgeData(appState.currentJudgeId!, data)}
          />
        )}
      </main>

      {!appState.isNotary && (
        <footer className="p-4 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest bg-white/50 border-t">
          Votos sincronizados automáticamente con la central
        </footer>
      )}
    </div>
  );
};

export default App;
