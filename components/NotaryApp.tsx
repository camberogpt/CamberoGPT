
import React, { useEffect, useRef, useState } from 'react';
import { JudgeData, CriterionKey, ScoreSet } from '../types';
import { PARTICIPANTS, CRITERIA, JUDGES_COUNT } from '../constants';

interface NotaryAppProps {
  allJudgesData: Record<number, JudgeData>;
}

interface ResultRow {
  participantId: number;
  totalScore: number;
  detailScores: ScoreSet;
  judgeCount: number;
}

export const NotaryApp: React.FC<NotaryAppProps> = ({ allJudgesData }) => {
  const qrRef = useRef<HTMLCanvasElement>(null);
  const [showQR, setShowQR] = useState(false);

  useEffect(() => {
    if (showQR && qrRef.current) {
      // @ts-ignore - QRCode is loaded via CDN in index.html
      QRCode.toCanvas(qrRef.current, window.location.href, {
        width: 250,
        margin: 2,
        color: {
          dark: '#8b0000',
          light: '#ffffff'
        }
      });
    }
  }, [showQR]);

  const calculateResults = (): ResultRow[] => {
    return PARTICIPANTS.map(pId => {
      let total = 0;
      let count = 0;
      const detail: ScoreSet = {
        [CriterionKey.SABOR]: 0,
        [CriterionKey.TEXTURA]: 0,
        [CriterionKey.ORIGINALIDAD]: 0,
        [CriterionKey.ESPIRITU]: 0,
        [CriterionKey.PRES_INT]: 0,
        [CriterionKey.PRES_EXT]: 0,
        [CriterionKey.EQUILIBRIO]: 0,
        [CriterionKey.WOW]: 0,
      };

      (Object.values(allJudgesData) as JudgeData[]).forEach(judge => {
        const sub = judge.submissions.find(s => s.participantId === pId);
        // Solo contamos si el juez ha interactuado (puntos > 0 en alguna categoría)
        const hasVoted = sub && Object.values(sub.scores).some(v => v > 0);
        if (sub && hasVoted) {
          count++;
          Object.keys(sub.scores).forEach(key => {
            const val = sub.scores[key as CriterionKey];
            detail[key as CriterionKey] += val;
            total += val;
          });
        }
      });

      return {
        participantId: pId,
        totalScore: total,
        detailScores: detail,
        judgeCount: count
      };
    });
  };

  const results = calculateResults();
  const sortedResults = [...results].sort((a, b) => {
    if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
    if (b.detailScores.sabor !== a.detailScores.sabor) return b.detailScores.sabor - a.detailScores.sabor;
    return b.detailScores.textura - a.detailScores.textura;
  });

  const judgesVoted = results.reduce((acc, curr) => Math.max(acc, curr.judgeCount), 0);

  return (
    <div className="p-4 space-y-6 animate-fadeIn pb-20">
      {/* Sección de Podio */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-red-100">
        <div className="bg-gradient-to-br from-[#8b0000] to-[#2c1810] p-8 text-white relative">
          <div className="absolute top-4 right-4 animate-pulse">
             <div className="w-3 h-3 bg-green-400 rounded-full shadow-[0_0_10px_rgba(74,222,128,0.8)]"></div>
          </div>
          <h2 className="text-2xl font-serif font-bold text-center tracking-widest">TABLA DE LÍDERES</h2>
          <div className="flex justify-center gap-6 mt-4">
             <div className="text-center">
                <span className="block text-xl font-bold">{judgesVoted}</span>
                <span className="text-[10px] uppercase opacity-60 tracking-tighter">Jueces Activos</span>
             </div>
             <div className="w-px h-8 bg-white/20 mt-1"></div>
             <div className="text-center">
                <span className="block text-xl font-bold">{results.reduce((a, b) => a + b.totalScore, 0)}</span>
                <span className="text-[10px] uppercase opacity-60 tracking-tighter">Puntos Emitidos</span>
             </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {sortedResults.map((res, index) => (
              <div 
                key={res.participantId}
                className={`flex items-center p-5 rounded-2xl border-2 transition-all ${
                  index === 0 ? 'bg-yellow-50 border-yellow-200 shadow-lg -mx-2' : 
                  index === 1 ? 'bg-gray-50 border-gray-200' : 
                  index === 2 ? 'bg-orange-50 border-orange-200' : 'bg-white border-gray-100'
                }`}
              >
                <div className={`w-14 h-14 flex items-center justify-center rounded-full font-bold text-2xl mr-4 shadow-sm ${
                  index === 0 ? 'bg-yellow-400 text-white' : 'bg-white text-gray-400'
                }`}>
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : res.participantId}
                </div>
                
                <div className="flex-1">
                   <div className="flex justify-between items-center">
                     <div>
                       <h4 className="font-black text-gray-800 tracking-tight">CAJA #{res.participantId}</h4>
                       <div className="flex gap-2">
                          {Array.from({length: res.judgeCount}).map((_, i) => (
                            <div key={i} className="w-2 h-2 rounded-full bg-green-500"></div>
                          ))}
                       </div>
                     </div>
                     <div className="text-right">
                       <span className={`text-3xl font-black ${index === 0 ? 'text-[#8b0000]' : 'text-gray-700'}`}>
                         {res.totalScore}
                       </span>
                     </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Botón Compartir QR */}
      <button 
        onClick={() => setShowQR(!showQR)}
        className="w-full bg-white p-4 rounded-2xl border-2 border-dashed border-gray-300 text-gray-500 font-bold flex items-center justify-center gap-3 active:bg-gray-50"
      >
        <span>📲</span> {showQR ? 'Ocultar Código QR' : 'Mostrar QR para Jueces'}
      </button>

      {showQR && (
        <div className="bg-white p-8 rounded-3xl shadow-xl flex flex-col items-center animate-fadeIn border border-gray-100">
           <canvas ref={qrRef}></canvas>
           <p className="mt-4 text-xs font-bold text-gray-400 text-center px-4">
             Haz que los jueces escaneen este código con sus teléfonos Android/iOS para sincronizar los votos.
           </p>
        </div>
      )}

      {/* Detalle Técnico */}
      <div className="bg-white rounded-3xl shadow-lg p-6 border border-gray-100">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2 flex justify-between">
           Desglose Técnico <span>Sabor / Textura / Orig. / Wow</span>
        </h3>
        <div className="space-y-4">
          {sortedResults.map(res => (
            <div key={res.participantId} className="flex items-center justify-between text-sm">
               <span className="font-bold text-gray-700">Caja #{res.participantId}</span>
               <div className="flex gap-4 font-mono font-bold">
                  <span className="text-red-700">{res.detailScores.sabor}</span>
                  <span className="text-blue-700">{res.detailScores.textura}</span>
                  <span className="text-green-700">{res.detailScores.originalidad}</span>
                  <span className="text-yellow-600">★{res.detailScores.wow}</span>
               </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center py-6">
        <button 
           onClick={() => {
             if(confirm("ATENCIÓN: Se borrarán todos los datos del concurso en TODOS los dispositivos. ¿Proceder?")) {
               localStorage.clear();
               window.location.reload();
             }
           }}
           className="text-[10px] font-black text-red-300 hover:text-red-600 transition-colors uppercase tracking-[0.3em]"
        >
          RESET GLOBAL DEL CONCURSO
        </button>
      </div>
    </div>
  );
};
