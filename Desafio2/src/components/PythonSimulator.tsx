import React, { useState } from 'react';
import { Play, RotateCcw, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { playClickSound, playErrorBeep, playEqualsSound } from '../utils/audio';

export const PythonSimulator: React.FC = () => {
  const [num1, setNum1] = useState<string>('24');
  const [op, setOp] = useState<'+' | '-' | '*' | '/'>('*');
  const [num2, setNum2] = useState<string>('4');
  const [result, setResult] = useState<string | null>('96');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const calculate = () => {
    playClickSound();
    const a = parseFloat(num1);
    const b = parseFloat(num2);

    if (isNaN(a) || isNaN(b)) {
      playErrorBeep();
      setIsError(true);
      setErrorMsg('ValueError: Poderia fornecer números válidos');
      setResult('ERRO');
      return;
    }

    if (op === '/' && b === 0) {
      playErrorBeep();
      setIsError(true);
      setErrorMsg('ZeroDivisionError: float division by zero (Tratado pelo Tkinter)');
      setResult('ERRO');
      return;
    }

    let res = 0;
    if (op === '+') res = a + b;
    else if (op === '-') res = a - b;
    else if (op === '*') res = a * b;
    else if (op === '/') res = a / b;

    playEqualsSound();
    setIsError(false);
    setErrorMsg(null);
    setResult(Number.isInteger(res) ? res.toString() : parseFloat(res.toFixed(8)).toString());
  };

  const setExample = (a: string, operator: '+' | '-' | '*' | '/', b: string) => {
    playClickSound(1000);
    setNum1(a);
    setOp(operator);
    setNum2(b);
    setTimeout(() => {
      calculate();
    }, 50);
  };

  return (
    <div className="bevel-inset bg-[#e0dfdb] p-3 text-xs space-y-3 font-sans text-black">
      <div className="flex items-center justify-between border-b border-gray-400 pb-1">
        <span className="font-bold text-sm text-[#000080]">
          Simulador Interativo da Lógica Python
        </span>
        <span className="font-mono text-[11px] text-gray-600">Python 3 Interpreter Mode</span>
      </div>

      <p className="text-gray-700 leading-normal">
        Teste interativamente como a lógica em Python processa as quatro operações matemáticas básicas e trata erros:
      </p>

      {/* Input row */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-col">
          <label className="text-[10px] text-gray-600 font-mono">Operando A (float)</label>
          <input
            type="number"
            value={num1}
            onChange={(e) => setNum1(e.target.value)}
            className="w-24 px-2 py-1 bevel-inset bg-white font-mono text-xs font-bold"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] text-gray-600 font-mono">Operador</label>
          <select
            value={op}
            onChange={(e) => setOp(e.target.value as '+' | '-' | '*' | '/')}
            className="px-2 py-1 bevel-outset bg-white font-mono font-bold text-xs"
          >
            <option value="+">+ (Adição)</option>
            <option value="-">- (Subtração)</option>
            <option value="*">* (Multiplicação)</option>
            <option value="/">/ (Divisão)</option>
          </select>
        </div>

        <div className="flex flex-col">
          <label className="text-[10px] text-gray-600 font-mono">Operando B (float)</label>
          <input
            type="number"
            value={num2}
            onChange={(e) => setNum2(e.target.value)}
            className="w-24 px-2 py-1 bevel-inset bg-white font-mono text-xs font-bold"
          />
        </div>

        <div className="flex items-end">
          <button
            type="button"
            onClick={calculate}
            className="px-4 py-1 bevel-outset active:bevel-inset bg-[#000080] text-white font-bold flex items-center gap-1 text-xs hover:bg-[#1084d0]"
          >
            <Play size={12} />
            <span>Executar Python</span>
          </button>
        </div>
      </div>

      {/* Result box */}
      <div className="bevel-inset bg-white p-2.5 font-mono text-xs">
        <div className="text-[10px] text-gray-500 mb-1">Código Python equivalente executado:</div>
        <div className="bg-[#282c34] text-[#abb2bf] p-2 text-[11px] overflow-x-auto rounded-none mb-2">
          {op === '/' && num2 === '0' ? (
            <span className="text-red-400">
              try:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;resultado = {num1} / {num2}
              <br />
              except ZeroDivisionError:
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;messagebox.showerror(&quot;Erro&quot;, &quot;Divisão por zero não é permitida!&quot;)
            </span>
          ) : (
            <span className="text-emerald-400">
              resultado = {num1} {op} {num2}  # Retorna: {result}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between border-t border-gray-200 pt-1.5">
          <span className="text-gray-700">Resultado da Avaliação:</span>
          <span
            className={`font-bold text-sm px-2 py-0.5 bevel-thin-inset ${
              isError ? 'bg-red-100 text-red-700' : 'bg-emerald-50 text-emerald-900'
            }`}
          >
            {result}
          </span>
        </div>

        {errorMsg && (
          <div className="mt-2 text-red-600 text-[11px] flex items-center gap-1.5 bg-red-50 p-1.5 border border-red-200">
            <AlertTriangle size={14} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Quick Example Presets */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px]">
        <span className="text-gray-600">Exemplos rápidos:</span>
        <button
          type="button"
          onClick={() => setExample('150', '+', '350')}
          className="px-2 py-0.5 bevel-thin-outset bg-white hover:bg-gray-100 font-mono"
        >
          150 + 350
        </button>
        <button
          type="button"
          onClick={() => setExample('1000', '-', '275')}
          className="px-2 py-0.5 bevel-thin-outset bg-white hover:bg-gray-100 font-mono"
        >
          1000 - 275
        </button>
        <button
          type="button"
          onClick={() => setExample('16', '*', '16')}
          className="px-2 py-0.5 bevel-thin-outset bg-white hover:bg-gray-100 font-mono"
        >
          16 * 16
        </button>
        <button
          type="button"
          onClick={() => setExample('48', '/', '6')}
          className="px-2 py-0.5 bevel-thin-outset bg-white hover:bg-gray-100 font-mono"
        >
          48 / 6
        </button>
        <button
          type="button"
          onClick={() => setExample('100', '/', '0')}
          className="px-2 py-0.5 bevel-thin-outset bg-red-50 text-red-700 hover:bg-red-100 font-mono font-bold"
          title="Testar proteção contra divisão por zero"
        >
          100 / 0 (ZeroDiv)
        </button>
      </div>
    </div>
  );
};
