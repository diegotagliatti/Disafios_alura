# DESAFIO 1

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


# DESAFIO 2

# 🧮 Calculadora Retrô Tkinter Anos 90 (Web Emulator & Python Script)

Uma experiência nostálgica completa que recria a estética clássica das interfaces gráficas dos anos 90 (**Windows 95**, **Motif / Unix X11**, **Macintosh System 7** e **Casio LCD Vintage**). O projeto combina um **emulador web interativo em React + TypeScript** (com área de trabalho retrô, barra de tarefas, sintetizador de som mecânico e fita de auditoria) com o **código-fonte completo e independente em Python 3 + Tkinter** pronto para download e execução nativa.

---

## ✨ Funcionalidades Principais

### 1. Calculadora Interativa (Padrão & Científica)
- **4 Operações Matemáticas Básicas:** Adição (`+`), Subtração (`-`), Multiplicação (`×`) e Divisão (`÷`), com suporte a encadeamento de operações (ex.: `5 + 3 + 2 = 10`), ponto decimal (`.`), porcentagem (`%`) e inversão de sinal (`±`).
- **Proteção contra Erros:** Bloqueio automático de divisão por zero (`ZeroDivisionError`), raízes pares de números negativos, logaritmos fora de domínio e estouro de capacidade (`Overflow`), com alerta visual e aviso sonoro estilo *PC Speaker*.
- **Memória Completa:** Registradores clássicos `MC` (limpar memória), `MR` (recuperar memória), `M+` (somar à memória) e `M-` (subtrair da memória) com indicador `[M]` no visor.
- **Modo Científico (`Tkinter Sci-95`):**
  - **Unidades Angulares:** Conversão e cálculo em Graus (`DEG`), Radianos (`RAD`) e Gradianos (`GRAD`).
  - **Modificadores:** `INV` (2ª função / funções inversas) e `HYP` (funções hiperbólicas).
  - **Trigonometria:** `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`, `asinh`, `acosh`, `atanh`.
  - **Logaritmos e Exponenciais:** `ln` / `eˣ`, `log₁₀` / `10ˣ`, `log₂` / `2ˣ`.
  - **Potências, Raízes e Outras Funções:** `x²`, `x³`, `xʸ`, `√x`, `³√x`, `ʸ√x`, `1/x`, fatorial (`n!`), módulo (`mod`), valor absoluto (`|x|`), arredondamento (`⌊x⌋` / `⌈x⌉`), conversão `→RAD` / `→DEG`, constantes `π` (`2π`), `e` e gerador pseudoaleatório `Rand`.
- **Bobina de Papel Contínuo (Fita de Auditoria):** Histórico de até 50 cálculos com carimbo de horário. Clicar em qualquer item da fita recarrega o resultado diretamente no visor.

### 2. Temas Visuais Anos 90 & Áudio Sintetizado
- **4 Temas Retrô Instantâneos:**
  - 🖥️ **Windows 95 / Tkinter Clássico (1995):** Cinza *battleship* (`#d4d0c8`) e barra de título azul-marinho.
  -  workstation **Motif / Unix X11 (1993):** Visual das estações Silicon Graphics e Sun Solaris.
  - 🍏 **Macintosh System 7 (1991):** Visual monocromático minimalista com listras horizontais.
  - 📟 **Casio LCD Vintage (1989):** Display de cristal líquido esverdeado e carcaça escura.
- **Sintetizador de Som Mecânico (Web Audio API):** Efeitos sonoros gerados em tempo real (sem arquivos de áudio externos) para cliques de tecla, tecla de igual (`=`), limpeza (`C`/`CE`) e beep de erro.

### 3. Visualizador de Código Python (`.py`) & Simulador
- **Aba "Código Python Tkinter (.py)":** Exibe o script completo `calculadora_retro.py`, permite copiar para a área de transferência ou baixar o arquivo `.py`, além de explicar a arquitetura do Tkinter (`relief="raised"`, `relief="sunken"`, `grid`) e detalhar as 4 operações.
- **Aba "Teste das 4 Operações & Lógica":** Um console interativo que simula o interpretador Python 3 avaliando expressões `a op b` e demonstrando o bloco `try / except ZeroDivisionError`.

