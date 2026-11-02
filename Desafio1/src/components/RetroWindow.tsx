import React, { ReactNode } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { ThemeConfig } from '../types';

interface RetroWindowProps {
  title: string;
  theme: ThemeConfig;
  children: ReactNode;
  isActive?: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  icon?: ReactNode;
  menuItems?: {
    label: string;
    items: { label: string; action: () => void; shortcut?: string; separator?: boolean }[];
  }[];
  statusBarText?: string;
  className?: string;
}

export const RetroWindow: React.FC<RetroWindowProps> = ({
  title,
  theme,
  children,
  isActive = true,
  onClose,
  onMinimize,
  icon,
  menuItems,
  statusBarText,
  className = '',
}) => {
  const [openMenuIndex, setOpenMenuIndex] = React.useState<number | null>(null);

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setOpenMenuIndex(null);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <div
      className={`bevel-outset flex flex-col select-none ${className}`}
      style={{ backgroundColor: theme.windowBg }}
    >
      {/* Title Bar */}
      <div
        className="flex items-center justify-between px-2 py-1 gap-2 border-b border-black/20"
        style={{
          background: isActive ? theme.titleBarGradient : '#808080',
          color: theme.titleBarText,
        }}
      >
        <div className="flex items-center gap-1.5 font-bold text-xs tracking-wide truncate">
          {icon && <span className="shrink-0">{icon}</span>}
          <span className="truncate">{title}</span>
        </div>

        {/* Windows 95 / Tkinter control buttons */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onMinimize?.();
            }}
            className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black flex items-center justify-center hover:bg-[#dfdfdf] active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
            title="Minimizar"
          >
            <Minus size={10} strokeWidth={3} />
          </button>
          <button
            type="button"
            className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black flex items-center justify-center hover:bg-[#dfdfdf] active:border-t-black active:border-l-black active:border-r-white active:border-b-white"
            title="Maximizar"
          >
            <Square size={9} strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            className="w-4 h-4 bg-[#c0c0c0] text-black border-t border-l border-white border-r border-b border-black flex items-center justify-center hover:bg-[#d04040] hover:text-white active:border-t-black active:border-l-black active:border-r-white active:border-b-white ml-0.5"
            title="Fechar"
          >
            <X size={10} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Retro Menu Bar */}
      {menuItems && menuItems.length > 0 && (
        <div className="relative flex items-center gap-1 px-1 py-0.5 text-xs text-black border-b border-[#808080] bg-[#d4d0c8]">
          {menuItems.map((menu, idx) => (
            <div key={menu.label} className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuIndex(openMenuIndex === idx ? null : idx);
                }}
                className={`px-2 py-0.5 rounded-none text-xs hover:bg-[#000080] hover:text-white ${
                  openMenuIndex === idx ? 'bg-[#000080] text-white' : 'text-black'
                }`}
              >
                <span className="underline">{menu.label.charAt(0)}</span>
                {menu.label.slice(1)}
              </button>

              {/* Dropdown Menu */}
              {openMenuIndex === idx && (
                <div
                  className="absolute left-0 top-full mt-0.5 z-50 min-w-44 bg-[#d4d0c8] text-black bevel-outset py-1 shadow-md"
                  onClick={(e) => e.stopPropagation()}
                >
                  {menu.items.map((item, itemIdx) => (
                    <React.Fragment key={item.label + itemIdx}>
                      {item.separator && <div className="border-t border-[#808080] my-1" />}
                      <button
                        type="button"
                        onClick={() => {
                          item.action();
                          setOpenMenuIndex(null);
                        }}
                        className="w-full text-left px-3 py-1 text-xs hover:bg-[#000080] hover:text-white flex items-center justify-between group"
                      >
                        <span>{item.label}</span>
                        {item.shortcut && (
                          <span className="text-[10px] text-gray-500 group-hover:text-white/80 ml-4">
                            {item.shortcut}
                          </span>
                        )}
                      </button>
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Main Window Content */}
      <div className="p-2 flex-1 flex flex-col">{children}</div>

      {/* Status Bar */}
      {statusBarText && (
        <div className="px-2 py-0.5 text-[11px] text-[#202020] border-t border-[#808080] bg-[#d4d0c8] bevel-thin-inset flex items-center justify-between font-mono">
          <span>{statusBarText}</span>
          <span className="text-[10px] text-gray-500">Tkinter 8.6</span>
        </div>
      )}
    </div>
  );
};
