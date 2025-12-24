
import React, { useState, useEffect } from 'react';
import { JudgeData, ParticipantScore, CriterionKey, ScoreSet } from '../types';
import { CRITERIA, PARTICIPANTS, INITIAL_SCORE_SET } from '../constants';

interface JudgeAppProps {
  judgeId: number;
  initialData?: JudgeData;
  onSave: (data: JudgeData) => void;
}

export const JudgeApp: React.FC<JudgeAppProps> = ({ judgeId, initialData, onSave }) => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [judgeData, setJudgeData] = useState<JudgeData>(initialData || {
    judgeId,
    name: `Juez ${judgeId}`,
    submissions: PARTICIPANTS.map(id => ({ participantId: id, scores: { ...INITIAL_SCORE_SET } }))
  });

  const handleScoreChange = (participantId: number, criterion: CriterionKey, value: number) => {
    setJudgeData(prev => {
      const newSubmissions = prev.submissions.map(sub => {
        if (sub.participantId === participantId) {
          return {
            ...sub,
            scores: { ...sub.scores, [criterion]: value }
          };
        }
        return sub;
      });
      const updated = { ...prev, submissions: newSubmissions };
      onSave(updated);
      return updated;
    });
  };

  const currentParticipant = judgeData.submissions.find(s => s.participantId === activeTab)!;

  return (
    <div className="p-4 space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-gold/20 overflow-hidden">
        <div className="flex bg-gray-50 border-b">
          {PARTICIPANTS.map(id => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-4 text-center font-bold transition-all ${
                activeTab === id 
                ? 'bg-white text-[#8b0000] border-b-4 border-[#8b0000]' 
                : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              CAJA {id}
            </button>
          ))}
        </div>

        <div className="p-6 space-y-8 animate-fadeIn">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-serif font-bold text-[#2c1810]">Evaluación Caja #{activeTab}</h3>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full font-bold">★ 1-10</span>
          </div>

          <div className="space-y-8">
            {CRITERIA.map((criterion) => (
              <div key={criterion.key} className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-semibold text-[#4a2c1d] flex items-center gap-2">
                    {criterion.key === CriterionKey.SABOR && '👅'}
                    {criterion.key === CriterionKey.TEXTURA && '🦷'}
                    {criterion.key === CriterionKey.ESPIRITU && '🎄'}
                    {criterion.key === CriterionKey.WOW && '✨'}
                    {criterion.label}
                  </label>
                  <span className="text-lg font-bold text-[#8b0000]">
                    {currentParticipant.scores[criterion.key] || '-'}
                  </span>
                </div>
                
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <button
                      key={num}
                      onClick={() => handleScoreChange(activeTab, criterion.key, num)}
                      className={`h-10 rounded-md text-sm font-bold transition-all border ${
                        currentParticipant.scores[criterion.key] === num
                          ? 'bg-[#8b0000] text-white border-[#8b0000] scale-110 shadow-md'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-red-300'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-yellow-800 text-sm italic">
        <strong>Recordatorio:</strong> No emitas juicios en voz alta. El Notario está vigilando. 🤫
      </div>
    </div>
  );
};