---

## 🚀 Como Executar o Projeto

Você pode executar o projeto de **três formas**:
1. **Executável Direto (`CalculadoraRetro.exe`)** *(Recomendado no Windows — sem precisar usar terminal)*
2. **Aplicação Web Interativa via Node.js (`npm run dev`)**
3. **Script Python Nativo (`calculadora_retro.py` com `Tkinter`)**

---

### Opção 1: Pelo Executável (`CalculadoraRetro.exe`) — Mais Rápido ⚡

O projeto inclui na pasta raiz o executável nativo **`CalculadoraRetro.exe`**, que possui uma **Central de Execução no estilo Windows 95** e um **servidor web local integrado** (não exige abrir o terminal manualmente).

#### Como usar:
1. Dê um **duplo clique** no arquivo **`CalculadoraRetro.exe`** na pasta raiz do projeto.
2. Na janela **Central de Execução — Calculadora Retrô Anos 90**, escolha uma das opções com 1 clique:
   - **🌐 1. Abrir Aplicação Web Completa (Navegador):** Inicia automaticamente o servidor local embutido (`http://localhost:3000`) servindo a build do projeto e abre o emulador completo no seu navegador padrão.
   - **🐍 2. Abrir Calculadora Nativa Desktop (Python Tkinter):** Executa diretamente o arquivo `calculadora_retro.py` em uma janela nativa do Windows (sem tela preta de console).
   - **💻 3. Iniciar Servidor Vite de Desenvolvimento (`npm run dev`):** Abre o servidor de desenvolvimento Vite com *Hot Reload*.

#### Argumentos de Linha de Comando (Opcional):
Você também pode chamar o executável pelo terminal passando parâmetros diretos:
```powershell
# Abre a Central de Execução e já lança o Emulador Web no navegador automaticamente
.\CalculadoraRetro.exe --web

# Abre diretamente a Calculadora Nativa Python Tkinter sem exibir o menu inicial
.\CalculadoraRetro.exe --python
```

---

### Opção 2: Rodar a Aplicação Web via Terminal (React + Vite)

#### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
- `npm` (incluso com o Node.js)

#### Passo a Passo
1. Abra o terminal na pasta raiz do projeto:
   ```bash
   cd pasta-onde-foi-baixado
   ```
2. Instale as dependências (caso ainda não estejam instaladas):
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
4. Acesse no navegador:
   ```text
   http://localhost:3000
   ```

#### Outros Scripts Disponíveis no `package.json`
| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor Vite na porta `3000` (`http://localhost:3000`). |
| `npm run build` | Gera a versão otimizada de produção na pasta `dist/` (usada pelo `CalculadoraRetro.exe`). |
| `npm run preview` | Serve localmente a build de produção gerada em `dist/`. |
| `npm run lint` | Executa a verificação de tipos do TypeScript (`tsc --noEmit`). |

---

### Opção 3: Rodar a Calculadora Nativa em Python (`Tkinter`)

O script **`calculadora_retro.py`** já está disponível diretamente na raiz do projeto (e também pode ser copiado ou baixado pela aba **"2. Código Python Tkinter (.py)"** da interface web). Ele utiliza exclusivamente as bibliotecas nativas `tkinter` e `math` (não requer `pip install`).

Execute o script de acordo com o seu sistema operacional:

- **Windows:**
  ```powershell
  python calculadora_retro.py
  ```
  > 💡 **Dica:** Você também pode abrir pelo botão **2** do `CalculadoraRetro.exe` para rodá-lo sem exibir a janela do prompt de comando!

- **Linux (Ubuntu / Debian / Fedora):**
  ```bash
  # Caso o pacote tk não esteja instalado: sudo apt install python3-tk
  python3 calculadora_retro.py
  ```

- **macOS:**
  ```bash
  # Caso necessário: brew install python-tk
  python3 calculadora_retro.py
  ```

---

## 🧪 Roteiro Completo para Testar a Calculadora

Utilize este checklist passo a passo para validar todos os recursos da calculadora:

