import tkinter as tk
from tkinter import ttk, messagebox
import webbrowser
from typing import Callable, Dict, Optional

from task_manager import (
    Task,
    TaskManager,
    STATUS_NOT_STARTED,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED,
    VALID_STATUSES,
)


# Paleta e estilo Retrô (Inspirado em Windows 95 / 98 clássico)
RETRO_DESKTOP_BG = "#008080"      # Verde-azulado clássico do desktop Win95
RETRO_PANEL_BG = "#C0C0C0"        # Cinza prata clássico de janelas
RETRO_CARD_BG = "#DFDFDF"         # Cinza claro de cartões
RETRO_INPUT_BG = "#FFFFFF"        # Fundo branco de inputs sunken
RETRO_TEXT_FG = "#000000"         # Texto preto clássico
RETRO_MUTED_FG = "#404040"        # Cinza escuro retrô
RETRO_FONT_FAMILY = "Courier New"

COLUMN_STYLES = {
    STATUS_NOT_STARTED: {
        "header_bg": "#000080",   # Azul Marinho clássico Win95
        "header_fg": "#FFFFFF",
        "col_bg": "#C0C0C0",
        "icon": "[ ]",
    },
    STATUS_IN_PROGRESS: {
        "header_bg": "#804000",   # Âmbar/Marrom retrô
        "header_fg": "#FFFF00",
        "col_bg": "#C0C0C0",
        "icon": "[~]",
    },
    STATUS_COMPLETED: {
        "header_bg": "#006400",   # Verde escuro clássico
        "header_fg": "#FFFFFF",
        "col_bg": "#C0C0C0",
        "icon": "[X]",
    },
}


