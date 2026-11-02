import React, { useState, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX, FileText, Check } from 'lucide-react';
import { ThemeConfig, CalculationHistoryItem, OperationType } from '../types';
import { playClickSound, playEqualsSound, playErrorBeep, playClearSound, isSoundEnabled, setSoundEnabled } from '../utils/audio';

interface TkinterCalculatorProps {
  theme: ThemeConfig;
  onShowAbout: () => void;
  onOpenPythonCode: () => void;
}

export const TkinterCalculator: React.FC<TkinterCalculatorProps> = ({
  theme,
  onShowAbout,
  onOpenPythonCode,
}) => {
  const [displayValue, setDisplayValue] = useState<string>('0');
  const [previousOperand, setPreviousOperand] = useState<number | null>(null);
  const [operation, setOperation] = useState<OperationType>(null);
  const [isNewNumber, setIsNewNumber] = useState<boolean>(true);
  const [equationPreview, setEquationPreview] = useState<string>('');
  const [memoryValue, setMemoryValue] = useState<number>(0);
  const [hasMemory, setHasMemory] = useState<boolean>(false);
  const [history, setHistory] = useState<CalculationHistoryItem[]>([]);
  const [showHistoryTape, setShowHistoryTape] = useState<boolean>(false);
  const [soundOn, setSoundOn] = useState<boolean>(true);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync sound setting
  useEffect(() => {
    setSoundEnabled(soundOn);
  }, [soundOn]);

  const formatNumber = (num: number): string => {
    if (Number.isInteger(num)) return num.toString();
    const str = num.toFixed(8);
    return parseFloat(str).toString();
  };

  const handleDigit = useCallback((digit: string) => {
    playClickSound(1100);
    setErrorMessage(null);

    setDisplayValue((prev) => {
      if (isNewNumber || prev === '0' || prev === 'ERRO') {
        setIsNewNumber(false);
        return digit;
      }
      if (prev.replace('.', '').length >= 14) return prev;
      return prev + digit;
    });
  }, [isNewNumber]);

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

  const handleOperation = useCallback((op: OperationType) => {
    playClickSound(950);
    setErrorMessage(null);

    if (displayValue === 'ERRO') return;

    const currentNum = parseFloat(displayValue);

    // If chained operation (e.g. 5 + 3 +)
    if (previousOperand !== null && operation !== null && !isNewNumber) {
      let chainedResult = 0;
      if (operation === '+') chainedResult = previousOperand + currentNum;
      else if (operation === '-') chainedResult = previousOperand - currentNum;
      else if (operation === '×') chainedResult = previousOperand * currentNum;
      else if (operation === '÷') {
        if (currentNum === 0) {
          playErrorBeep();
          setDisplayValue('ERRO');
          setErrorMessage('Divisão por zero não é permitida!');
          setPreviousOperand(null);
          setOperation(null);
          setIsNewNumber(true);
          return;
        }
        chainedResult = previousOperand / currentNum;
      }

      setPreviousOperand(chainedResult);
      setDisplayValue(formatNumber(chainedResult));
      setEquationPreview(`${formatNumber(chainedResult)} ${op}`);
    } else {
      setPreviousOperand(currentNum);
      setEquationPreview(`${formatNumber(currentNum)} ${op}`);
    }

    setOperation(op);
    setIsNewNumber(true);
  }, [displayValue, previousOperand, operation, isNewNumber]);

  const handleCalculate = useCallback(() => {
    if (previousOperand === null || operation === null) return;

    const currentNum = parseFloat(displayValue);
    let result = 0;

    if (operation === '+') {
      result = previousOperand + currentNum;
    } else if (operation === '-') {
      result = previousOperand - currentNum;
    } else if (operation === '×') {
      result = previousOperand * currentNum;
    } else if (operation === '÷') {
      if (currentNum === 0) {
        playErrorBeep();
        setDisplayValue('ERRO');
        setErrorMessage('Divisão por zero não é permitida!');
        setPreviousOperand(null);
        setOperation(null);
        setIsNewNumber(true);
        return;
      }
      result = previousOperand / currentNum;
    }

    playEqualsSound();
    const formattedResult = formatNumber(result);
    const expression = `${formatNumber(previousOperand)} ${operation} ${formatNumber(currentNum)}`;

    // Add to history tape
    setHistory((prev) => [
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
  }, [previousOperand, operation, displayValue]);

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
      // Percentage of previous operand
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
      // Don't intercept if typing in an input or textarea
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
  }, [handleDigit, handleDecimal, handleOperation, handleCalculate, handleBackspace, handleClearAll, handlePercentage]);

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start justify-center">
      {/* Main Calculator Body */}
      <div
        className="w-full max-w-[340px] bevel-outset p-3"
        style={{ backgroundColor: theme.windowBg }}
      >
        {/* Top Controls Toolbar (Sound, Paper Tape, Python code shortcut) */}
        <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#808080]/40 text-xs">
          <div className="flex items-center gap-2">
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
          </div>

          <button
            type="button"
            onClick={onOpenPythonCode}
            className="p-1 bevel-thin-outset bg-[#d4d0c8] hover:bg-white text-black flex items-center gap-1 text-[11px] font-mono"
            title="Ver código Python Tkinter correspondente"
          >
            <span>Ver Python</span>
          </button>
        </div>

        {/* LCD / CRT Sunken Display */}
        <div
          className="bevel-inset p-2 mb-3 relative font-retro-mono overflow-hidden"
          style={{
            backgroundColor: theme.displayBg,
            borderColor: theme.displayBorder,
          }}
        >
          {/* Top Line: Memory indicator [M] and Equation Preview */}
          <div className="flex items-center justify-between text-xs h-4 mb-1">
            <span
              className={`text-[10px] font-bold px-1 rounded-none border border-current ${
                hasMemory ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ color: theme.displayText }}
            >
              M
            </span>
            <span
              className="text-right text-[12px] opacity-75 truncate max-w-[220px]"
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

          {/* Error Banner when dividing by zero */}
          {errorMessage && (
            <div className="mt-1 text-[11px] text-red-600 font-sans font-semibold bg-red-100 border border-red-400 px-1 py-0.5 flex items-center justify-between animate-pulse">
              <span>{errorMessage}</span>
              <button
                type="button"
                onClick={() => setErrorMessage(null)}
                className="underline text-[10px] ml-1"
              >
                OK
              </button>
            </div>
          )}
        </div>

        {/* Keypad Grid (Authentic Tkinter button rows) */}
        <div className="grid grid-cols-4 gap-1.5">
          {/* Row 0: Memory Buttons */}
          <button
            type="button"
            onClick={handleMemoryClear}
            className={`h-8 text-xs font-bold bevel-outset active:bevel-inset ${
              activeButton === 'MC' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
          >
            MC
          </button>
          <button
            type="button"
            onClick={handleMemoryRecall}
            className={`h-8 text-xs font-bold bevel-outset active:bevel-inset ${
              activeButton === 'MR' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
          >
            MR
          </button>
          <button
            type="button"
            onClick={handleMemoryAdd}
            className={`h-8 text-xs font-bold bevel-outset active:bevel-inset ${
              activeButton === 'M+' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
          >
            M+
          </button>
          <button
            type="button"
            onClick={handleMemorySubtract}
            className={`h-8 text-xs font-bold bevel-outset active:bevel-inset ${
              activeButton === 'M-' ? 'bevel-inset' : ''
            }`}
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
            className={`h-10 text-xs font-bold bevel-outset active:bevel-inset ${
              activeButton === 'CE' ? 'bevel-inset' : ''
            }`}
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
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '7' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            7
          </button>
          <button
            type="button"
            onClick={() => handleDigit('8')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '8' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            8
          </button>
          <button
            type="button"
            onClick={() => handleDigit('9')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '9' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            9
          </button>
          <button
            type="button"
            onClick={() => handleOperation('×')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
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
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '4' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            4
          </button>
          <button
            type="button"
            onClick={() => handleDigit('5')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '5' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            5
          </button>
          <button
            type="button"
            onClick={() => handleDigit('6')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '6' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            6
          </button>
          <button
            type="button"
            onClick={() => handleOperation('-')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
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
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '1' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            1
          </button>
          <button
            type="button"
            onClick={() => handleDigit('2')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '2' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            2
          </button>
          <button
            type="button"
            onClick={() => handleDigit('3')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '3' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            3
          </button>
          <button
            type="button"
            onClick={() => handleOperation('+')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
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
            className={`h-11 text-sm font-bold bevel-outset active:bevel-inset ${
              activeButton === '±' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnOpBg, color: theme.btnOpText }}
            title="Inverter sinal (±)"
          >
            ±
          </button>
          <button
            type="button"
            onClick={() => handleDigit('0')}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
              activeButton === '0' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnBg, color: theme.btnText }}
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDecimal}
            className={`h-11 text-base font-bold bevel-outset active:bevel-inset ${
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
            className={`h-11 text-lg font-bold bevel-outset active:bevel-inset ${
              activeButton === '=' ? 'bevel-inset' : ''
            }`}
            style={{ backgroundColor: theme.btnEqualBg, color: theme.btnEqualText }}
            title="Calcular resultado (Enter ou =)"
          >
            =
          </button>
        </div>

        {/* 4 Operations Legend Footer */}
        <div className="mt-3 pt-2 border-t border-[#808080]/40 flex items-center justify-between text-[10px] text-gray-700">
          <span>Operações: [ + ] [ - ] [ × ] [ ÷ ]</span>
          <span className="font-mono">Python 3.x</span>
        </div>
      </div>

      {/* Retro Audit Tape / Paper Roll (Fita de Bobina Anos 90) */}
      {showHistoryTape && (
        <div className="w-full md:w-64 bevel-outset p-2 bg-[#fefee9] text-black font-retro-mono text-xs flex flex-col max-h-[460px]">
          {/* Paper roll top tear effect */}
          <div className="flex items-center justify-between pb-1 mb-2 border-b-2 border-dashed border-gray-400">
            <span className="font-bold flex items-center gap-1 text-[11px]">
              <FileText size={12} />
              Bobina de Cálculo
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setHistory([])}
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

          {/* History lines */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {history.length === 0 ? (
              <div className="text-gray-500 italic text-center py-6 text-[11px]">
                Nenhuma conta registrada ainda.
                <br />
                Faça contas como 25 × 4 = 100
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

          {/* Paper roll bottom decorative jagged border */}
          <div className="text-[10px] text-gray-500 text-center pt-2 border-t border-dashed border-gray-400 mt-2">
            ▲ Papel Contínuo Térmico 1995 ▲
          </div>
        </div>
      )}
    </div>
  );
};
