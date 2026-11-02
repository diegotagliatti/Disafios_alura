import React, { useState, useEffect, useCallback } from 'react';
import { Volume2, VolumeX, FileText, FlaskConical, Calculator } from 'lucide-react';
import { ThemeConfig, CalculationHistoryItem, OperationType } from '../types';
import {
  playClickSound,
  playEqualsSound,
  playErrorBeep,
  playClearSound,
  setSoundEnabled,
} from '../utils/audio';

type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

interface TkinterScientificCalculatorProps {
  theme: ThemeConfig;
  onShowAbout: () => void;
  onOpenPythonCode: () => void;
  onSwitchToBasic: () => void;
  initialHistory?: CalculationHistoryItem[];
  onHistoryChange?: (history: CalculationHistoryItem[]) => void;
}

export const TkinterScientificCalculator: React.FC<TkinterScientificCalculatorProps> = ({
  theme,
  onOpenPythonCode,
  onSwitchToBasic,
  initialHistory = [],
  onHistoryChange,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<OperationType>(null);
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [equationPreview, setEquationPreview] = useState<string>('');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>(initialHistory);
  const [showHistoryTape, setShowHistoryTape] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Scientific state
  const [angleUnit, setAngleUnit] = useState<AngleUnit>('DEG');
  const [isInv, setIsInv] = useState<boolean>(false);
  const [isHyp, setIsHyp] = useState<boolean>(false);

  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const updateHistory = useCallback(
    (updater: (prev: CalculationHistoryItem[]) => CalculationHistoryItem[]) => {
      setHistory((prev) => {
        const next = updater(prev);
        onHistoryChange?.(next);
        return next;
      });
    },
    [onHistoryChange]
  );

  const formatNumber = (num: number): string => {
    if (!Number.isFinite(num)) return 'ERRO';
    if (Math.abs(num) > 0 && (Math.abs(num) >= 1e12 || Math.abs(num) < 1e-7)) {
      return num.toExponential(6).replace(/\.?0+e/, 'e');
    }
    if (Number.isInteger(num)) return num.toString();
    const str = num.toFixed(8);
    return parseFloat(str).toString();
  };

  const triggerError = (msg: string) => {
    playErrorBeep();
    setDisplayValue('ERRO');
    setErrorMessage(msg);
    setPreviousOperand(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const toRadians = (val: number): number => {
    if (angleUnit === 'DEG') return (val * Math.PI) / 180;
    if (angleUnit === 'GRAD') return (val * Math.PI) / 200;
    return val;
  };

  const fromRadians = (rad: number): number => {
    if (angleUnit === 'DEG') return (rad * 180) / Math.PI;
    if (angleUnit === 'GRAD') return (rad * 200) / Math.PI;
    return rad;
  };

  const factorial = (n: number): number => {
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  };

  const handleDigit = useCallback(
    (digit: string) => {
      playClickSound(1100);
      setErrorMessage(null);

      setDisplayValue((prev) => {
        if (isNewNumber || prev === '0' || prev === 'ERRO') {
          setIsNewNumber(false);
          return digit;
        }
        if (prev.replace('.', '').replace('-', '').length >= 14) return prev;
        return prev + digit;
      });
    },
    [isNewNumber]
  );

  const handleDecimal = useCallback(() => {
    playClickSound(1250);
    setErrorMessage(null);

    setDisplayValue((prev) => {
      if (isNewNumber || prev === 'ERRO') {
        setIsNewNumber(false);
        return '0.';
      }
      if (!prev.includes('.')) {
        return prev + '.';
      }
      return prev;
    });
  }, [isNewNumber]);

  const executeBinaryOperation = (a: number, b: number, op: OperationType): number | null => {
    if (op === '+') return a + b;
    if (op === '-') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') {
      if (b === 0) {
        triggerError('Divisão por zero não é permitida!');
        return null;
      }
      return a / b;
    }
    if (op === 'xʸ') {
      const res = Math.pow(a, b);
      if (!Number.isFinite(res) || isNaN(res)) {
        triggerError('Resultado indefinido para potência!');
        return null;
      }
      return res;
    }
    if (op === 'ʸ√x') {
      if (b === 0) {
        triggerError('Índice da raiz não pode ser zero!');
        return null;
      }
      if (a < 0 && b % 2 === 0) {
        triggerError('Raiz par de número negativo não é real!');
        return null;
      }
      const sign = a < 0 ? -1 : 1;
      return sign * Math.pow(Math.abs(a), 1 / b);
    }
    if (op === 'mod') {
      if (b === 0) {
        triggerError('Módulo por zero não é permitido!');
        return null;
      }
      return a % b;
    }
    return b;
  };

  const handleOperation = useCallback(
    (op: OperationType) => {
      playClickSound(950);
      setErrorMessage(null);

      if (displayValue === 'ERRO') return;

      const currentNum = parseFloat(displayValue);

      if (previousOperand !== null && operation !== null && !isNewNumber) {
        const chainedResult = executeBinaryOperation(previousOperand, currentNum, operation);
        if (chainedResult === null) return;

        setPreviousOperand(chainedResult);
        setDisplayValue(formatNumber(chainedResult));
        setEquationPreview(`${formatNumber(chainedResult)} ${op}`);
      } else {
        setPreviousOperand(currentNum);
        setEquationPreview(`${formatNumber(currentNum)} ${op}`);
      }

      setOperation(op);
      setIsNewNumber(true);
    },
    [displayValue, previousOperand, operation, isNewNumber]
  );

  const handleCalculate = useCallback(() => {
    if (previousOperand === null || operation === null) return;

    const currentNum = parseFloat(displayValue);
    const result = executeBinaryOperation(previousOperand, currentNum, operation);
    if (result === null) return;

    playEqualsSound();
    const formattedResult = formatNumber(result);
    const expression = `${formatNumber(previousOperand)} ${operation} ${formatNumber(currentNum)}`;

    updateHistory((prev) => [
      {
        id: Date.now().toString(),
        expression,
        result: formattedResult,
        timestamp: new Date().toLocaleTimeString(),
        operation: operation,
      },
      ...prev.slice(0, 49),
    ]);

    setEquationPreview(`${expression} =`);
    setDisplayValue(formattedResult);
    setPreviousOperand(null);
    setOperation(null);
    setIsNewNumber(true);
  }, [previousOperand, operation, displayValue, updateHistory]);

  // Unary Scientific Functions
  const handleUnaryFunction = useCallback(
    (funcId: string) => {
      playClickSound(1050);
      setErrorMessage(null);

      if (displayValue === 'ERRO' && funcId !== 'pi' && funcId !== 'e' && funcId !== 'rand') {
        return;
      }

      // Constants
      if (funcId === 'pi') {
        const val = isInv ? 2 * Math.PI : Math.PI;
        const formatted = formatNumber(val);
        setDisplayValue(formatted);
        setEquationPreview(isInv ? '2π' : 'π');
        setIsNewNumber(true);
        return;
      }
      if (funcId === 'e') {
        const formatted = formatNumber(Math.E);
        setDisplayValue(formatted);
        setEquationPreview('e');
        setIsNewNumber(true);
        return;
      }
      if (funcId === 'rand') {
        const formatted = formatNumber(Math.random());
        setDisplayValue(formatted);
        setEquationPreview('Rand()');
        setIsNewNumber(true);
        return;
      }

      const x = parseFloat(displayValue);
      if (isNaN(x)) return;

      let result = 0;
      let label = '';
      let opTag = funcId;

      switch (funcId) {
        case 'sin': {
          if (!isInv && !isHyp) {
            result = Math.sin(toRadians(x));
            label = `sin_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'sin';
          } else if (isInv && !isHyp) {
            if (x < -1 || x > 1) {
              triggerError('Domínio de arcsin é [-1, 1]!');
              return;
            }
            result = fromRadians(Math.asin(x));
            label = `asin_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'asin';
          } else if (!isInv && isHyp) {
            result = Math.sinh(x);
            label = `sinh(${formatNumber(x)})`;
            opTag = 'sinh';
          } else {
            result = Math.asinh(x);
            label = `asinh(${formatNumber(x)})`;
            opTag = 'asinh';
          }
          break;
        }
        case 'cos': {
          if (!isInv && !isHyp) {
            result = Math.cos(toRadians(x));
            label = `cos_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'cos';
          } else if (isInv && !isHyp) {
            if (x < -1 || x > 1) {
              triggerError('Domínio de arccos é [-1, 1]!');
              return;
            }
            result = fromRadians(Math.acos(x));
            label = `acos_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'acos';
          } else if (!isInv && isHyp) {
            result = Math.cosh(x);
            label = `cosh(${formatNumber(x)})`;
            opTag = 'cosh';
          } else {
            if (x < 1) {
              triggerError('Domínio de arccosh é [1, ∞)!');
              return;
            }
            result = Math.acosh(x);
            label = `acosh(${formatNumber(x)})`;
            opTag = 'acosh';
          }
          break;
        }
        case 'tan': {
          if (!isInv && !isHyp) {
            const rad = toRadians(x);
            if (Math.abs(Math.cos(rad)) < 1e-12) {
              triggerError('Tangente indefinida para este ângulo!');
              return;
            }
            result = Math.tan(rad);
            label = `tan_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'tan';
          } else if (isInv && !isHyp) {
            result = fromRadians(Math.atan(x));
            label = `atan_${angleUnit.toLowerCase()}(${formatNumber(x)})`;
            opTag = 'atan';
          } else if (!isInv && isHyp) {
            result = Math.tanh(x);
            label = `tanh(${formatNumber(x)})`;
            opTag = 'tanh';
          } else {
            if (x <= -1 || x >= 1) {
              triggerError('Domínio de arctanh é (-1, 1)!');
              return;
            }
            result = Math.atanh(x);
            label = `atanh(${formatNumber(x)})`;
            opTag = 'atanh';
          }
          break;
        }
        case 'ln': {
          if (isInv) {
            result = Math.exp(x);
            label = `e^(${formatNumber(x)})`;
            opTag = 'eˣ';
          } else {
            if (x <= 0) {
              triggerError('Logaritmo natural requer número > 0!');
              return;
            }
            result = Math.log(x);
            label = `ln(${formatNumber(x)})`;
            opTag = 'ln';
          }
          break;
        }
        case 'log': {
          if (isInv) {
            result = Math.pow(10, x);
            label = `10^(${formatNumber(x)})`;
            opTag = '10ˣ';
          } else {
            if (x <= 0) {
              triggerError('Logaritmo base 10 requer número > 0!');
              return;
            }
            result = Math.log10(x);
            label = `log₁₀(${formatNumber(x)})`;
            opTag = 'log';
          }
          break;
        }
        case 'log2': {
          if (isInv) {
            result = Math.pow(2, x);
            label = `2^(${formatNumber(x)})`;
            opTag = '2ˣ';
          } else {
            if (x <= 0) {
              triggerError('Logaritmo base 2 requer número > 0!');
              return;
            }
            result = Math.log2(x);
            label = `log₂(${formatNumber(x)})`;
            opTag = 'log₂';
          }
          break;
        }
        case 'sq': {
          result = x * x;
          label = `(${formatNumber(x)})²`;
          opTag = 'x²';
          break;
        }
        case 'cube': {
          result = x * x * x;
          label = `(${formatNumber(x)})³`;
          opTag = 'x³';
          break;
        }
        case 'sqrt': {
          if (x < 0) {
            triggerError('Raiz quadrada de número negativo não é real!');
            return;
          }
          result = Math.sqrt(x);
          label = `√(${formatNumber(x)})`;
          opTag = '√x';
          break;
        }
        case 'cbrt': {
          result = Math.cbrt(x);
          label = `³√(${formatNumber(x)})`;
          opTag = '³√x';
          break;
        }
        case 'inv': {
          if (x === 0) {
            triggerError('Divisão por zero (1/0) não é permitida!');
            return;
          }
          result = 1 / x;
          label = `1/(${formatNumber(x)})`;
          opTag = '1/x';
          break;
        }
        case 'fact': {
          if (x < 0 || !Number.isInteger(x)) {
            triggerError('Fatorial requer número inteiro não-negativo!');
            return;
          }
          if (x > 170) {
            triggerError('Estouro de capacidade (máx 170!)');
            return;
          }
          result = factorial(x);
          label = `${formatNumber(x)}!`;
          opTag = 'n!';
          break;
        }
        case 'abs': {
          result = Math.abs(x);
          label = `|${formatNumber(x)}|`;
          opTag = '|x|';
          break;
        }
        case 'floor': {
          result = isInv ? Math.ceil(x) : Math.floor(x);
          label = isInv ? `⌈${formatNumber(x)}⌉` : `⌊${formatNumber(x)}⌋`;
          opTag = isInv ? '⌈x⌉' : '⌊x⌋';
          break;
        }
        case 'deg2rad': {
          if (isInv) {
            result = (x * 180) / Math.PI;
            label = `deg(${formatNumber(x)} rad)`;
            opTag = '→DEG';
          } else {
            result = (x * Math.PI) / 180;
            label = `rad(${formatNumber(x)}°)`;
            opTag = '→RAD';
          }
          break;
        }
        default:
          return;
      }

      if (!Number.isFinite(result) || isNaN(result)) {
        triggerError('Estouro numérico ou resultado indefinido!');
        return;
      }

      // Clean floating point near-zero residuals (e.g. sin(180 deg))
      if (Math.abs(result) < 1e-15 && result !== 0) {
        result = 0;
      }

      playEqualsSound();
      const formattedResult = formatNumber(result);

      updateHistory((prev) => [
        {
          id: Date.now().toString(),
          expression: label,
          result: formattedResult,
          timestamp: new Date().toLocaleTimeString(),
          operation: opTag,
        },
        ...prev.slice(0, 49),
      ]);

      setEquationPreview(`${label} =`);
      setDisplayValue(formattedResult);
      setIsNewNumber(true);
    },
    [displayValue, angleUnit, isInv, isHyp, updateHistory]
  );

  const handleClearAll = useCallback(() => {
    playClearSound();
    setDisplayValue('0');
    setPreviousOperand(null);
    setOperation(null);
    setIsNewNumber(true);
    setEquationPreview('');
    setErrorMessage(null);
  }, []);

  const handleClearEntry = useCallback(() => {
    playClearSound();
    setDisplayValue('0');
    setIsNewNumber(true);
    setErrorMessage(null);
  }, []);

  const handleBackspace = useCallback(() => {
    playClickSound(850);
    if (isNewNumber || displayValue === 'ERRO') return;

    setDisplayValue((prev) => {
      if (prev.length > 1) {
        const next = prev.slice(0, -1);
        return next === '-' ? '0' : next;
      }
      return '0';
    });
  }, [isNewNumber, displayValue]);

  const handleInvertSign = useCallback(() => {
    playClickSound(1000);
    if (displayValue === '0' || displayValue === 'ERRO') return;
    setDisplayValue((prev) => (prev.startsWith('-') ? prev.slice(1) : '-' + prev));
  }, [displayValue]);

  const handlePercentage = useCallback(() => {
    playClickSound(1000);
    if (displayValue === 'ERRO') return;
    const num = parseFloat(displayValue);
    if (previousOperand !== null) {
      const percentVal = (previousOperand * num) / 100;
      setDisplayValue(formatNumber(percentVal));
    } else {
      setDisplayValue(formatNumber(num / 100));
    }
    setIsNewNumber(true);
  }, [displayValue, previousOperand]);

  // Memory functions (MC, MR, M+, M-)
  const handleMemoryClear = () => {
    playClickSound(900);
    setMemoryValue(0);
    setHasMemory(false);
  };

  const handleMemoryRecall = () => {
    playClickSound(1100);
    if (hasMemory) {
      setDisplayValue(formatNumber(memoryValue));
      setIsNewNumber(true);
    }
  };

  const handleMemoryAdd = () => {
    playClickSound(1100);
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      setMemoryValue((prev) => prev + val);
      setHasMemory(true);
      setIsNewNumber(true);
    }
  };

  const handleMemorySubtract = () => {
    playClickSound(1100);
    const val = parseFloat(displayValue);
    if (!isNaN(val)) {
      setMemoryValue((prev) => prev - val);
      setHasMemory(true);
      setIsNewNumber(true);
    }
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        setActiveButton(e.key);
        handleDigit(e.key);
      } else if (e.key === '.' || e.key === ',') {
        setActiveButton('.');
        handleDecimal();
      } else if (e.key === '+') {
        setActiveButton('+');
        handleOperation('+');
      } else if (e.key === '-') {
        setActiveButton('-');
        handleOperation('-');
      } else if (e.key === '*' || e.key.toLowerCase() === 'x') {
        setActiveButton('×');
        handleOperation('×');
      } else if (e.key === '/') {
        e.preventDefault();
        setActiveButton('÷');
        handleOperation('÷');
      } else if (e.key === '^') {
        setActiveButton('xʸ');
        handleOperation('xʸ');
      } else if (e.key === '!') {
        setActiveButton('n!');
        handleUnaryFunction('fact');
      } else if (e.key.toLowerCase() === 'p') {
        setActiveButton('π');
        handleUnaryFunction('pi');
      } else if (e.key.toLowerCase() === 'r') {
        setActiveButton('√x');
        handleUnaryFunction('sqrt');
      } else if (e.key.toLowerCase() === 's') {
        setActiveButton('sin');
        handleUnaryFunction('sin');
      } else if (e.key.toLowerCase() === 'c') {
        setActiveButton('cos');
        handleUnaryFunction('cos');
      } else if (e.key.toLowerCase() === 't') {
        setActiveButton('tan');
        handleUnaryFunction('tan');
      } else if (e.key.toLowerCase() === 'l') {
        setActiveButton('log');
        handleUnaryFunction('log');
      } else if (e.key.toLowerCase() === 'n') {
        setActiveButton('ln');
        handleUnaryFunction('ln');
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        setActiveButton('=');
        handleCalculate();
      } else if (e.key === 'Backspace') {
        setActiveButton('⌫');
        handleBackspace();
      } else if (e.key === 'Escape') {
        setActiveButton('C');
        handleClearAll();
      } else if (e.key === '%') {
        setActiveButton('%');
        handlePercentage();
      }
    };

    const handleKeyUp = () => {
      setActiveButton(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    handleDigit,
    handleDecimal,
    handleOperation,
    handleUnaryFunction,
    handleCalculate,
    handleBackspace,
    handleClearAll,
    handlePercentage,
  ]);

  const trigLabel = (base: 'sin' | 'cos' | 'tan') => {
    if (isInv && isHyp) return `a${base}h`;
    if (isInv) return `a${base}`;
    if (isHyp) return `${base}h`;
    return base;
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 items-start justify-center">
      {/* Main Scientific Calculator Body */}
      <div
        className="w-full max-w-[650px] bevel-outset p-3"
        style={{ backgroundColor: theme.windowBg }}
      >
        {/* Top Controls Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-1.5 border-b border-[#808080]/40 text-xs">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setSoundOn(!soundOn)}
              className="p-1 bevel-thin-outset bg-[#d4d0c8] hover:bg-white text-black active:bevel-thin-inset flex items-center gap-1 text-[11px]"
              title={soundOn ? 'Desativar som mecânico' : 'Ativar som mecânico'}
            >
              {soundOn ? <Volume2 size={13} /> : <VolumeX size={13} className="text-red-700" />}
              <span>{soundOn ? 'Som' : 'Mudo'}</span>
            </button>
            <button
              type="button"
              onClick={() => setShowHistoryTape(!showHistoryTape)}
              className={`p-1 bevel-thin-outset text-black flex items-center gap-1 text-[11px] ${
                showHistoryTape ? 'bevel-thin-inset bg-[#e8e8e8]' : 'bg-[#d4d0c8] hover:bg-white'
              }`}
              title="Abrir fita de auditoria / bobina de papel"
            >
              <FileText size={13} />
              <span>Fita ({history.length})</span>
            </button>
            <div className="px-2 py-0.5 bevel-thin-inset bg-[#dfdfdf] text-[#000080] font-bold text-[11px] flex items-center gap-1">
              <FlaskConical size={12} />
              <span>MODO CIENTÍFICO (Tkinter Sci-95)</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onSwitchToBasic();
              }}
              className="px-2 py-1 bevel-outset active:bevel-inset bg-[#000080] hover:bg-[#1084d0] text-white font-bold flex items-center gap-1 text-[11px]"
              title="Voltar para a Calculadora Básica de 4 Operações"
            >
              <Calculator size={13} />
              <span>Calculadora Padrão</span>
            </button>
            <button
              type="button"
              onClick={onOpenPythonCode}
              className="p-1 bevel-thin-outset bg-[#d4d0c8] hover:bg-white text-black flex items-center gap-1 text-[11px] font-mono"
              title="Ver código Python Tkinter correspondente"
            >
              <span>Ver Python</span>
            </button>
          </div>
        </div>

        {/* LCD / CRT Sunken Display */}
        <div
          className="bevel-inset p-2.5 mb-2.5 relative font-retro-mono overflow-hidden"
          style={{
            backgroundColor: theme.displayBg,
            borderColor: theme.displayBorder,
          }}
        >
          {/* Top Line: Indicators [M] [DEG/RAD/GRAD] [INV] [HYP] and Equation Preview */}
          <div className="flex items-center justify-between text-xs h-4 mb-1">
            <div className="flex items-center gap-1.5">
              <span
                className={`text-[10px] font-bold px-1 rounded-none border border-current ${
                  hasMemory ? 'opacity-100' : 'opacity-20'
                }`}
                style={{ color: theme.displayText }}
              >
                M
              </span>
              <span
                className="text-[10px] font-bold px-1 rounded-none border border-current"
                style={{ color: theme.displayText }}
              >
                {angleUnit}
              </span>
              {isInv && (
                <span
                  className="text-[10px] font-bold px-1 rounded-none border border-current"
                  style={{ color: theme.displayText }}
                >
                  INV
                </span>
              )}
              {isHyp && (
                <span
                  className="text-[10px] font-bold px-1 rounded-none border border-current"
                  style={{ color: theme.displayText }}
                >
                  HYP
                </span>
              )}
            </div>

            <span
              className="text-right text-[12px] opacity-75 truncate max-w-[380px]"
              style={{ color: theme.displayText }}
            >
              {equationPreview || ' '}
            </span>
          </div>

          {/* Main Digits Readout */}
          <div
            className="text-right font-bold text-3xl tracking-wider select-text truncate font-lcd leading-none"
            style={{ color: theme.displayText }}
          >
            {displayValue}
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="mt-1.5 text-[11px] text-red-600 font-sans font-semibold bg-red-100 border border-red-400 px-1.5 py-0.5 flex items-center justify-between animate-pulse">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="underline text-[10px] ml-2 font-bold"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {/* Scientific Mode Sub-Bar: Angle Units (DEG/RAD/GRAD) & Modifiers (INV/HYP) */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5 p-1.5 bevel-thin-inset bg-[#d4d0c8]/80 text-black text-xs">
          {/* Angle Unit Radio Buttons */}
          <div className="flex items-center gap-3 px-1">
            <span className="font-bold text-[11px] text-gray-700">Unidade Angular:</span>
            {(['DEG', 'RAD', 'GRAD'] as AngleUnit[]).map((unit) => (
              <label
                key={unit}
                className="flex items-center gap-1 cursor-pointer font-bold text-[11px]"
                onClick={() => {
                  playClickSound(1050);
                  setAngleUnit(unit);
                }}
              >
                <span
                  className={`w-3.5 h-3.5 bevel-thin-inset bg-white flex items-center justify-center`}
                >
                  {angleUnit === unit && <span className="w-2 h-2 bg-black block" />}
                </span>
                <span>
                  {unit === 'DEG' ? 'Graus (DEG)' : unit === 'RAD' ? 'Radianos (RAD)' : 'Gradianos (GRAD)'}
                </span>
              </label>
            ))}
          </div>

          {/* Modifier Checkboxes (INV / HYP) */}
          <div className="flex items-center gap-3 px-1">
            <label
              className="flex items-center gap-1 cursor-pointer font-bold text-[11px]"
              onClick={() => {
                playClickSound(1050);
                setIsInv(!isInv);
              }}
            >
              <span className="w-3.5 h-3.5 bevel-thin-inset bg-white flex items-center justify-center text-[10px] leading-none">
                {isInv ? '✓' : ''}
              </span>
              <span>Inv (2ª Função)</span>
            </label>

            <label
              className="flex items-center gap-1 cursor-pointer font-bold text-[11px]"
              onClick={() => {
                playClickSound(1050);
                setIsHyp(!isHyp);
              }}
            >
              <span className="w-3.5 h-3.5 bevel-thin-inset bg-white flex items-center justify-center text-[10px] leading-none">
                {isHyp ? '✓' : ''}
              </span>
              <span>Hyp (Hiperbólico)</span>
            </label>
          </div>
        </div>

        {/* Dual-Panel Keypad: Left (Scientific Functions) + Right (Standard Keypad) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* LEFT PANEL: Scientific Functions Grid (4x6) */}
          <div className="bevel-thin-inset p-2 bg-[#c8c4bc]/40">
            <div className="text-[10px] font-bold text-gray-700 mb-1.5 flex items-center justify-between border-b border-[#808080]/40 pb-0.5">
              <span>FUNÇÕES CIENTÍFICAS (math)</span>
              <span className="font-mono text-[#000080]">import math</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {/* Sci Row 0: Trig & Pi */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('sin')}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Seno / Arco-seno / Hiperbólico (Tecla S)"
              >
                {trigLabel('sin')}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cos')}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Cosseno / Arco-cosseno / Hiperbólico (Tecla C)"
              >
                {trigLabel('cos')}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('tan')}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Tangente / Arco-tangente / Hiperbólico (Tecla T)"
              >
                {trigLabel('tan')}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('pi')}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Constante Pi (Tecla P)"
              >
                {isInv ? '2π' : 'π'}
              </button>

              {/* Sci Row 1: Logs & Powers */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('ln')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Logaritmo Natural ln(x) / Exponencial e^x (Tecla N)"
              >
                {isInv ? 'eˣ' : 'ln'}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('log')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Logaritmo Base 10 / 10^x (Tecla L)"
              >
                {isInv ? '10ˣ' : 'log'}
              </button>
              <button
                type="button"
                onClick={() => handleOperation('xʸ')}
                className={`h-10 text-xs font-bold bevel-outset active:bevel-inset ${
                  operation === 'xʸ' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: '#000080' }}
                title="Potência x elevado a y (Tecla ^)"
              >
                xʸ
              </button>
              <button
                type="button"
                onClick={() => handleOperation('ʸ√x')}
                className={`h-10 text-xs font-bold bevel-outset active:bevel-inset ${
                  operation === 'ʸ√x' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: '#000080' }}
                title="Raiz de índice y de x"
              >
                ʸ√x
              </button>

              {/* Sci Row 2: Squares, Cubes, Roots */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('sq')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Elevado ao quadrado (x²)"
              >
                x²
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cube')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Elevado ao cubo (x³)"
              >
                x³
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('sqrt')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Raiz quadrada (Tecla R)"
              >
                √x
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('cbrt')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Raiz cúbica (³√x)"
              >
                ³√x
              </button>

              {/* Sci Row 3: Reciprocal, Factorial, Abs, Modulo */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('inv')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Inverso multiplicativo (1/x)"
              >
                1/x
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('fact')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Fatorial n! (Tecla !)"
              >
                n!
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('abs')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Valor absoluto / Módulo |x|"
              >
                |x|
              </button>
              <button
                type="button"
                onClick={() => handleOperation('mod')}
                className={`h-10 text-xs font-bold bevel-outset active:bevel-inset ${
                  operation === 'mod' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: '#000080' }}
                title="Resto da divisão (Módulo)"
              >
                mod
              </button>

              {/* Sci Row 4: Euler, Log2, Deg/Rad Converter, Floor */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('e')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Número de Euler (e ≈ 2.7182818)"
              >
                e
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('log2')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: '#5b1e5b' }}
                title="Logaritmo Base 2 / 2^x"
              >
                {isInv ? '2ˣ' : 'log₂'}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('deg2rad')}
                className="h-10 text-[11px] font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Converter Graus para Radianos (ou Radianos para Graus com Inv)"
              >
                {isInv ? '→DEG' : '→RAD'}
              </button>
              <button
                type="button"
                onClick={() => handleUnaryFunction('floor')}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Arredondar para baixo (Floor) / para cima com Inv (Ceil)"
              >
                {isInv ? '⌈x⌉' : '⌊x⌋'}
              </button>

              {/* Sci Row 5: Rand, Percent, Inv toggle, Hyp toggle */}
              <button
                type="button"
                onClick={() => handleUnaryFunction('rand')}
                className="h-10 text-[11px] font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Gerar número pseudoaleatório [0, 1)"
              >
                Rand
              </button>
              <button
                type="button"
                onClick={handlePercentage}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Porcentagem (%)"
              >
                %
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(1000);
                  setIsInv(!isInv);
                }}
                className={`h-10 text-xs font-bold ${
                  isInv ? 'bevel-inset bg-amber-200 text-black' : 'bevel-outset'
                }`}
                style={!isInv ? { backgroundColor: theme.btnOpBg, color: theme.btnOpText } : undefined}
                title="Alternar Funções Inversas (2nd / Inv)"
              >
                INV
              </button>
              <button
                type="button"
                onClick={() => {
                  playClickSound(1000);
                  setIsHyp(!isHyp);
                }}
                className={`h-10 text-xs font-bold ${
                  isHyp ? 'bevel-inset bg-amber-200 text-black' : 'bevel-outset'
                }`}
                style={!isHyp ? { backgroundColor: theme.btnOpBg, color: theme.btnOpText } : undefined}
                title="Alternar Funções Hiperbólicas (Hyp)"
              >
                HYP
              </button>
            </div>
          </div>

          {/* RIGHT PANEL: Standard Numbers, Memory & 4 Operations (4x6) */}
          <div className="bevel-thin-inset p-2 bg-[#c8c4bc]/40">
            <div className="text-[10px] font-bold text-gray-700 mb-1.5 flex items-center justify-between border-b border-[#808080]/40 pb-0.5">
              <span>TECLADO NUMÉRICO & 4 OPERAÇÕES</span>
              <span className="font-mono text-[#000080]">Padrão</span>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {/* Row 0: Memory Buttons */}
              <button
                type="button"
                onClick={handleMemoryClear}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
              >
                MC
              </button>
              <button
                type="button"
                onClick={handleMemoryRecall}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
              >
                MR
              </button>
              <button
                type="button"
                onClick={handleMemoryAdd}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
              >
                M+
              </button>
              <button
                type="button"
                onClick={handleMemorySubtract}
                className="h-9 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
              >
                M-
              </button>

              {/* Row 1: Clear, Clear Entry, Backspace, Division */}
              <button
                type="button"
                onClick={handleClearAll}
                className={`h-10 text-xs font-bold bevel-outset active:bevel-inset bg-[#c0392b] text-white ${
                  activeButton === 'C' ? 'bevel-inset' : ''
                }`}
                title="Limpar tudo (Esc)"
              >
                C
              </button>
              <button
                type="button"
                onClick={handleClearEntry}
                className="h-10 text-xs font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Limpar entrada atual"
              >
                CE
              </button>
              <button
                type="button"
                onClick={handleBackspace}
                className={`h-10 text-sm font-bold bevel-outset active:bevel-inset ${
                  activeButton === '⌫' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Apagar dígito (Backspace)"
              >
                ⌫
              </button>
              <button
                type="button"
                onClick={() => handleOperation('÷')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  operation === '÷' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Divisão (/)"
              >
                ÷
              </button>

              {/* Row 2: 7, 8, 9, Multiplicação */}
              <button
                type="button"
                onClick={() => handleDigit('7')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '7' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                7
              </button>
              <button
                type="button"
                onClick={() => handleDigit('8')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '8' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                8
              </button>
              <button
                type="button"
                onClick={() => handleDigit('9')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '9' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                9
              </button>
              <button
                type="button"
                onClick={() => handleOperation('×')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  operation === '×' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Multiplicação (*)"
              >
                ×
              </button>

              {/* Row 3: 4, 5, 6, Subtração */}
              <button
                type="button"
                onClick={() => handleDigit('4')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '4' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                4
              </button>
              <button
                type="button"
                onClick={() => handleDigit('5')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '5' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                5
              </button>
              <button
                type="button"
                onClick={() => handleDigit('6')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '6' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                6
              </button>
              <button
                type="button"
                onClick={() => handleOperation('-')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  operation === '-' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Subtração (-)"
              >
                -
              </button>

              {/* Row 4: 1, 2, 3, Adição */}
              <button
                type="button"
                onClick={() => handleDigit('1')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '1' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                1
              </button>
              <button
                type="button"
                onClick={() => handleDigit('2')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '2' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                2
              </button>
              <button
                type="button"
                onClick={() => handleDigit('3')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '3' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                3
              </button>
              <button
                type="button"
                onClick={() => handleOperation('+')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  operation === '+' ? 'bevel-inset bg-amber-100' : ''
                }`}
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Adição (+)"
              >
                +
              </button>

              {/* Row 5: ±, 0, ., Igual */}
              <button
                type="button"
                onClick={handleInvertSign}
                className="h-10 text-sm font-bold bevel-outset active:bevel-inset"
                style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
                title="Inverter sinal (±)"
              >
                ±
              </button>
              <button
                type="button"
                onClick={() => handleDigit('0')}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '0' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
              >
                0
              </button>
              <button
                type="button"
                onClick={handleDecimal}
                className={`h-10 text-base font-bold bevel-outset active:bevel-inset ${
                  activeButton === '.' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
                title="Ponto decimal (.)"
              >
                .
              </button>
              <button
                type="button"
                onClick={handleCalculate}
                className={`h-10 text-lg font-bold bevel-outset active:bevel-inset ${
                  activeButton === '=' ? 'bevel-inset' : ''
                }`}
                style={{ backgroundColor: theme.btnEqualBg, color: theme.btnEqualText }}
                title="Calcular resultado (Enter ou =)"
              >
                =
              </button>
            </div>
          </div>
        </div>

        {/* Scientific Legend Footer */}
        <div className="mt-3 pt-2 border-t border-[#808080]/40 flex flex-wrap items-center justify-between gap-2 text-[10px] text-gray-700">
          <span>
            Funções: Trigonometria (sin, cos, tan) · Logaritmos (ln, log) · Potências (xʸ, √x, n!)
          </span>
          <span className="font-mono">Python 3.x + math</span>
        </div>
      </div>

      {/* Retro Audit Tape / Paper Roll (Fita de Bobina Anos 90) */}
      {showHistoryTape && (
        <div className="w-full lg:w-64 bevel-outset p-2 bg-[#fefee9] text-black font-retro-mono text-xs flex flex-col max-h-[500px]">
          <div className="flex items-center justify-between pb-1 mb-2 border-b-2 border-dashed border-gray-400">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <FileText size={12} />
              Bobina Científica
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => updateHistory(() => [])}
                className="text-[10px] underline hover:text-red-700"
                title="Limpar histórico da bobina"
              >
                Limpar
              </button>
              <button
                type="button"
                onClick={() => setShowHistoryTape(false)}
                className="text-[10px] px-1 bg-gray-200 hover:bg-gray-300"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <div className="text-gray-500 italic text-center py-6 text-[11px]">
                Nenhuma conta registrada ainda.
                <br />
                Experimente sin(30) ou 5!
              </div>
            ) : (
              history.map((item) => (
                <div
                  key={item.id}
                  className="p-1 border-b border-gray-200 hover:bg-yellow-50 cursor-pointer"
                  onClick={() => {
                    setDisplayValue(item.result);
                    setIsNewNumber(true);
                  }}
                  title="Clique para carregar o resultado no visor"
                >
                  <div className="flex items-center justify-between text-[10px] text-gray-500">
                    <span>{item.timestamp}</span>
                    <span className="font-bold text-gray-700">{item.operation}</span>
                  </div>
                  <div className="text-right text-gray-800">{item.expression}</div>
                  <div className="text-right font-bold text-black border-t border-dotted border-gray-300 pt-0.5">
                    = {item.result}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-[10px] text-gray-500 text-center pt-2 border-t border-dashed border-gray-400 mt-2">
            ▲ Papel Contínuo Térmico 1995 ▲
          </div>
        </div>
      )}
    </div>
  );
};
