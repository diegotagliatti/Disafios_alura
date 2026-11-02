import os
import tempfile
import tkinter as tk
import unittest

from task_manager import (
    Task,
    TaskManager,
    STATUS_NOT_STARTED,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED,
)
from app import KanbanApp


class TestTaskManager(unittest.TestCase):
    """Testes unitários para a lógica de negócio e persistência do TaskManager."""

    def setUp(self) -> None:
        self.temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".json")
        self.temp_file.close()
        os.remove(self.temp_file.name)
        self.manager = TaskManager(storage_path=self.temp_file.name)

    def tearDown(self) -> None:
        if os.path.exists(self.temp_file.name):
            os.remove(self.temp_file.name)

    def test_add_task_default_status(self) -> None:
        task = self.manager.add_task("Estudar Python")
        self.assertEqual(task.title, "Estudar Python")
        self.assertEqual(task.status, STATUS_NOT_STARTED)
        self.assertEqual(task.doc_link, "")
        self.assertEqual(task.web_link, "")
        self.assertEqual(len(self.manager.tasks), 1)

    def test_add_task_with_google_docs_link_only(self) -> None:
        doc_url = "https://docs.google.com/document/d/abc123/edit"
        task = self.manager.add_task("Escrever relatório", doc_link=doc_url)
        self.assertEqual(task.doc_link, doc_url)
        self.assertEqual(task.web_link, "")

    def test_add_task_with_web_link_only(self) -> None:
        web_url = "https://www.alura.com.br"
        task = self.manager.add_task("Ver aula na Alura", web_link=web_url)
        self.assertEqual(task.doc_link, "")
        self.assertEqual(task.web_link, web_url)

    def test_add_task_with_both_google_docs_and_web_links(self) -> None:
        doc_url = "docs.google.com/document/d/xyz987"
        web_url = "python.org/doc"
        task = self.manager.add_task(
            "Documentar API",
            doc_link=doc_url,
            web_link=web_url,
        )
        self.assertEqual(task.doc_link, "https://docs.google.com/document/d/xyz987")
        self.assertEqual(task.web_link, "https://python.org/doc")

    def test_empty_title_raises_error(self) -> None:
        with self.assertRaises(ValueError):
            self.manager.add_task("   ")

    def test_kanban_flow_across_three_bars(self) -> None:
        task = self.manager.add_task("Implementar Kanban")
        self.assertEqual(task.status, STATUS_NOT_STARTED)

        # Avança para 'Em andamento'
        self.manager.advance_task(task.id)
        self.assertEqual(task.status, STATUS_IN_PROGRESS)
        self.assertEqual(len(self.manager.get_tasks_by_status(STATUS_IN_PROGRESS)), 1)

        # Avança para 'Concluído'
        self.manager.advance_task(task.id)
        self.assertEqual(task.status, STATUS_COMPLETED)
        self.assertEqual(len(self.manager.get_tasks_by_status(STATUS_COMPLETED)), 1)

        # Volta para 'Em andamento'
        self.manager.retreat_task(task.id)
        self.assertEqual(task.status, STATUS_IN_PROGRESS)

    def test_complete_task_directly(self) -> None:
        task = self.manager.add_task("Tarefa rápida")
        self.assertEqual(task.status, STATUS_NOT_STARTED)

        self.manager.complete_task(task.id)
        self.assertEqual(task.status, STATUS_COMPLETED)
        self.assertEqual(len(self.manager.get_tasks_by_status(STATUS_COMPLETED)), 1)
        self.assertEqual(len(self.manager.get_tasks_by_status(STATUS_NOT_STARTED)), 0)

    def test_remove_task(self) -> None:
        t1 = self.manager.add_task("Tarefa 1")
        t2 = self.manager.add_task("Tarefa 2")
        self.assertEqual(len(self.manager.tasks), 2)

        self.manager.remove_task(t1.id)
        self.assertEqual(len(self.manager.tasks), 1)
        self.assertEqual(self.manager.tasks[0].id, t2.id)

    def test_update_task_completely(self) -> None:
        task = self.manager.add_task("Título Inicial")
        self.manager.update_task(
            task.id,
            title="Título Editado",
            doc_link="docs.google.com/document/d/editado",
            web_link="https://alura.com.br",
            status=STATUS_IN_PROGRESS,
        )
        updated = self.manager.get_task(task.id)
        self.assertEqual(updated.title, "Título Editado")
        self.assertEqual(updated.doc_link, "https://docs.google.com/document/d/editado")
        self.assertEqual(updated.web_link, "https://alura.com.br")
        self.assertEqual(updated.status, STATUS_IN_PROGRESS)

    def test_persistence_save_and_load(self) -> None:
        t1 = self.manager.add_task(
            "Tarefa Persistida",
            doc_link="https://docs.google.com/document/d/111",
            web_link="https://example.com",
            status=STATUS_IN_PROGRESS,
        )

        # Carrega em uma nova instância apontando para o mesmo arquivo
        reloaded = TaskManager(storage_path=self.temp_file.name)
        self.assertEqual(len(reloaded.tasks), 1)
        loaded_task = reloaded.tasks[0]
        self.assertEqual(loaded_task.id, t1.id)
        self.assertEqual(loaded_task.title, "Tarefa Persistida")
        self.assertEqual(loaded_task.status, STATUS_IN_PROGRESS)
        self.assertEqual(loaded_task.doc_link, "https://docs.google.com/document/d/111")
        self.assertEqual(loaded_task.web_link, "https://example.com")


