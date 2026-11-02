# 🧮 Calculadora Retrô Tkinter Anos 90

Uma aplicação web interativa que recria a experiência nostálgica dos sistemas operacionais dos anos 90 (**Windows 95**, **Motif / Unix X11**, **Macintosh System 7** e **Casio LCD Vintage**), apresentando um emulador fiel de uma calculadora construída com **Python + Tkinter**, um visualizador/exportador do código-fonte original `.py` e um simulador interativo da lógica matemática do Python.

---

## ✨ Funcionalidades Principais

### 1. 🖥️ Emulador Interativo da Calculadora (Tkinter GUI)
- **As 4 Operações Matemáticas Básicas:** Adição (`+`), Subtração (`-`), Multiplicação (`×`) e Divisão (`÷`), com suporte a cálculos encadeados e **proteção contra divisão por zero**.
- **Funções de Memória e Utilidades:** Botões `MC`, `MR`, `M+`, `M-`, inversão de sinal (`±`), porcentagem (`%`), limpar entrada (`CE`), limpar tudo (`C`) e apagar dígito (`⌫`).
- **Bobina de Papel Contínuo (Fita de Auditoria):** Histórico completo das operações realizadas com carimbo de horário e possibilidade de clicar em um cálculo anterior para reutilizar o resultado no visor.
- **Suporte Completo ao Teclado Físico:** Digite números, operadores (`+`, `-`, `*`, `/`), `Enter` (`=`), `Backspace` e `Esc` diretamente pelo teclado com feedback visual nos botões.
- **Sintetizador de Áudio Retrô (Web Audio API):** Efeitos sonoros mecânicos de clique de tecla, som de cálculo concluído e bipe clássico de erro de *PC Speaker* (sem dependências externas de áudio).

### 2. 🎨 4 Temas Clássicos dos Anos 90
Alterne em tempo real entre diferentes estéticas históricas da computação:
- **Windows 95 / Tkinter Clássico (1995):** Cinza *Battleship* (`#d4d0c8`), bordas biseladas 3D (`raised`/`sunken`) e barra de título azul-marinho.
- **Motif / Unix X11 (1993):** Inspirado nas estações de trabalho Silicon Graphics (SGI) e Sun Solaris.
- **Macintosh System 7 (1991):** Visual clássico monocromático com listras horizontais na barra de título.
- **Casio LCD Vintage (1989):** Display de cristal líquido esverdeado com tipografia segmentada e carcaça escura.

### 3. 🐍 Visualizador e Exportador de Código Python (`calculadora_retro.py`)
- **Código-Fonte Completo e Independente:** Visualize, copie para a área de transferência ou baixe diretamente o arquivo `calculadora_retro.py` pronto para rodar em Python 3 (utilizando apenas a biblioteca nativa `tkinter`, sem necessidade de `pip install`).
- **Guia de Execução Multiplataforma:** Instruções passo a passo para executar o script no **Windows**, **Linux** e **macOS** (incluindo a dica de extensão `.pyw` para abrir sem terminal no Windows).
- **Anatomia do Tkinter & Explicação das Operações:** Documentação interativa detalhando widgets, relevos 3D (`relief="raised"`, `relief="sunken"`), gerenciamento de layout (`grid` e `pack`) e tratamento de exceções (`ZeroDivisionError`).

### 4. 🧪 Simulador Interativo da Lógica Python
- Teste valores para o `Operando A`, `Operador` e `Operando B`, visualize em tempo real o trecho de código Python equivalente (`try / except ZeroDivisionError`) e execute presets rápidos de teste.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) + CSS customizado para bordas 3D clássicas (`bevel-outset` / `bevel-inset`)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Áudio:** Web Audio API nativa (sintetizador de ondas sonoras em tempo real)
- **Script Exportável:** Python 3.6+ (`tkinter` nativo)

---

## 📁 Estrutura do Projeto

