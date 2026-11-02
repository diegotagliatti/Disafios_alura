import React, { useState, useEffect } from 'react';
import {
  Calculator,
  Code2,
  Terminal,
  FileCode,
  HelpCircle,
  Volume2,
  VolumeX,
  Palette,
  ExternalLink,
  Laptop,
  FolderOpen,
  Info,
  FlaskConical,
} from 'lucide-react';
import { THEMES } from './utils/themes';
import { ThemeId } from './types';
import { RetroWindow } from './components/RetroWindow';
import { TkinterCalculator } from './components/TkinterCalculator';
import { PythonCodeViewer } from './components/PythonCodeViewer';
import { PythonSimulator } from './components/PythonSimulator';
import { AboutDialog } from './components/AboutDialog';
import { isSoundEnabled, setSoundEnabled, playClickSound } from './utils/audio';

export default function App() {
  const [currentThemeId, setCurrentThemeId] = useState<ThemeId>('win95');
  const [activeTab, setActiveTab] = useState<'calculator' | 'code' | 'simulator'>('calculator');
  const [isScientific, setIsScientific] = useState<boolean>(false);
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isStartMenuOpen, setIsStartMenuOpen] = useState<boolean>(false);
  const [soundActive, setSoundActive] = useState<boolean>(true);

  const theme = THEMES[currentThemeId];

  // Clock in 90s taskbar tray
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Close start menu when clicking outside
  useEffect(() => {
    const handleClick = () => setIsStartMenuOpen(false);
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  const toggleSound = () => {
    playClickSound();
    const next = !soundActive;
    setSoundActive(next);
    setSoundEnabled(next);
  };

  const handleMenuAction = (action: string) => {
    playClickSound();
    if (action === 'calculator') {
      setActiveTab('calculator');
      setIsScientific(false);
    } else if (action === 'scientific') {
      setActiveTab('calculator');
      setIsScientific(true);
    } else if (action === 'code') setActiveTab('code');
    else if (action === 'simulator') setActiveTab('simulator');
    else if (action === 'about') setIsAboutOpen(true);
    else if (action === 'theme-win95') setCurrentThemeId('win95');
    else if (action === 'theme-motif') setCurrentThemeId('motif');
    else if (action === 'theme-mac7') setCurrentThemeId('mac7');
    else if (action === 'theme-lcd') setCurrentThemeId('lcd');
  };

  return (
    <div
      className="min-h-screen flex flex-col justify-between font-sans relative overflow-x-hidden select-none"
      style={{ backgroundColor: theme.desktopBg }}
    >
      {/* 90s Vintage Desktop Area */}
      <div className="flex-1 p-3 md:p-6 flex flex-col items-center justify-start gap-4 z-10">
        {/* Desktop Header Banner */}
        <header className="w-full max-w-4xl flex items-center justify-between gap-4 px-3 py-1.5 bevel-outset bg-[#d4d0c8] text-black">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-[#000080] text-white flex items-center justify-center font-bold text-xs bevel-thin-outset">
              Tk
            </div>
            <h1 className="font-bold text-xs md:text-sm tracking-tight truncate">
              Calculadora Retrô Tkinter Anos 90 em Python
            </h1>
          </div>

          {/* Theme Quick Switcher in Header */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="hidden sm:inline text-gray-700 text-[11px] font-mono">
              Tema Retrô:
            </span>
            <select
              value={currentThemeId}
              onChange={(e) => {
                playClickSound();
                setCurrentThemeId(e.target.value as ThemeId);
              }}
              className="bevel-thin-outset bg-white px-2 py-0.5 text-xs text-black font-semibold cursor-pointer"
            >
              <option value="win95">Windows 95 / Tkinter Clássico</option>
              <option value="motif">Motif / Unix X11 (1993)</option>
              <option value="mac7">Macintosh System 7 (1991)</option>
              <option value="lcd">Casio LCD Vintage (1989)</option>
            </select>
          </div>
        </header>

        {/* View Switcher Tabs (Simulating 90s OS App Tabs) */}
        <div className="w-full max-w-4xl flex items-center gap-1">
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('calculator');
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-none flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bevel-outset bg-[#d4d0c8] text-black border-b-0 -mb-0.5 z-20'
                : 'bevel-thin-outset bg-[#b5b1a8] text-gray-800 hover:bg-[#c4c0b6]'
            }`}
          >
            <Calculator size={14} className="text-[#000080]" />
            <span>1. Calculadora Interativa (Tkinter GUI)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('code');
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-none flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'bevel-outset bg-[#d4d0c8] text-black border-b-0 -mb-0.5 z-20'
                : 'bevel-thin-outset bg-[#b5b1a8] text-gray-800 hover:bg-[#c4c0b6]'
            }`}
          >
            <FileCode size={14} className="text-emerald-800" />
            <span>2. Código Python Tkinter (.py)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              setActiveTab('simulator');
            }}
            className={`px-4 py-1.5 text-xs font-bold transition-none flex items-center gap-1.5 ${
              activeTab === 'simulator'
                ? 'bevel-outset bg-[#d4d0c8] text-black border-b-0 -mb-0.5 z-20'
                : 'bevel-thin-outset bg-[#b5b1a8] text-gray-800 hover:bg-[#c4c0b6]'
            }`}
          >
            <Terminal size={14} className="text-amber-800" />
            <span>3. Teste das 4 Operações & Lógica</span>
          </button>
        </div>

        {/* Main Retro Application Window Frame */}
        <div className="w-full max-w-4xl z-10">
          <RetroWindow
            title={
              activeTab === 'calculator'
                ? isScientific
                  ? `Calculadora Científica Anos 90 - [${theme.name}]`
                  : `Calculadora Retrô Anos 90 - [${theme.name}]`
                : activeTab === 'code'
                ? 'Editor de Código Python - calculadora_retro.py'
                : 'Console Interativo Python 3 - 4 Operações Básicas'
            }
            theme={theme}
            icon={<Calculator size={13} />}
            menuItems={[
              {
                label: 'Arquivo',
                items: [
                  { label: 'Calculadora Padrão (4 Operações)', action: () => handleMenuAction('calculator'), shortcut: 'F1' },
                  { label: 'Calculadora Científica (Sci-95)', action: () => handleMenuAction('scientific'), shortcut: 'F4' },
                  { label: 'Ver Código Python', action: () => handleMenuAction('code'), shortcut: 'F2' },
                  { label: 'Simulador Matemático', action: () => handleMenuAction('simulator'), shortcut: 'F3' },
                  { label: 'Sair / Resetar', action: () => window.location.reload(), separator: true },
                ],
              },
              {
                label: 'Temas 90s',
                items: [
                  { label: 'Windows 95 / Tkinter Clássico', action: () => handleMenuAction('theme-win95') },
                  { label: 'Motif / Unix X11 (1993)', action: () => handleMenuAction('theme-motif') },
                  { label: 'Macintosh System 7 (1991)', action: () => handleMenuAction('theme-mac7') },
                  { label: 'Casio LCD Vintage (1989)', action: () => handleMenuAction('theme-lcd') },
                ],
              },
              {
                label: 'Ajuda',
                items: [
                  { label: 'Sobre a Calculadora Tkinter', action: () => handleMenuAction('about'), shortcut: 'Ctrl+I' },
                  { label: 'Como Executar o Script Python', action: () => handleMenuAction('code') },
                ],
              },
            ]}
            statusBarText={
              activeTab === 'calculator'
                ? isScientific
                  ? 'Modo Científico: sin, cos, tan, ln, log, xʸ, √x, n!, π, e | DEG/RAD/GRAD | Teclado Ativo'
                  : 'Operações: Adição (+), Subtração (-), Multiplicação (*), Divisão (/) | Teclado Ativo'
                : activeTab === 'code'
                ? 'Python 3.x compatível | Pronto para download'
                : 'Modo Interpretador Ativo'
            }
            className="w-full min-h-[500px]"
          >
            {/* Tab 1: Interactive 90s Tkinter Calculator */}
            {activeTab === 'calculator' && (
              <div className="py-2">
                <TkinterCalculator
                  theme={theme}
                  onShowAbout={() => setIsAboutOpen(true)}
                  onOpenPythonCode={() => setActiveTab('code')}
                  isScientific={isScientific}
                  onToggleScientific={setIsScientific}
                />
              </div>
            )}

            {/* Tab 2: Python Code Viewer */}
            {activeTab === 'code' && (
              <div className="h-[480px]">
                <PythonCodeViewer onClose={() => setActiveTab('calculator')} />
              </div>
            )}

            {/* Tab 3: Python Logic Simulator */}
            {activeTab === 'simulator' && (
              <div className="p-2 space-y-4">
                <PythonSimulator />
              </div>
            )}
          </RetroWindow>
        </div>

        {/* Informative vintage badge strip */}
        <div className="w-full max-w-4xl flex flex-wrap items-center justify-between text-[11px] text-white/90 font-mono px-2">
          <span>Estética: Relevos 3D (raised/sunken) · Paleta 1995 · Tkinter Nativo</span>
          <span>4 Operações Básicas: [ + ] [ - ] [ × ] [ ÷ ]</span>
        </div>
      </div>

      {/* About Modal Dialog */}
      <AboutDialog
        theme={theme}
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />

      {/* Authentic Windows 95 Style Taskbar at Bottom */}
      <footer className="h-9 w-full bg-[#d4d0c8] border-t-2 border-white bevel-outset flex items-center justify-between px-1.5 z-40 relative">
        {/* Start Button ("Iniciar") */}
        <div className="relative">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              playClickSound();
              setIsStartMenuOpen(!isStartMenuOpen);
            }}
            className={`px-2.5 py-1 text-xs font-bold flex items-center gap-1.5 ${
              isStartMenuOpen ? 'bevel-inset bg-[#dfdfdf]' : 'bevel-outset bg-[#d4d0c8] active:bevel-inset'
            }`}
          >
            <div className="w-3.5 h-3.5 bg-gradient-to-tr from-[#000080] to-[#008080] text-white text-[9px] font-black flex items-center justify-center leading-none">
              Py
            </div>
            <span>Iniciar</span>
          </button>

          {/* Start Menu Dropdown */}
          {isStartMenuOpen && (
            <div
              className="absolute left-0 bottom-full mb-1 w-64 bg-[#d4d0c8] bevel-outset shadow-2xl flex z-50 text-black text-xs"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left Blue Vertical Banner */}
              <div className="w-8 bg-[#000080] text-white flex items-end justify-center pb-3 font-bold">
                <span className="-rotate-90 whitespace-nowrap tracking-widest text-[11px]">
                  PYTHON 95
                </span>
              </div>

              {/* Start Menu Options */}
              <div className="flex-1 p-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsScientific(false);
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <Calculator size={14} />
                  <span>Calculadora Padrão 90s</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('calculator');
                    setIsScientific(true);
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <FlaskConical size={14} />
                  <span>Calculadora Científica 90s</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('code');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <FileCode size={14} />
                  <span>Código Python (Tkinter)</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('simulator');
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <Terminal size={14} />
                  <span>Simulador Matemático</span>
                </button>
                <div className="border-t border-[#808080] my-1" />
                <button
                  type="button"
                  onClick={() => {
                    setIsAboutOpen(true);
                    setIsStartMenuOpen(false);
                  }}
                  className="w-full text-left px-2 py-1.5 hover:bg-[#000080] hover:text-white flex items-center gap-2"
                >
                  <HelpCircle size={14} />
                  <span>Sobre o Sistema</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active Task Window Button */}
        <div className="flex-1 mx-2 flex items-center gap-1 overflow-hidden">
          <div className="bevel-inset bg-[#dfdfdf] px-3 py-0.5 text-xs font-bold text-black flex items-center gap-1.5 max-w-[220px] truncate">
            <Calculator size={13} className="text-[#000080]" />
            <span className="truncate">Calculadora Retrô 90s</span>
          </div>
        </div>

        {/* System Tray (Clock & Sound toggle) */}
        <div className="bevel-inset bg-[#d4d0c8] px-2 py-0.5 flex items-center gap-3 text-xs text-black font-mono">
          <button
            type="button"
            onClick={toggleSound}
            className="hover:opacity-75 focus:outline-none"
            title={soundActive ? 'Som ativado' : 'Som desativado'}
          >
            {soundActive ? <Volume2 size={13} /> : <VolumeX size={13} className="text-red-700" />}
          </button>
          <span className="font-bold">{currentTime || '12:00'}</span>
        </div>
      </footer>
    </div>
  );
}
