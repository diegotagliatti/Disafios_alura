/**
 * Código Python Tkinter completo para a Calculadora Retrô Anos 90.
 * Este script é 100% funcional, independente e compatível com Python 3 em
 * Windows, macOS e Linux.
 */

export const PYTHON_TKINTER_CODE = `#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Calculadora Retrô Anos 90 em Python com Tkinter
------------------------------------------------
Desenvolvida com a estética visual clássica dos anos 90 (estilo Windows 95 / Motif / X11).
Realiza com precisão as quatro operações matemáticas básicas:
  [+] Adição
  [-] Subtração
  [*] Multiplicação
  [/] Divisão (com proteção contra divisão por zero)

Recursos retrô adicionais:
  - Botões 3D com relevo em alto-relevo (relief='raised', bd=3)
  - Display digital LCD afundado (relief='sunken', bd=3)
  - Suporte completo a atalhos de teclado (Teclado numérico, Enter, Backspace, Esc)
  - Memória de cálculo clássica (MC, MR, M+, M-)
  - Barra de menus clássica (Arquivo, Ajuda)
"""

import tkinter as tk
from tkinter import messagebox


class CalculadoraRetro90s:
    """Classe principal da Calculadora com interface Tkinter retrô anos 90."""

    def __init__(self, root: tk.Tk):
        self.root = root
        self.root.title("Calculadora Retrô v1.0 - 1995")
        self.root.geometry("340x480")
        self.root.resizable(False, False)

        # Paleta de cores clássica anos 90 (Battleship Grey / Windows 95)
        self.COR_FUNDO = "#d4d0c8"         # Cinza base clássico
        self.COR_DISPLAY = "#ffffff"       # Fundo branco do visor
        self.COR_TEXTO_DISP = "#000000"    # Texto preto do visor
        self.COR_BOTAO = "#e0dfdb"         # Superfície dos botões numéricos
        self.COR_OPERACAO = "#d0cfc9"      # Superfície dos botões de operação
        self.COR_DESTAQUE = "#b03030"      # Vermelho retrô para tecla C
        self.COR_IGUAL = "#204080"         # Azul clássico para tecla =

        # Configura o fundo da janela principal
        self.root.configure(bg=self.COR_FUNDO)

        # Estados da calculadora
        self.valor_atual = "0"
        self.operando_anterior = None
        self.operacao_pendente = None
        self.novo_numero = True
        self.memoria = 0.0

        # Cria a barra de menu retrô
        self._criar_menu()

        # Cria o display digital (afundado / sunken)
        self._criar_display()

        # Cria a grade de botões (em relevo / raised)
        self._criar_botoes()

        # Vincula os eventos do teclado físico
        self._configurar_teclado()

    def _criar_menu(self):
        """Cria a barra de menu estilo anos 90."""
        menu_bar = tk.Menu(self.root)

        # Menu Arquivo
        menu_arquivo = tk.Menu(menu_bar, tearoff=0)
        menu_arquivo.add_command(label="Limpar Tudo (Esc)", command=self.limpar_tudo)
        menu_arquivo.add_separator()
        menu_arquivo.add_command(label="Sair", command=self.root.quit)
        menu_bar.add_cascade(label="Arquivo", menu=menu_arquivo)

        # Menu Editar
        menu_editar = tk.Menu(menu_bar, tearoff=0)
        menu_editar.add_command(label="Copiar Valor", command=self.copiar_valor)
        menu_bar.add_cascade(label="Editar", menu=menu_editar)

        # Menu Ajuda
        menu_ajuda = tk.Menu(menu_bar, tearoff=0)
        menu_ajuda.add_command(label="Sobre a Calculadora", command=self.mostrar_sobre)
        menu_bar.add_cascade(label="Ajuda", menu=menu_ajuda)

        self.root.config(menu=menu_bar)

    def _criar_display(self):
        """Cria o display numérico com borda afundada (sunken relief)."""
        frame_display = tk.Frame(
            self.root,
            bg=self.COR_FUNDO,
            padx=10,
            pady=10
        )
        frame_display.pack(fill=tk.X)

        # Indicador de operação / memória superior
        self.label_info = tk.Label(
            frame_display,
            text="",
            anchor="e",
            font=("Courier", 10),
            bg=self.COR_FUNDO,
            fg="#404040"
        )
        self.label_info.pack(fill=tk.X, pady=(0, 2))

        # Visor principal com relevo afundado clássico
        self.display = tk.Label(
            frame_display,
            text="0",
            anchor="e",
            bg=self.COR_DISPLAY,
            fg=self.COR_TEXTO_DISP,
            font=("Courier", 22, "bold"),
            relief="sunken",
            bd=3,
            padx=8,
            pady=6
        )
        self.display.pack(fill=tk.X)

    def _criar_botoes(self):
        """Cria os botões com estética 3D beveled dos anos 90."""
        frame_botoes = tk.Frame(
            self.root,
            bg=self.COR_FUNDO,
            padx=10,
            pady=5
        )
        frame_botoes.pack(fill=tk.BOTH, expand=True)

        # Layout da grade de botões (Linha, Coluna, Texto, Comando, Cor, Colspan)
        botoes = [
            # Linha 0: Funções de Memória
            ("MC", self.memoria_limpar, self.COR_OPERACAO, "#000000", 0, 0, 1),
            ("MR", self.memoria_recuperar, self.COR_OPERACAO, "#000000", 0, 1, 1),
            ("M+", self.memoria_adicionar, self.COR_OPERACAO, "#000000", 0, 2, 1),
            ("M-", self.memoria_subtrair, self.COR_OPERACAO, "#000000", 0, 3, 1),

            # Linha 1: Funções de Limpeza e Divisão
            ("C", self.limpar_tudo, self.COR_DESTAQUE, "#ffffff", 1, 0, 1),
            ("CE", self.limpar_entrada, self.COR_OPERACAO, "#000000", 1, 1, 1),
            ("⌫", self.backspace, self.COR_OPERACAO, "#000000", 1, 2, 1),
            ("÷", lambda: self.definir_operacao("/"), self.COR_OPERACAO, "#000080", 1, 3, 1),

            # Linha 2: 7, 8, 9, Multiplicação
            ("7", lambda: self.digitar_numero("7"), self.COR_BOTAO, "#000000", 2, 0, 1),
            ("8", lambda: self.digitar_numero("8"), self.COR_BOTAO, "#000000", 2, 1, 1),
            ("9", lambda: self.digitar_numero("9"), self.COR_BOTAO, "#000000", 2, 2, 1),
            ("×", lambda: self.definir_operacao("*"), self.COR_OPERACAO, "#000080", 2, 3, 1),

            # Linha 3: 4, 5, 6, Subtração
            ("4", lambda: self.digitar_numero("4"), self.COR_BOTAO, "#000000", 3, 0, 1),
            ("5", lambda: self.digitar_numero("5"), self.COR_BOTAO, "#000000", 3, 1, 1),
            ("6", lambda: self.digitar_numero("6"), self.COR_BOTAO, "#000000", 3, 2, 1),
            ("-", lambda: self.definir_operacao("-"), self.COR_OPERACAO, "#000080", 3, 3, 1),

            # Linha 4: 1, 2, 3, Adição
            ("1", lambda: self.digitar_numero("1"), self.COR_BOTAO, "#000000", 4, 0, 1),
            ("2", lambda: self.digitar_numero("2"), self.COR_BOTAO, "#000000", 4, 1, 1),
            ("3", lambda: self.digitar_numero("3"), self.COR_BOTAO, "#000000", 4, 2, 1),
            ("+", lambda: self.definir_operacao("+"), self.COR_OPERACAO, "#000080", 4, 3, 1),

            # Linha 5: ±, 0, ., Igual
            ("±", self.inverter_sinal, self.COR_OPERACAO, "#000000", 5, 0, 1),
            ("0", lambda: self.digitar_numero("0"), self.COR_BOTAO, "#000000", 5, 1, 1),
            (".", self.digitar_ponto, self.COR_BOTAO, "#000000", 5, 2, 1),
            ("=", self.calcular_resultado, self.COR_IGUAL, "#ffffff", 5, 3, 1),
        ]

        # Configura proporção uniforme para as 4 colunas
        for col in range(4):
            frame_botoes.grid_columnconfigure(col, weight=1, uniform="col")

        # Configura proporção para as 6 linhas
        for row in range(6):
            frame_botoes.grid_rowconfigure(row, weight=1, uniform="row")

        # Instancia cada botão com relevo 'raised' e borda de 3px (Tkinter 90s clássico)
        for texto, comando, cor_fundo, cor_texto, row, col, span in botoes:
            btn = tk.Button(
                frame_botoes,
                text=texto,
                command=comando,
                font=("MS Sans Serif", 12, "bold"),
                bg=cor_fundo,
                fg=cor_texto,
                activebackground="#b8b5af",
                activeforeground=cor_texto,
                relief="raised",
                bd=3,
                cursor="hand2"
            )
            btn.grid(
                row=row,
                column=col,
                columnspan=span,
                padx=3,
                pady=3,
                sticky="nsew"
            )

    def _configurar_teclado(self):
        """Mapeia eventos de teclas do teclado físico."""
        self.root.bind("<Key>", self._tratar_tecla)
        self.root.bind("<Return>", lambda e: self.calcular_resultado())
        self.root.bind("<KP_Enter>", lambda e: self.calcular_resultado())
        self.root.bind("<BackSpace>", lambda e: self.backspace())
        self.root.bind("<Escape>", lambda e: self.limpar_tudo())

    def _tratar_tecla(self, evento):
        """Processa caracteres comuns digitados."""
        char = evento.char
        if char in "0123456789":
            self.digitar_numero(char)
        elif char in "+-*/":
            self.definir_operacao(char)
        elif char in ".,":
            self.digitar_ponto()
        elif char == "=":
            self.calcular_resultado()

    # --- LÓGICA DAS OPERAÇÕES MATEMÁTICAS BÁSICAS ---

    def digitar_numero(self, digito: str):
        """Insere um algarismo no visor."""
        if self.novo_numero or self.valor_atual == "0" or self.valor_atual == "ERRO":
            self.valor_atual = digito
            self.novo_numero = False
        else:
            # Limita a 14 dígitos para evitar estouro de tela
            if len(self.valor_atual.replace(".", "")) < 14:
                self.valor_atual += digito
        self._atualizar_display()

    def digitar_ponto(self):
        """Insere ponto decimal no visor."""
        if self.novo_numero or self.valor_atual == "ERRO":
            self.valor_atual = "0."
            self.novo_numero = False
        elif "." not in self.valor_atual:
            self.valor_atual += "."
        self._atualizar_display()

    def definir_operacao(self, operador: str):
        """Prepara uma das quatro operações básicas: +, -, *, /"""
        if self.valor_atual == "ERRO":
            return

        # Se já havia uma operação anterior pendente e o usuário digitou outro número,
        # calcula o resultado parcial primeiro
        if self.operador_anterior_valido():
            self.calcular_resultado(auto_chain=True)

        try:
            self.operando_anterior = float(self.valor_atual)
            self.operacao_pendente = operador
            self.novo_numero = True

            simbolo = {"+": "+", "-": "-", "*": "×", "/": "÷"}.get(operador, operador)
            self.label_info.config(
                text=f"{self._formatar_numero(self.operando_anterior)} {simbolo}"
            )
        except ValueError:
            self.exibir_erro("Número inválido")

    def operador_anterior_valido(self) -> bool:
        """Verifica se há uma operação pendente para encadeamento."""
        return (
            self.operando_anterior is not None
            and self.operacao_pendente is not None
            and not self.novo_numero
        )

    def calcular_resultado(self, auto_chain: bool = False):
        """Executa a operação matemática básica selecionada."""
        if self.operando_anterior is None or self.operacao_pendente is None:
            return

        try:
            operando_atual = float(self.valor_atual)
            resultado = 0.0

            # Quatro operações matemáticas fundamentais
            if self.operacao_pendente == "+":
                resultado = self.operando_anterior + operando_atual
            elif self.operacao_pendente == "-":
                resultado = self.operando_anterior - operando_atual
            elif self.operacao_pendente == "*":
                resultado = self.operando_anterior * operando_atual
            elif self.operacao_pendente == "/":
                # Proteção contra Divisão por Zero
                if operando_atual == 0:
                    self.exibir_erro("Divisão por zero não é permitida!")
                    return
                resultado = self.operando_anterior / operando_atual

            # Atualiza o visor com o resultado formatado
            self.valor_atual = self._formatar_numero(resultado)

            if not auto_chain:
                simbolo = {"+": "+", "-": "-", "*": "×", "/": "÷"}.get(
                    self.operacao_pendente, self.operacao_pendente
                )
                self.label_info.config(
                    text=f"{self._formatar_numero(self.operando_anterior)} {simbolo} {self._formatar_numero(operando_atual)} ="
                )
                self.operando_anterior = None
                self.operacao_pendente = None

            self.novo_numero = True
            self._atualizar_display()

        except OverflowError:
            self.exibir_erro("Estouro de capacidade numérico")
        except Exception as e:
            self.exibir_erro(f"Erro: {str(e)}")

    def inverter_sinal(self):
        """Inverte o sinal do número atual (±)."""
        if self.valor_atual == "0" or self.valor_atual == "ERRO":
            return
        if self.valor_atual.startswith("-"):
            self.valor_atual = self.valor_atual[1:]
        else:
            self.valor_atual = "-" + self.valor_atual
        self._atualizar_display()

    def backspace(self):
        """Apaga o último caractere digitado."""
        if self.novo_numero or self.valor_atual == "ERRO":
            return
        if len(self.valor_atual) > 1:
            self.valor_atual = self.valor_atual[:-1]
            if self.valor_atual == "-":
                self.valor_atual = "0"
        else:
            self.valor_atual = "0"
        self._atualizar_display()

    def limpar_entrada(self):
        """Limpa apenas o número digitado atualmente (CE)."""
        self.valor_atual = "0"
        self.novo_numero = True
        self._atualizar_display()

    def limpar_tudo(self):
        """Reinicia todos os registradores da calculadora (C / Esc)."""
        self.valor_atual = "0"
        self.operando_anterior = None
        self.operacao_pendente = None
        self.novo_numero = True
        self.label_info.config(text="")
        self._atualizar_display()

    # --- FUNÇÕES DE MEMÓRIA (MC, MR, M+, M-) ---

    def memoria_limpar(self):
        """Limpa a memória (MC)."""
        self.memoria = 0.0
        self.label_info.config(text="Memória Zerada")

    def memoria_recuperar(self):
        """Recupera o valor guardado na memória (MR)."""
        self.valor_atual = self._formatar_numero(self.memoria)
        self.novo_numero = True
        self._atualizar_display()

    def memoria_adicionar(self):
        """Soma o valor atual à memória (M+)."""
        try:
            self.memoria += float(self.valor_atual)
            self.label_info.config(text=f"[M] Guardado: {self._formatar_numero(self.memoria)}")
            self.novo_numero = True
        except ValueError:
            pass

    def memoria_subtrair(self):
        """Subtrai o valor atual da memória (M-)."""
        try:
            self.memoria -= float(self.valor_atual)
            self.label_info.config(text=f"[M] Guardado: {self._formatar_numero(self.memoria)}")
            self.novo_numero = True
        except ValueError:
            pass

    # --- UTILITÁRIOS & FORMATAÇÃO ---

    def _formatar_numero(self, num: float) -> str:
        """Formata o número removendo zeros decimais desnecessários."""
        if num == int(num):
            return str(int(num))
        # Formata com até 8 casas decimais e remove zeros à direita
        texto = f"{num:.8f}".rstrip("0").rstrip(".")
        return texto

    def _atualizar_display(self):
        """Atualiza o texto visível no display principal."""
        self.display.config(text=self.valor_atual)

    def exibir_erro(self, mensagem: str):
        """Exibe mensagem de erro na caixa de diálogo e no visor."""
        self.valor_atual = "ERRO"
        self._atualizar_display()
        self.label_info.config(text="Erro de Cálculo")
        messagebox.showerror("Erro Matemático - Calculadora 90s", mensagem)
        self.novo_numero = True

    def copiar_valor(self):
        """Copia o valor do display para a área de transferência."""
        self.root.clipboard_clear()
        self.root.clipboard_append(self.valor_atual)
        messagebox.showinfo("Copiado", "Valor copiado para a área de transferência!")

    def mostrar_sobre(self):
        """Exibe diálogo clássico 'Sobre'."""
        info = (
            "Calculadora Retrô Tkinter v1.0\\n"
            "Estilo Visual Anos 90 (Win95 / Motif)\\n\\n"
            "Operações Básicas:\\n"
            " • Adição (+)\\n"
            " • Subtração (-)\\n"
            " • Multiplicação (*)\\n"
            " • Divisão (/)\\n\\n"
            "Feito em Python 3 usando a biblioteca nativa Tkinter."
        )
        messagebox.showinfo("Sobre a Calculadora Retrô", info)


# Ponto de entrada do programa
if __name__ == "__main__":
    # Inicializa a janela principal do Tkinter
    janela_principal = tk.Tk()

    # Instancia a calculadora
    app = CalculadoraRetro90s(janela_principal)

    # Inicia o loop de eventos da interface gráfica
    janela_principal.mainloop()
`;