```text
├── index.html                        # Página principal e importação das fontes retrô
├── metadata.json                     # Metadados da aplicação
├── package.json                      # Dependências e scripts npm
├── tsconfig.json                     # Configuração do TypeScript
├── vite.config.ts                    # Configuração do Vite
└── src/
    ├── main.tsx                      # Ponto de entrada do React
    ├── App.tsx                       # Área de trabalho anos 95, barra de tarefas, menu Iniciar e abas
    ├── index.css                     # Estilos globais e utilitários de relevo 3D (bevel)
    ├── types.ts                      # Definições de tipos TypeScript (temas, histórico, operações)
    ├── components/
    │   ├── AboutDialog.tsx           # Modal "Sobre" estilo caixa de diálogo clássica
    │   ├── PythonCodeViewer.tsx      # Visualizador de código Python, download .py e guias didáticos
    │   ├── PythonSimulator.tsx       # Simulador interativo das 4 operações e exceções Python
    │   ├── RetroWindow.tsx           # Componente de janela com barra de título, menus e barra de status
    │   └── TkinterCalculator.tsx     # Calculadora interativa com visor LCD/CRT e bobina de papel
    ├── data/
    │   └── pythonCode.ts             # Código-fonte completo do script Python Tkinter e textos explicativos
    └── utils/
        ├── audio.ts                  # Sintetizador de efeitos sonoros retrô via Web Audio API
        └── themes.ts                 # Configurações visuais dos 4 temas anos 90
```

---

## 🚀 Como Executar o Projeto Web Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- `npm` (incluído com o Node.js)

### Passo a Passo

1. **Instale as dependências do projeto:**
   ```bash
   npm install
   ```

2. **(Opcional) Configure as variáveis de ambiente:**
   Caso utilize recursos integrados ao AI Studio, crie um arquivo `.env.local` baseado no `.env.example`:
   ```env
   GEMINI_API_KEY="SUA_CHAVE_AQUI"
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra `http://localhost:3000` para utilizar a aplicação.

### Scripts Disponíveis
- `npm run dev` — Inicia o servidor de desenvolvimento Vite na porta `3000`.
- `npm run build` — Gera a versão otimizada para produção na pasta `dist/`.
- `npm run preview` — Visualiza localmente o build de produção.
- `npm run lint` — Executa a verificação de tipos do TypeScript (`tsc --noEmit`).

---

## 🐍 Como Executar a Calculadora Nativa em Python (`calculadora_retro.py`)

Se desejar rodar a calculadora diretamente no seu sistema operacional usando Python:

1. Na interface web, acesse a aba **"2. Código Python Tkinter (.py)"** e clique no botão **"Baixar .py"** (ou copie o código para um arquivo chamado `calculadora_retro.py`).
2. Verifique se o Python 3 está instalado:
   ```bash
   python --version
   ```
3. Execute o script no terminal:
   ```bash
   python calculadora_retro.py
   ```
   > **Nota para usuários Linux (Ubuntu/Debian):** Caso o módulo `tkinter` não esteja instalado por padrão, instale-o com `sudo apt-get install python3-tk`.
   >
   > **Dica para Windows:** Renomeie o arquivo para `calculadora_retro.pyw` para abri-lo com duplo clique sem exibir a janela do prompt de comando.

### 📦 Executável `.exe` para Windows (Sem instalar nada)

O projeto também conta com a versão compilada da calculadora para Windows:
- **Caminho do executável:** [`dist/CalculadoraRetro90s.exe`](dist/CalculadoraRetro90s.exe)
- Basta dar um **duplo clique** em `CalculadoraRetro90s.exe` para abrir a janela nativa da calculadora (não requer Python nem navegador instalado).

Para recompilar o `.exe` a partir do arquivo [`calculadora_retro.py`](calculadora_retro.py):
```powershell
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\pyinstaller --onefile --noconsole --name CalculadoraRetro90s calculadora_retro.py
```

---

## ⌨️ Atalhos de Teclado na Calculadora

| Tecla | Ação na Calculadora |
| :--- | :--- |
| `0` a `9` | Insere dígitos numéricos |
| `.` ou `,` | Insere ponto decimal |
| `+`, `-`, `*` (ou `x`), `/` | Seleciona a operação matemática |
| `Enter` ou `=` | Calcula o resultado |
| `Backspace` | Apaga o último dígito (`⌫`) |
| `Esc` | Limpa todo o cálculo (`C`) |
| `%` | Calcula porcentagem |
