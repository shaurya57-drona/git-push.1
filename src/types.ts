export type ConicType = 'circle' | 'ellipse' | 'parabola' | 'hyperbola';

export type Language = 'en' | 'hi';

export interface Building {
  id: string;
  nameEn: string;
  nameHi: string;
  conicType: ConicType;
  city: string;
  country: string;
  architect: string;
  yearBuilt: number | string;
  standardEquation: string;
  realWorldEquation: string;
  eccentricity: number;
  eccentricityFormula: string;
  parameters: Record<string, string | number>;
  keyDimensions: Record<string, string>;
  mathematicalSignificanceEn: string;
  mathematicalSignificanceHi: string;
  architecturalAdvantageEn: string;
  architecturalAdvantageHi: string;
  acousticOrStructuralPropertyEn: string;
  acousticOrStructuralPropertyHi: string;
  funFactEn: string;
  funFactHi: string;
  modelType: string;
  accentColor: string;
  formulaNoteEn: string;
  formulaNoteHi: string;
  wikipediaId: string;
}

export interface QuizQuestion {
  id: number;
  questionEn: string;
  questionHi: string;
  optionsEn: string[];
  optionsHi: string[];
  correctIndex: number;
  explanationEn: string;
  explanationHi: string;
  mathTopic: string;
}
