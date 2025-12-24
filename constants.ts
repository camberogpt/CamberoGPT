
import { Criterion, CriterionKey, ScoreSet } from './types';

export const CRITERIA: Criterion[] = [
  { key: CriterionKey.SABOR, label: 'Sabor (El jefe final)', weight: 100 },
  { key: CriterionKey.TEXTURA, label: 'Textura', weight: 90 },
  { key: CriterionKey.PRES_INT, label: 'Presentación Interior', weight: 80 },
  { key: CriterionKey.ORIGINALIDAD, label: 'Originalidad', weight: 70 },
  { key: CriterionKey.ESPIRITU, label: 'Espíritu Navideño', weight: 60 },
  { key: CriterionKey.PRES_EXT, label: 'Presentación Exterior', weight: 50 },
  { key: CriterionKey.EQUILIBRIO, label: 'Equilibrio General', weight: 40 },
  { key: CriterionKey.WOW, label: 'Efecto WOW', weight: 30 },
];

export const PARTICIPANTS = [1, 2, 3, 4];
export const JUDGES_COUNT = 6;

export const INITIAL_SCORE_SET: ScoreSet = {
  [CriterionKey.SABOR]: 0,
  [CriterionKey.TEXTURA]: 0,
  [CriterionKey.ORIGINALIDAD]: 0,
  [CriterionKey.ESPIRITU]: 0,
  [CriterionKey.PRES_INT]: 0,
  [CriterionKey.PRES_EXT]: 0,
  [CriterionKey.EQUILIBRIO]: 0,
  [CriterionKey.WOW]: 0,
};
