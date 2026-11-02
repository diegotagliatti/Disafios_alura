import React from 'react';
import { Info, X } from 'lucide-react';
import { ThemeConfig } from '../types';

interface AboutDialogProps {
  theme: ThemeConfig;
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ theme, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div
        className="w-full max-w-md bevel-outset bg-[#d4d0c8] text-black shadow-2xl select-none"
        style={{ backgroundColor: theme.windowBg }}
      >
        {/* Title Bar */}
        <div
          className="flex items-center justify-between px-2 py-1 text-xs font-bold"
          style={{
            background: theme.titleBarGradient,
            color: theme.titleBarText,
          }}
        >
          <div className="flex items-center gap-1.5">
            <Info size={13} />
            <span>Sobre a Calculadora Tkinter 1995</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black flex items-center justify-center hover:bg-[#dfdfdf]"
          >
            <X size={11} strokeWidth={3} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 text-xs text-gray-900">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-blue-800 bg-blue-100 text-blue-900 flex items-center justify-center font-serif text-2xl font-bold shrink-0">
              i
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-black">
                Calculadora Retrô Anos 90 v1.0
              </h4>
              <p className="text-gray-700 leading-normal">
                Desenvolvida especialmente para trazer de volta a nostalgia dos anos 90 com a clássica biblioteca gráfica <strong>Tkinter</strong> do Python.
              </p>
            </div>
          </div>

          <div className="bevel-inset bg-white p-2.5 text-[11px] font-mono space-y-1 text-gray-800">
            <div className="font-bold text-black border-b border-gray-300 pb-0.5">
              4 Operações Matemáticas Básicas:
            </div>
            <div>• Adição [+]</div>
            <div>• Subtração [-]</div>
            <div>• Multiplicação [× / *]</div>
            <div>• Divisão [÷ / /] (com bloqueio de divisão por zero)</div>
            <div className="pt-1 text-[10px] text-gray-500">
              Suporta memória (MC, MR, M+, M-), teclado físico e bobina de papel.
            </div>
          </div>

          <div className="flex items-center justify-end pt-2">
            <button
              type="button"
              onClick={onClose}
              autoFocus
              className="px-6 py-1 font-bold text-xs bevel-outset active:bevel-inset bg-[#e0dfdb] hover:bg-white text-black border-2 border-black/80"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
