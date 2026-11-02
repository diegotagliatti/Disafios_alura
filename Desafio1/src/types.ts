export type ThemeId = 'win95' | 'motif' | 'mac7' | 'lcd';

export interface ThemeConfig {
  id: ThemeId;
  name: string;
  year: string;
  description: string;
  windowBg: string;
  titleBarGradient: string;
  titleBarText: string;
  displayBg: string;
  displayText: string;
  displayBorder: string;
  btnBg: string;
  btnText: string;
  btnOpBg: string;
  btnOpText: string;
  btnEqualBg: string;
  btnEqualText: string;
  desktopBg: string;
  fontFamily: string;
}

export interface CalculationHistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: string;
  operation: '+' | '-' | '×' | '÷';
}

export type OperationType = '+' | '-' | '×' | '÷' | null;