export const RUN_INSTRUCTIONS = [
  {
    os: 'Windows',
    steps: [
      'Certifique-se de que o Python 3 está instalado (baixe em python.org marcando a opção "Add Python to PATH").',
      'Salve o código em um arquivo com o nome calculadora_retro.py (use o botão "Baixar Arquivo .py" abaixo).',
      'Abra o Prompt de Comando (CMD) ou PowerShell na pasta do arquivo.',
      'Execute o comando: python calculadora_retro.py',
      'Ou dê um duplo clique diretamente no arquivo calculadora_retro.py!',
    ],
  },
  {
    os: 'Linux (Ubuntu / Debian / Fedora)',
    steps: [
      'O Tkinter normalmente vem instalado, ou instale com: sudo apt install python3-tk',
      'Salve o arquivo como calculadora_retro.py',
      'Abra o terminal na pasta e execute:',
      'python3 calculadora_retro.py',
    ],
  },
  {
    os: 'macOS',
    steps: [
      'Instale o Python 3 oficial via python.org ou Homebrew (brew install python-tk).',
      'Salve o arquivo como calculadora_retro.py',
      'No Terminal, rode o comando:',
      'python3 calculadora_retro.py',
    ],
  },
];

export const TKINTER_EXPLANATIONS = [
  {
    concept: 'tk.Tk() e mainloop()',
    code: 'root = tk.Tk()\nroot.mainloop()',
    explanation: 'Inicializa o motor da interface gráfica do Tkinter e inicia o ciclo contínuo de escuta de eventos (cliques, digitação do teclado).',
  },
  {
    concept: 'relief="raised" e bd=3 (Botões 3D anos 90)',
    code: 'btn = tk.Button(..., relief="raised", bd=3)',
    explanation: 'É o segredo da estética anos 90! Cria a borda chanfrada em relevo clássica com bordas superiores claras e inferiores escuras.',
  },
  {
    concept: 'relief="sunken" (Visor LCD afundado)',
    code: 'disp = tk.Label(..., relief="sunken", bd=3)',
    explanation: 'Cria o efeito óptico de visor afundado no chassi da calculadora, típico dos aparelhos e janelas do Windows 95 e X11.',
  },
  {
    concept: 'grid(row, column, sticky="nsew")',
    code: 'btn.grid(row=r, column=c, padx=3, pady=3, sticky="nsew")',
    explanation: 'Posiciona os botões na malha matricial perfeita de 4 colunas e 6 linhas com espaçamento milimétrico.',
  },
  {
    concept: 'Tratamento de Divisão por Zero',
    code: 'if operando_atual == 0:\n    messagebox.showerror("Erro", "Divisão por zero não é permitida!")',
    explanation: 'Evita a interrupção inesperada (ZeroDivisionError) do Python exibindo a clássica caixa de diálogo modal de alerta.',
  },
];