### 1. Teste das 4 Operações Básicas e Encadeamento
| Caso de Teste | Sequência de Entrada | Resultado Esperado no Visor |
| :--- | :--- | :--- |
| **Adição Simples** | `1` `5` `0` `+` `3` `5` `0` `=` | `500` (Visor superior: `150 + 350 =`) |
| **Subtração com Resultado Negativo** | `2` `5` `-` `8` `0` `=` | `-55` |
| **Multiplicação Decimal** | `1` `2` `.` `5` `×` `4` `=` | `50` |
| **Divisão Exata e Decimal** | `4` `8` `÷` `6` `=` / `1` `÷` `8` `=` | `8` / `0.125` |
| **Encadeamento de Operações** | `1` `0` `+` `5` `×` `2` `=` | Ao clicar em `×`, exibe parcial `15`; após `2` `=`, exibe `30` |
| **Inversão de Sinal (`±`)** | `4` `2` `±` | `-42` (clicar novamente retorna para `42`) |
| **Porcentagem Isolada (`%`)** | `5` `0` `%` | `0.5` |
| **Porcentagem sobre Operando (`%`)** | `2` `0` `0` `+` `1` `0` `%` `=` | `10%` de `200` vira `20`; ao pressionar `=`, retorna `220` |
| **Limpeza Parcial (`CE`) vs Total (`C`)** | `5` `0` `+` `9` `9` `CE` `2` `5` `=` | `CE` apaga apenas o `99` e mantém `50 +`, resultando em `75` |
| **Backspace (`⌫`)** | `1` `2` `3` `⌫` | `12` |

### 2. Teste de Proteção contra Erros (Edge Cases)
| Caso de Teste | Sequência de Entrada | Comportamento Esperado |
| :--- | :--- | :--- |
| **Divisão por Zero** | `1` `0` `0` `÷` `0` `=` | Visor exibe `ERRO`, banner vermelho *"Divisão por zero não é permitida!"* e som de alerta. |
| **Divisão por Zero Encadeada** | `5` `0` `÷` `0` `+` | Interrompe imediatamente e exibe `ERRO`. |
| **Raiz Quadrada Negativa (Modo Científico)** | `9` `±` `√x` | Exibe `ERRO` e alerta *"Raiz quadrada de número negativo não é real!"*. |
| **Logaritmo Não-Positivo (Modo Científico)** | `0` `ln` ou `0` `log` | Exibe `ERRO` e alerta que logaritmo requer número `> 0`. |
| **Fatorial Inválido / Estouro** | `1` `7` `1` `n!` | Exibe `ERRO` e alerta *"Estouro de capacidade (máx 170!)"*. |

### 3. Teste de Memória (`MC`, `MR`, `M+`, `M-`) e Fita de Papel
1. Digite `100` e clique em **`M+`** → O indicador **`[M]`** deve acender no canto superior esquerdo do visor.
2. Digite `25` e clique em **`M-`** → O valor interno na memória passa a ser `75`.
3. Clique em **`C`** para zerar o visor (`0`) e depois clique em **`MR`** → O visor deve exibir `75`.
4. Clique em **`MC`** → O indicador **`[M]`** desaparece e a memória é zerada.
5. Clique no botão **`Fita (N)`** no topo da calculadora → Verifique se todas as operações aparecem registradas na **Bobina de Cálculo** amarela e clique sobre qualquer linha para recarregar seu resultado no visor.

### 4. Teste da Calculadora Científica (`Sci-95`)
1. Abra o modo científico clicando no botão azul **`Científica`** (ou pelo menu `Arquivo > Calculadora Científica` / menu `Iniciar`).
2. **Teste de Unidades Angulares (`DEG`, `RAD`, `GRAD`):**
   - Com **`Graus (DEG)`** selecionado: digite `30` e clique em `sin` → Resultado: `0.5`.
   - Com **`Graus (DEG)`** selecionado: digite `180` e clique em `sin` → Resultado: `0` (com limpeza de resíduo de ponto flutuante).
   - Selecione **`Radianos (RAD)`**: clique em `π` e depois em `cos` → Resultado: `-1`.
3. **Teste de Modificadores (`INV` e `HYP`):**
   - Ative **`INV`**: observe os botões mudarem para `asin`, `acos`, `atan`, `eˣ`, `10ˣ`, `2ˣ`, `2π`, `→DEG`, `⌈x⌉`.
   - Com `DEG` e `INV` ativos: digite `0.5` e clique em `asin` → Resultado: `30`.
