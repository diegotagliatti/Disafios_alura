import React, { useState } from 'react';
import { Copy, Check, Download, Terminal, BookOpen, Layers, ShieldCheck } from 'lucide-react';
import { PYTHON_TKINTER_CODE, RUN_INSTRUCTIONS, TKINTER_EXPLANATIONS } from '../data/pythonCode';

interface PythonCodeViewerProps {
  onClose?: () => void;
}

export const PythonCodeViewer: React.FC<PythonCodeViewerProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'code' | 'run' | 'architecture' | 'operations'>('code');
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(PYTHON_TKINTER_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleDownload = () => {
    const blob = new Blob([PYTHON_TKINTER_CODE], { type: 'text/x-python;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'calculadora_retro.py');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-[#d4d0c8] text-black">
      {/* Action Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 border-b border-[#808080] bg-[#e0dfdb]">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1 text-xs font-bold ${
              activeTab === 'code' ? 'bevel-inset bg-white' : 'bevel-outset bg-[#d4d0c8]'
            } flex items-center gap-1.5`}
          >
            <BookOpen size={13} />
            <span>Código Python (.py)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('run')}
            className={`px-3 py-1 text-xs font-bold ${
              activeTab === 'run' ? 'bevel-inset bg-white' : 'bevel-outset bg-[#d4d0c8]'
            } flex items-center gap-1.5`}
          >
            <Terminal size={13} />
            <span>Como Executar</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`px-3 py-1 text-xs font-bold ${
              activeTab === 'architecture' ? 'bevel-inset bg-white' : 'bevel-outset bg-[#d4d0c8]'
            } flex items-center gap-1.5`}
          >
            <Layers size={13} />
            <span>Anatomia do Tkinter</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('operations')}
            className={`px-3 py-1 text-xs font-bold ${
              activeTab === 'operations' ? 'bevel-inset bg-white' : 'bevel-outset bg-[#d4d0c8]'
            } flex items-center gap-1.5`}
          >
            <ShieldCheck size={13} />
            <span>As 4 Operações</span>
          </button>
        </div>

        {/* Action Buttons: Copy and Download */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-3 py-1 text-xs font-bold bevel-outset active:bevel-inset bg-[#e8e7e3] hover:bg-white flex items-center gap-1 text-black"
          >
            {copied ? <Check size={13} className="text-emerald-700" /> : <Copy size={13} />}
            <span>{copied ? 'Código Copiado!' : 'Copiar Código'}</span>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="px-3 py-1 text-xs font-bold bevel-outset active:bevel-inset bg-[#000080] hover:bg-[#1084d0] text-white flex items-center gap-1"
          >
            <Download size={13} />
            <span>Baixar .py</span>
          </button>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="flex-1 p-3 overflow-y-auto">
        {/* Tab 1: Source Code View */}
        {activeTab === 'code' && (
          <div className="flex flex-col h-full space-y-2">
            <div className="text-xs text-gray-700 flex items-center justify-between">
              <span>Arquivo: <strong className="font-mono">calculadora_retro.py</strong> (Python 3.6+)</span>
              <span className="text-[11px] text-gray-500">Biblioteca padrão Tkinter (sem pip install necessário)</span>
            </div>
            <div className="bevel-inset bg-[#1e1e1e] text-[#d4d4d4] font-retro-mono text-xs p-3 overflow-x-auto leading-relaxed select-text rounded-none">
              <pre className="text-xs">
                <code>{PYTHON_TKINTER_CODE}</code>
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: How to run in terminal */}
        {activeTab === 'run' && (
          <div className="space-y-4 text-xs">
            <div className="bevel-inset p-3 bg-white">
              <h3 className="font-bold text-sm text-[#000080] mb-1">
                Passo a Passo Rápido para Rodar no seu Computador
              </h3>
              <p className="text-gray-700">
                O código foi escrito utilizando apenas a biblioteca padrão nativa do Python (<code className="bg-gray-100 px-1 font-mono">tkinter</code>). Isso significa que <strong>você não precisa instalar nenhuma dependência externa via pip</strong>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {RUN_INSTRUCTIONS.map((item) => (
                <div key={item.os} className="bevel-outset p-3 bg-[#e0dfdb] flex flex-col">
                  <div className="font-bold text-sm text-black border-b border-[#808080] pb-1 mb-2">
                    {item.os}
                  </div>
                  <ol className="list-decimal list-inside space-y-2 flex-1 text-gray-800">
                    {item.steps.map((step, sIdx) => (
                      <li key={sIdx} className="leading-normal">
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
            </div>

            <div className="bevel-thin-inset p-3 bg-[#fdfbe8] border border-amber-300">
              <div className="font-bold text-amber-900 mb-1">Dica de Produtividade dos Anos 90:</div>
              <p className="text-amber-800">
                No Windows, se você renomear a extensão de <code className="font-mono font-bold">calculadora_retro.py</code> para <code className="font-mono font-bold">calculadora_retro.pyw</code>, a janela do prompt preto não abre ao rodar, iniciando diretamente a janela gráfica!
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Tkinter Architecture */}
        {activeTab === 'architecture' && (
          <div className="space-y-3 text-xs">
            <div className="bevel-inset p-2.5 bg-white mb-2">
              <h3 className="font-bold text-sm text-[#000080]">Como o Tkinter Constrói a Estética dos Anos 90</h3>
              <p className="text-gray-700 mt-1">
                A biblioteca Tkinter foi criada em meados dos anos 90 junto com o Tcl/Tk. Ela possui propriedades visuais autênticas daquela era de ouro da computação:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {TKINTER_EXPLANATIONS.map((exp) => (
                <div key={exp.concept} className="bevel-outset p-3 bg-[#e8e7e3]">
                  <div className="font-bold text-xs text-black border-b border-gray-400 pb-1 mb-1.5">
                    {exp.concept}
                  </div>
                  <pre className="bevel-inset bg-[#282c34] text-[#98c379] p-2 text-[11px] font-mono mb-2 overflow-x-auto">
                    {exp.code}
                  </pre>
                  <p className="text-gray-700 leading-relaxed text-[11px]">
                    {exp.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: 4 Basic Operations Breakdown */}
        {activeTab === 'operations' && (
          <div className="space-y-3 text-xs">
            <div className="bevel-inset p-3 bg-white">
              <h3 className="font-bold text-sm text-[#000080]">As Quatro Operações Matemáticas Básicas</h3>
              <p className="text-gray-700 mt-1">
                Implementadas com aritmética de ponto flutuante, precisão decimal e tratamento robusto de exceções:
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bevel-outset p-3 bg-[#e0dfdb]">
                <div className="flex items-center justify-between font-bold text-sm text-black border-b border-gray-400 pb-1 mb-2">
                  <span>1. Adição (+)</span>
                  <span className="font-mono text-blue-900 bg-white px-2 py-0.5 bevel-inset">a + b</span>
                </div>
                <p className="text-gray-700 mb-2">
                  Soma os operandos armazenados. Suporta números inteiros e números com casas decimais.
                </p>
                <code className="block font-mono bg-white p-1 text-[11px] bevel-inset">
                  resultado = operando_anterior + operando_atual
                </code>
              </div>

              <div className="bevel-outset p-3 bg-[#e0dfdb]">
                <div className="flex items-center justify-between font-bold text-sm text-black border-b border-gray-400 pb-1 mb-2">
                  <span>2. Subtração (-)</span>
                  <span className="font-mono text-blue-900 bg-white px-2 py-0.5 bevel-inset">a - b</span>
                </div>
                <p className="text-gray-700 mb-2">
                  Diminui o valor atual do acumulado. Lida de forma transparente com resultados negativos (-).
                </p>
                <code className="block font-mono bg-white p-1 text-[11px] bevel-inset">
                  resultado = operando_anterior - operando_atual
                </code>
              </div>

              <div className="bevel-outset p-3 bg-[#e0dfdb]">
                <div className="flex items-center justify-between font-bold text-sm text-black border-b border-gray-400 pb-1 mb-2">
                  <span>3. Multiplicação (× / *)</span>
                  <span className="font-mono text-blue-900 bg-white px-2 py-0.5 bevel-inset">a * b</span>
                </div>
                <p className="text-gray-700 mb-2">
                  Calcula o produto dos fatores informados pelo usuário no teclado ou na tela.
                </p>
                <code className="block font-mono bg-white p-1 text-[11px] bevel-inset">
                  resultado = operando_anterior * operando_atual
                </code>
              </div>

              <div className="bevel-outset p-3 bg-[#e0dfdb]">
                <div className="flex items-center justify-between font-bold text-sm text-black border-b border-gray-400 pb-1 mb-2">
                  <span>4. Divisão (÷ / /)</span>
                  <span className="font-mono text-blue-900 bg-white px-2 py-0.5 bevel-inset">a / b</span>
                </div>
                <p className="text-gray-700 mb-2">
                  Divide o numerador pelo denominador com <strong>proteção total contra divisão por zero</strong>.
                </p>
                <code className="block font-mono bg-white p-1 text-[11px] bevel-inset text-red-700">
                  if operando_atual == 0: exibir_erro()
                </code>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="p-2 border-t border-[#808080] bg-[#d4d0c8] flex items-center justify-between text-[11px] text-gray-700">
        <span>Pronto para copiar ou baixar e executar localmente.</span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-0.5 bevel-outset active:bevel-inset bg-[#e0dfdb] hover:bg-white text-black font-semibold"
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
};