class KanbanApp:
    """Interface visual estilo Trello/Kanban com visual Retrô."""

    def __init__(
        self,
        root: tk.Tk,
        manager: Optional[TaskManager] = None,
        url_opener: Callable[[str], bool] = webbrowser.open,
    ) -> None:
        self.root = root
        self.manager = manager if manager is not None else TaskManager("tasks.json")
        self.url_opener = url_opener

        self.root.title("KANBAN.EXE - Gerenciador de Tarefas Retrô")
        self.root.geometry("1080x680")
        self.root.minsize(880, 540)
        self.root.configure(bg=RETRO_DESKTOP_BG)

        self.column_containers: Dict[str, tk.Frame] = {}
        self.column_canvases: Dict[str, tk.Canvas] = {}
        self.column_count_labels: Dict[str, tk.Label] = {}

        # Referências opcionais à última janela de diálogo aberta (útil para testes e controle)
        self.active_dialog: Optional[tk.Toplevel] = None

        self._build_ui()
        self.refresh_board()

    def _build_ui(self) -> None:
        # Barra de topo estilo janela retrô Win95
        top_bar = tk.Frame(
            self.root,
            bg=RETRO_PANEL_BG,
            relief=tk.RAISED,
            bd=3,
            padx=12,
            pady=8,
        )
        top_bar.pack(fill=tk.X, padx=14, pady=(14, 10))

        # Faixa de título azul marinho dentro da barra superior
        banner_frame = tk.Frame(top_bar, bg="#000080", padx=10, pady=5)
        banner_frame.pack(fill=tk.X, pady=(0, 8))

        tk.Label(
            banner_frame,
            text="=== QUADRO KANBAN RETRÔ v1.0 ===",
            font=(RETRO_FONT_FAMILY, 13, "bold"),
            bg="#000080",
            fg="#FFFFFF",
        ).pack(side=tk.LEFT)

        tk.Label(
            banner_frame,
            text="DICA: Clique com o BOTÃO DIREITO em uma tarefa para editá-la",
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg="#000080",
            fg="#FFFF00",
        ).pack(side=tk.RIGHT)

        # Barra de ferramentas apenas com o botão de adicionar tarefa
        toolbar_frame = tk.Frame(top_bar, bg=RETRO_PANEL_BG)
        toolbar_frame.pack(fill=tk.X)

        self.open_add_dialog_button = tk.Button(
            toolbar_frame,
            text="[ + ADICIONAR TAREFA ]",
            command=self.open_add_task_dialog,
            font=(RETRO_FONT_FAMILY, 11, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#000080",
            activebackground="#DFDFDF",
            activeforeground="#000080",
            relief=tk.RAISED,
            bd=4,
            cursor="hand2",
            padx=16,
            pady=6,
        )
        self.open_add_dialog_button.pack(side=tk.LEFT)

        info_lbl = tk.Label(
            toolbar_frame,
            text="Botão Direito no Cartão = Editar Tarefa Completamente",
            font=(RETRO_FONT_FAMILY, 9),
            bg=RETRO_PANEL_BG,
            fg=RETRO_MUTED_FG,
        )
        info_lbl.pack(side=tk.RIGHT, padx=6)

        # Área das 3 barras (colunas estilo Trello com visual retrô)
        board_frame = tk.Frame(self.root, bg=RETRO_DESKTOP_BG, padx=14)
        board_frame.pack(fill=tk.BOTH, expand=True, pady=(0, 14))

        for idx, status in enumerate(VALID_STATUSES):
            board_frame.columnconfigure(idx, weight=1, uniform="kanban_col")
            board_frame.rowconfigure(0, weight=1)
            self._create_column(board_frame, status, idx)

    def _create_column(self, parent: tk.Frame, status: str, col_idx: int) -> None:
        style = COLUMN_STYLES[status]
        pad_x = (0, 6) if col_idx == 0 else ((6, 6) if col_idx == 1 else (6, 0))

        # Moldura externa 3D da coluna
        col_outer = tk.Frame(
            parent,
            bg=RETRO_PANEL_BG,
            relief=tk.RAISED,
            bd=3,
            padx=6,
            pady=6,
        )
        col_outer.grid(row=0, column=col_idx, sticky="nsew", padx=pad_x)

        # Cabeçalho da barra
        col_header = tk.Frame(
            col_outer,
            bg=style["header_bg"],
            relief=tk.RAISED,
            bd=2,
            padx=10,
            pady=6,
        )
        col_header.pack(fill=tk.X, pady=(0, 6))

        tk.Label(
            col_header,
            text=f"{style['icon']} {status.upper()}",
            font=(RETRO_FONT_FAMILY, 11, "bold"),
            bg=style["header_bg"],
            fg=style["header_fg"],
        ).pack(side=tk.LEFT)

        count_lbl = tk.Label(
            col_header,
            text="0",
            font=(RETRO_FONT_FAMILY, 10, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#000000",
            relief=tk.SUNKEN,
            bd=2,
            padx=6,
            pady=1,
        )
        count_lbl.pack(side=tk.RIGHT)
        self.column_count_labels[status] = count_lbl

        # Área rolável interna (Sunken 3D)
        canvas_container = tk.Frame(
            col_outer,
            bg=style["col_bg"],
            relief=tk.SUNKEN,
            bd=2,
        )
        canvas_container.pack(fill=tk.BOTH, expand=True)

        canvas = tk.Canvas(
            canvas_container,
            bg=style["col_bg"],
            highlightthickness=0,
        )
        scrollbar = tk.Scrollbar(
            canvas_container,
            orient=tk.VERTICAL,
            command=canvas.yview,
            bg=RETRO_PANEL_BG,
            troughcolor="#DFDFDF",
            relief=tk.RAISED,
            bd=2,
        )
        cards_frame = tk.Frame(canvas, bg=style["col_bg"], padx=8, pady=8)

        cards_frame.bind(
            "<Configure>",
            lambda _e, c=canvas: c.configure(scrollregion=c.bbox("all")),
        )

        canvas_window = canvas.create_window((0, 0), window=cards_frame, anchor="nw")
        canvas.bind(
            "<Configure>",
            lambda e, c=canvas, win=canvas_window: c.itemconfig(win, width=e.width),
        )
        canvas.configure(yscrollcommand=scrollbar.set)

        canvas.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        scrollbar.pack(side=tk.RIGHT, fill=tk.Y)

        self.column_containers[status] = cards_frame
        self.column_canvases[status] = canvas

    def open_add_task_dialog(self) -> tk.Toplevel:
        """Abre o menu/janela retrô para adicionar uma nova atividade."""
        return self._open_task_form_dialog(mode="add", task=None)

    def open_edit_task_dialog(self, task: Task) -> tk.Toplevel:
        """Abre o menu/janela retrô para editar completamente uma atividade existente."""
        return self._open_task_form_dialog(mode="edit", task=task)

    def _open_task_form_dialog(
        self, mode: str, task: Optional[Task] = None
    ) -> tk.Toplevel:
        is_edit = mode == "edit" and task is not None
        dialog = tk.Toplevel(self.root)
        dialog.title(
            f"EDITAR TAREFA - {task.title}" if is_edit else "ADICIONAR NOVA TAREFA"
        )
        dialog.geometry("500x360")
        dialog.resizable(False, False)
        dialog.configure(bg=RETRO_PANEL_BG, relief=tk.RAISED, bd=3)
        dialog.transient(self.root)
        dialog.grab_set()

        self.active_dialog = dialog

        # Barra de título interna estilo Win95
        header = tk.Frame(dialog, bg="#000080", padx=10, pady=6)
        header.pack(fill=tk.X, padx=6, pady=(6, 10))

        tk.Label(
            header,
            text=(
                ":: MENU DE EDIÇÃO COMPLETA DA TAREFA ::"
                if is_edit
                else ":: MENU DE NOVA TAREFA ::"
            ),
            font=(RETRO_FONT_FAMILY, 10, "bold"),
            bg="#000080",
            fg="#FFFFFF",
        ).pack(side=tk.LEFT)

        body = tk.Frame(dialog, bg=RETRO_PANEL_BG, padx=14, pady=4)
        body.pack(fill=tk.BOTH, expand=True)

        # Campo 1: Título da Atividade
        tk.Label(
            body,
            text="Título da Atividade *:",
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg=RETRO_TEXT_FG,
            anchor="w",
        ).pack(fill=tk.X)

        self.dialog_title_var = tk.StringVar(value=task.title if is_edit else "")
        title_entry = tk.Entry(
            body,
            textvariable=self.dialog_title_var,
            font=(RETRO_FONT_FAMILY, 10),
            bg=RETRO_INPUT_BG,
            fg=RETRO_TEXT_FG,
            relief=tk.SUNKEN,
            bd=2,
        )
        title_entry.pack(fill=tk.X, pady=(2, 10), ipady=3)
        title_entry.focus_set()

        # Campo 2: Link do Google Docs
        tk.Label(
            body,
            text="[DOC] Link do Google Docs (opcional):",
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#000080",
            anchor="w",
        ).pack(fill=tk.X)

        self.dialog_doc_link_var = tk.StringVar(value=task.doc_link if is_edit else "")
        doc_entry = tk.Entry(
            body,
            textvariable=self.dialog_doc_link_var,
            font=(RETRO_FONT_FAMILY, 10),
            bg=RETRO_INPUT_BG,
            fg=RETRO_TEXT_FG,
            relief=tk.SUNKEN,
            bd=2,
        )
        doc_entry.pack(fill=tk.X, pady=(2, 10), ipady=3)

        # Campo 3: Link da Página Web
        tk.Label(
            body,
            text="[WEB] Link da Página Web (opcional):",
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#006400",
            anchor="w",
        ).pack(fill=tk.X)

        self.dialog_web_link_var = tk.StringVar(value=task.web_link if is_edit else "")
        web_entry = tk.Entry(
            body,
            textvariable=self.dialog_web_link_var,
            font=(RETRO_FONT_FAMILY, 10),
            bg=RETRO_INPUT_BG,
            fg=RETRO_TEXT_FG,
            relief=tk.SUNKEN,
            bd=2,
        )
        web_entry.pack(fill=tk.X, pady=(2, 10), ipady=3)

        # Campo 4: Barra / Status
        tk.Label(
            body,
            text="Barra (Status):",
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg=RETRO_TEXT_FG,
            anchor="w",
        ).pack(fill=tk.X)

        self.dialog_status_var = tk.StringVar(
            value=task.status if is_edit else STATUS_NOT_STARTED
        )
        status_combo = ttk.Combobox(
            body,
            textvariable=self.dialog_status_var,
            values=VALID_STATUSES,
            state="readonly",
            font=(RETRO_FONT_FAMILY, 10),
        )
        status_combo.pack(fill=tk.X, pady=(2, 14))

        def submit_form() -> Optional[Task]:
            title_val = self.dialog_title_var.get().strip()
            doc_val = self.dialog_doc_link_var.get().strip()
            web_val = self.dialog_web_link_var.get().strip()
            status_val = self.dialog_status_var.get() or STATUS_NOT_STARTED

            if not title_val:
                messagebox.showwarning(
                    "Aviso do Sistema",
                    "O título da atividade não pode ficar em branco!",
                    parent=dialog,
                )
                return None

            if is_edit and task is not None:
                result_task = self.manager.update_task(
                    task_id=task.id,
                    title=title_val,
                    doc_link=doc_val,
                    web_link=web_val,
                    status=status_val,
                )
            else:
                result_task = self.manager.add_task(
                    title=title_val,
                    doc_link=doc_val,
                    web_link=web_val,
                    status=status_val,
                )

            self.refresh_board()
            dialog.destroy()
            self.active_dialog = None
            return result_task

        self.dialog_submit_fn = submit_form

        # Botões de ação do menu
        btn_bar = tk.Frame(body, bg=RETRO_PANEL_BG)
        btn_bar.pack(fill=tk.X, pady=(4, 6))

        save_btn = tk.Button(
            btn_bar,
            text="[ SALVAR ALTERAÇÕES ]" if is_edit else "[ ADICIONAR TAREFA ]",
            command=submit_form,
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#000080",
            relief=tk.RAISED,
            bd=3,
            cursor="hand2",
            padx=12,
            pady=4,
        )
        save_btn.pack(side=tk.RIGHT)

        cancel_btn = tk.Button(
            btn_bar,
            text="[ CANCELAR ]",
            command=dialog.destroy,
            font=(RETRO_FONT_FAMILY, 9, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#800000",
            relief=tk.RAISED,
            bd=3,
            cursor="hand2",
            padx=12,
            pady=4,
        )
        cancel_btn.pack(side=tk.RIGHT, padx=(0, 8))

        dialog.bind("<Return>", lambda _e: submit_form())
        dialog.bind("<Escape>", lambda _e: dialog.destroy())
        return dialog

    def handle_move_left(self, task_id: str) -> None:
        self.manager.retreat_task(task_id)
        self.refresh_board()

    def handle_move_right(self, task_id: str) -> None:
        self.manager.advance_task(task_id)
        self.refresh_board()

    def handle_complete_task(self, task_id: str) -> None:
        self.manager.complete_task(task_id)
        self.refresh_board()

    def handle_remove_task(self, task_id: str) -> None:
        self.manager.remove_task(task_id)
        self.refresh_board()

    def open_link(self, url: str) -> None:
        if url:
            self.url_opener(url)

    def refresh_board(self) -> None:
        """Recria os cartões nas 3 colunas de acordo com o estado atual do TaskManager."""
        for status, container in self.column_containers.items():
            for child in container.winfo_children():
                child.destroy()

            tasks = self.manager.get_tasks_by_status(status)
            self.column_count_labels[status].configure(text=str(len(tasks)))

            if not tasks:
                empty_lbl = tk.Label(
                    container,
                    text="--- Nenhuma tarefa ---",
                    font=(RETRO_FONT_FAMILY, 9),
                    bg=COLUMN_STYLES[status]["col_bg"],
                    fg=RETRO_MUTED_FG,
                    pady=20,
                )
                empty_lbl.pack(fill=tk.X)
            else:
                for task in tasks:
                    self._create_task_card(container, task)

    def _bind_right_click_recursive(self, widget: tk.Widget, task: Task) -> None:
        """Vincula o clique com botão direito em todo o cartão para abrir a edição completa."""
        widget.bind("<Button-3>", lambda _e, t=task: self.open_edit_task_dialog(t))
        for child in widget.winfo_children():
            self._bind_right_click_recursive(child, task)

    def _create_task_card(self, parent: tk.Frame, task: Task) -> None:
        card = tk.Frame(
            parent,
            bg=RETRO_CARD_BG,
            relief=tk.RAISED,
            bd=3,
            padx=10,
            pady=8,
        )
        card.pack(fill=tk.X, pady=(0, 10))

        # Cabeçalho sutil indicando que o botão direito edita
        top_row = tk.Frame(card, bg=RETRO_CARD_BG)
        top_row.pack(fill=tk.X, pady=(0, 4))

        title_font = (
            (RETRO_FONT_FAMILY, 10, "bold overstrike")
            if task.status == STATUS_COMPLETED
            else (RETRO_FONT_FAMILY, 10, "bold")
        )
        title_fg = RETRO_MUTED_FG if task.status == STATUS_COMPLETED else RETRO_TEXT_FG

        title_lbl = tk.Label(
            top_row,
            text=task.title,
            font=title_font,
            bg=RETRO_CARD_BG,
            fg=title_fg,
            anchor="w",
            justify=tk.LEFT,
            wraplength=260,
        )
        title_lbl.pack(side=tk.LEFT, fill=tk.X, expand=True)

        # Seção de Links (Google Docs e/ou Página Web) para abrir no navegador
        if task.doc_link or task.web_link:
            links_frame = tk.Frame(
                card,
                bg=RETRO_PANEL_BG,
                relief=tk.SUNKEN,
                bd=2,
                padx=4,
                pady=4,
            )
            links_frame.pack(fill=tk.X, pady=(2, 8))

            if task.doc_link:
                doc_btn = tk.Button(
                    links_frame,
                    text=f"[DOC] {self._shorten_url(task.doc_link)}",
                    command=lambda u=task.doc_link: self.open_link(u),
                    font=(RETRO_FONT_FAMILY, 8, "bold"),
                    bg=RETRO_PANEL_BG,
                    fg="#000080",
                    activebackground="#DFDFDF",
                    relief=tk.RAISED,
                    bd=2,
                    anchor="w",
                    cursor="hand2",
                    padx=4,
                    pady=2,
                )
                doc_btn.pack(fill=tk.X, pady=(0, 3 if task.web_link else 0))

            if task.web_link:
                web_btn = tk.Button(
                    links_frame,
                    text=f"[WEB] {self._shorten_url(task.web_link)}",
                    command=lambda u=task.web_link: self.open_link(u),
                    font=(RETRO_FONT_FAMILY, 8, "bold"),
                    bg=RETRO_PANEL_BG,
                    fg="#006400",
                    activebackground="#DFDFDF",
                    relief=tk.RAISED,
                    bd=2,
                    anchor="w",
                    cursor="hand2",
                    padx=4,
                    pady=2,
                )
                web_btn.pack(fill=tk.X)

        # Barra de Ações do Cartão (sem o botão de editar links; edição agora é via botão direito)
        actions_frame = tk.Frame(card, bg=RETRO_CARD_BG)
        actions_frame.pack(fill=tk.X, pady=(2, 0))

        status_idx = VALID_STATUSES.index(task.status)

        # Botão voltar coluna
        if status_idx > 0:
            prev_btn = tk.Button(
                actions_frame,
                text="<<",
                command=lambda tid=task.id: self.handle_move_left(tid),
                font=(RETRO_FONT_FAMILY, 8, "bold"),
                bg=RETRO_PANEL_BG,
                fg="#000000",
                relief=tk.RAISED,
                bd=2,
                cursor="hand2",
                padx=6,
                pady=1,
            )
            prev_btn.pack(side=tk.LEFT, padx=(0, 4))

        # Botão avançar coluna
        if status_idx < len(VALID_STATUSES) - 1:
            next_btn = tk.Button(
                actions_frame,
                text=">>",
                command=lambda tid=task.id: self.handle_move_right(tid),
                font=(RETRO_FONT_FAMILY, 8, "bold"),
                bg=RETRO_PANEL_BG,
                fg="#000080",
                relief=tk.RAISED,
                bd=2,
                cursor="hand2",
                padx=6,
                pady=1,
            )
            next_btn.pack(side=tk.LEFT, padx=(0, 4))

        # Botão concluir diretamente
        if task.status != STATUS_COMPLETED:
            done_btn = tk.Button(
                actions_frame,
                text="[OK] Concluir",
                command=lambda tid=task.id: self.handle_complete_task(tid),
                font=(RETRO_FONT_FAMILY, 8, "bold"),
                bg=RETRO_PANEL_BG,
                fg="#006400",
                relief=tk.RAISED,
                bd=2,
                cursor="hand2",
                padx=6,
                pady=1,
            )
            done_btn.pack(side=tk.LEFT, padx=(0, 4))

        # Botão remover
        del_btn = tk.Button(
            actions_frame,
            text="[X] Remover",
            command=lambda tid=task.id: self.handle_remove_task(tid),
            font=(RETRO_FONT_FAMILY, 8, "bold"),
            bg=RETRO_PANEL_BG,
            fg="#800000",
            relief=tk.RAISED,
            bd=2,
            cursor="hand2",
            padx=6,
            pady=1,
        )
        del_btn.pack(side=tk.RIGHT)

        # Vincula o clique com botão direito em todo o cartão e seus elementos filhos
        self._bind_right_click_recursive(card, task)

    @staticmethod
    def _shorten_url(url: str, max_len: int = 30) -> str:
        display = url.replace("https://", "").replace("http://", "")
        if len(display) > max_len:
            return display[: max_len - 3] + "..."
        return display


def main() -> None:
    root = tk.Tk()
    KanbanApp(root)
    root.mainloop()


if __name__ == "__main__":
    main()