4. **Teste de Operações Binárias Científicas:**
   - **Potência (`xʸ`):** Digite `2` → `xʸ` → `10` → `=` → Resultado: `1024`.
   - **Raiz de Índice *y* (`ʸ√x`):** Digite `27` → `ʸ√x` → `3` → `=` → Resultado: `3`.
   - **Módulo (`mod`):** Digite `17` → `mod` → `5` → `=` → Resultado: `2`.

### 5. Teste de Atalhos do Teclado Físico
Com a calculadora ativa na tela, teste digitar diretamente no teclado do seu computador:

| Tecla Física | Ação na Calculadora |
| :--- | :--- |
| `0` a `9` | Insere dígitos no visor |
| `.` ou `,` | Insere ponto decimal |
| `+`, `-`, `*` (ou `x`), `/` | Seleciona uma das 4 operações básicas |
| `Enter` ou `=` | Calcula o resultado (`=`) |
| `Backspace` | Apaga o último dígito (`⌫`) |
| `Escape` (`Esc`) | Limpa todos os registradores (`C`) |
| `%` | Calcula porcentagem |
| `s`, `c`, `t` *(Modo Científico)* | Calcula `sin`, `cos`, `tan` |
| `l`, `n` *(Modo Científico)* | Calcula `log` (base 10) e `ln` (log natural) |
| `r`, `!`, `p`, `^` *(Modo Científico)* | Calcula `√x`, `n!`, constante `π` e potência `xʸ` |

### 6. Teste do Simulador Matemático (Aba 3)
1. Clique na aba **"3. Teste das 4 Operações & Lógica"**.
2. Altere os campos **Operando A**, **Operador** e **Operando B**, ou clique nos botões de exemplos rápidos (`150 + 350`, `1000 - 275`, `16 * 16`, `48 / 6`, `100 / 0 (ZeroDiv)`).
3. Verifique o trecho de código Python gerado em tempo real e a simulação do tratamento de `ZeroDivisionError`.

---

## 📁 Estrutura de Arquivos do Projeto