class TestKanbanAppUI(unittest.TestCase):
    """Testes de integração da interface gráfica Retrô (Tkinter) com o TaskManager."""

    def setUp(self) -> None:
        self.opened_urls = []
        self.root = tk.Tk()
        self.root.withdraw()  # Oculta a janela durante a execução dos testes
        self.manager = TaskManager(storage_path=None)
        self.app = KanbanApp(
            self.root,
            manager=self.manager,
            url_opener=lambda url: self.opened_urls.append(url) or True,
        )

    def tearDown(self) -> None:
        self.root.destroy()

    def test_ui_add_via_dialog_edit_via_right_click_complete_and_remove(self) -> None:
        # 1. Clica no botão de adicionar tarefa para abrir o menu/janela de nova tarefa
        dialog = self.app.open_add_task_dialog()
        self.assertIsNotNone(dialog)

        self.app.dialog_title_var.set("Planejar Sprint")
        self.app.dialog_doc_link_var.set("https://docs.google.com/document/d/sprint-doc")
        self.app.dialog_web_link_var.set("https://trello.com")
        self.app.dialog_status_var.set(STATUS_NOT_STARTED)

        created = self.app.dialog_submit_fn()
        self.root.update_idletasks()

        self.assertIsNotNone(created)
        self.assertEqual(self.app.column_count_labels[STATUS_NOT_STARTED].cget("text"), "1")
        self.assertEqual(self.app.column_count_labels[STATUS_IN_PROGRESS].cget("text"), "0")
        self.assertEqual(self.app.column_count_labels[STATUS_COMPLETED].cget("text"), "0")

        # 2. Verifica que o cartão possui o vínculo de botão direito (<Button-3>) e não possui botão "🔗 Links"
        cards = self.app.column_containers[STATUS_NOT_STARTED].winfo_children()
        self.assertEqual(len(cards), 1)
        card_widget = cards[0]
        self.assertTrue(bool(card_widget.bind("<Button-3>")))

        # Garante que nenhum botão de editar links separado ("🔗 Links") existe no cartão
        all_buttons_text = [
            w.cget("text")
            for child in card_widget.winfo_children()
            for w in ([child] + child.winfo_children())
            if isinstance(w, tk.Button)
        ]
        self.assertNotIn("🔗 Links", all_buttons_text)

        # 3. Abre o menu de edição completa (equivalente ao clique com botão direito no cartão)
        edit_dialog = self.app.open_edit_task_dialog(created)
        self.assertIsNotNone(edit_dialog)
        self.assertEqual(self.app.dialog_title_var.get(), "Planejar Sprint")

        # Edita título, links e muda a barra para 'Em andamento'
        self.app.dialog_title_var.set("Planejar Sprint v2")
        self.app.dialog_doc_link_var.set("docs.google.com/document/d/sprint-v2")
        self.app.dialog_web_link_var.set("https://github.com")
        self.app.dialog_status_var.set(STATUS_IN_PROGRESS)

        updated = self.app.dialog_submit_fn()
        self.root.update_idletasks()

        self.assertEqual(updated.title, "Planejar Sprint v2")
        self.assertEqual(updated.doc_link, "https://docs.google.com/document/d/sprint-v2")
        self.assertEqual(updated.web_link, "https://github.com")
        self.assertEqual(self.app.column_count_labels[STATUS_NOT_STARTED].cget("text"), "0")
        self.assertEqual(self.app.column_count_labels[STATUS_IN_PROGRESS].cget("text"), "1")

        # 4. Testa abertura dos dois links atualizados
        self.app.open_link(updated.doc_link)
        self.app.open_link(updated.web_link)
        self.assertEqual(
            self.opened_urls,
            [
                "https://docs.google.com/document/d/sprint-v2",
                "https://github.com",
            ],
        )

        # 5. Conclui a atividade
        self.app.handle_complete_task(updated.id)
        self.root.update_idletasks()
        self.assertEqual(self.app.column_count_labels[STATUS_IN_PROGRESS].cget("text"), "0")
        self.assertEqual(self.app.column_count_labels[STATUS_COMPLETED].cget("text"), "1")

        # 6. Remove a atividade
        self.app.handle_remove_task(updated.id)
        self.root.update_idletasks()
        self.assertEqual(self.app.column_count_labels[STATUS_COMPLETED].cget("text"), "0")
        self.assertEqual(len(self.manager.tasks), 0)


if __name__ == "__main__":
    unittest.main(verbosity=2)
