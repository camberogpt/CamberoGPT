
export enum CriterionKey {
  SABOR = 'sabor',
  TEXTURA = 'textura',
  ORIGINALIDAD = 'originalidad',
  ESPIRITU = 'espiritu',
  PRES_INT = 'pres_int',
  PRES_EXT = 'pres_ext',
  EQUILIBRIO = 'equilibrio',
  WOW = 'wow'
}

export interface Criterion {
  key: CriterionKey;
  label: string;
  weight: number; // For tie-breaking logic order
}

export interface ScoreSet {
  [CriterionKey.SABOR]: number;
  [CriterionKey.TEXTURA]: number;
  [CriterionKey.ORIGINALIDAD]: number;
  [CriterionKey.ESPIRITU]: number;
  [CriterionKey.PRES_INT]: number;
  [CriterionKey.PRES_EXT]: number;
  [CriterionKey.EQUILIBRIO]: number;
  [CriterionKey.WOW]: number;
}

export interface ParticipantScore {
  participantId: number; // 1 to 4
  scores: ScoreSet;
}

export interface JudgeData {
  judgeId: number; // 1 to 6
  name: string;
  submissions: ParticipantScore[];
}

export interface AppState {
  currentJudgeId: number | null;
  isNotary: boolean;
  allJudgesData: Record<number, JudgeData>;
}