```text
/
├── CalculadoraRetro.exe                        # Executável Windows (Central de Execução + Servidor Web integrado)
├── calculadora_retro.py                        # Script Python 3 + Tkinter standalone pronto para execução nativa
├── dist/                                       # Build otimizada da aplicação web servida pelo CalculadoraRetro.exe
├── index.html                                  # Página HTML principal e fontes retrô (VT323, Share Tech Mono, Silkscreen)
├── metadata.json                               # Metadados da aplicação
├── package.json                                # Dependências e scripts npm (React 19, Vite, Tailwind CSS, Lucide)
├── tsconfig.json                               # Configurações do TypeScript
├── vite.config.ts                              # Configuração do bundler Vite e plugin Tailwind
└── src/
    ├── main.tsx                                # Ponto de entrada do React
    ├── App.tsx                                 # Área de trabalho anos 90, barra de tarefas, menu Iniciar e abas
    ├── index.css                               # Utilitários de bordas 3D chanfradas (bevel-outset / bevel-inset) e scanlines
    ├── types.ts                                # Tipagens TypeScript (temas, histórico e operações)
    ├── components/
    │   ├── RetroWindow.tsx                     # Moldura de janela estilo Windows 95 / Tkinter com barra de menus e status
    │   ├── TkinterCalculator.tsx               # Calculadora padrão de 4 operações, memória e bobina de papel
    │   ├── TkinterScientificCalculator.tsx     # Calculadora científica Sci-95 com painel duplo
    │   ├── PythonCodeViewer.tsx                # Visualizador do código .py, instruções de execução e guia de arquitetura
    │   ├── PythonSimulator.tsx                 # Simulador interativo de expressões Python e tratamento de exceções
    │   └── AboutDialog.tsx                     # Caixa de diálogo modal "Sobre a Calculadora"
    ├── data/
    │   └── pythonCode.ts                       # Script Python Tkinter completo (CalculadoraRetro90s + CalculadoraCientifica90s)
    └── utils/
        ├── audio.ts                            # Sintetizador de efeitos sonoros retrô via Web Audio API
        └── themes.ts                           # Definições de cores e fontes dos 4 temas retrô (win95, motif, mac7, lcd)
# DESAFIO 3

# Quadro Kanban Retrô (`KANBAN.EXE`)

Uma aplicação desktop de gerenciamento de tarefas estilo **Trello / Kanban** com **visual Retrô (inspirado no Windows 95/98)**, desenvolvida **100% em Python** utilizando apenas bibliotecas nativas (`tkinter`, `unittest`, `json`, `webbrowser`).

---

## Funcionalidades

- **Quadro estilo Trello com 3 Barras:**
  - `[ ] NÃO INICIADO`
  - `[~] EM ANDAMENTO`
  - `[X] CONCLUÍDO`
- **Menu de Nova Tarefa (`[ + ADICIONAR TAREFA ]`):**
  - Abre uma janela dedicada para cadastrar o **Título da Atividade**, **Link do Google Docs**, **Link de Página Web** (um dos dois, ambos ou nenhum) e a **Barra Inicial**.
- **Edição Completa com Clique Direito:**
  - Ao clicar com o **botão direito do mouse** em qualquer cartão de tarefa, abre o menu de edição completa permitindo alterar o título, o link do Google Docs, o link da página web e a barra/status atual.
- **Links Clicáveis Integrados:**
  - Cada atividade exibe botões `[DOC]` e/ou `[WEB]` (quando preenchidos) que abrem os respectivos links diretamente no navegador padrão.
- **Ações Rápidas no Cartão:**
  - Avançar (`>>`) ou voltar (`<<`) a atividade entre as barras.
  - Concluir diretamente (`[OK] Concluir`), movendo a tarefa para a barra **Concluído**.
  - Remover a tarefa (`[X] Remover`).
- **Persistência Automática:**
  - Todas as tarefas e alterações são salvas automaticamente no arquivo local `tasks.json`.

---

## Estrutura do Projeto

```text
Desafio3/
├── app.py            # Interface gráfica Retrô (Tkinter) do Quadro Kanban
├── task_manager.py   # Modelo de dados (Task) e regras de negócio/persistência (TaskManager)
├── test_app.py       # Suíte de testes unitários e de integração da interface
├── tasks.json        # Arquivo gerado automaticamente para salvar as atividades
└── README.md         # Documentação do projeto
```

---

## Pré-requisitos

- **Python 3.8+** instalado (com suporte ao `tkinter`, já incluso na instalação padrão do Python).
- Nenhuma biblioteca externa (`pip install`) é necessária.

---

## Como Executar a Aplicação

### Opção 1: Executável Compilado (`.exe` — não precisa de Python instalado)
Basta dar dois cliques no executável gerado em:
- **`dist/KANBAN.exe`**

Ou pelo terminal:
```powershell
.\dist\KANBAN.exe
```

### Opção 2: Pelo Código-Fonte Python
No terminal, dentro da pasta do projeto, execute:

```bash
python app.py
```

### Como Recompilar o `.exe`
Caso faça alterações no código e queira gerar um novo `KANBAN.exe`:
```powershell
.\.venv\Scripts\pyinstaller.exe --noconfirm --onefile --windowed --name KANBAN app.py
```

### Como Usar na Interface
1. Clique no botão **`[ + ADICIONAR TAREFA ]`** no topo da janela.
2. Preencha o título, adicione opcionalmente um link do **Google Docs** e/ou de uma **Página Web**, escolha a barra inicial e clique em **`[ ADICIONAR TAREFA ]`**.
3. Use os botões **`<<`**, **`>>`** ou **`[OK] Concluir`** no cartão para movimentar a atividade pelas 3 barras.
4. Clique em **`[DOC]`** ou **`[WEB]`** dentro do cartão para abrir os links no navegador.
5. **Clique com o botão direito** sobre qualquer cartão para abrir o **Menu de Edição Completa da Tarefa**.

---

## Como Executar os Testes Automatizados

Para rodar todos os testes unitários e de interface gráfica:

```bash
python -m unittest discover -v
```

Ou diretamente:

```bash
python test_app.py
```

```

