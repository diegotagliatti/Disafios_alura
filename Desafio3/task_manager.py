from dataclasses import dataclass, field, asdict
from typing import List, Optional
import json
import os
import uuid
from urllib.parse import urlparse


STATUS_NOT_STARTED = "Não iniciado"
STATUS_IN_PROGRESS = "Em andamento"
STATUS_COMPLETED = "Concluído"

VALID_STATUSES = [
    STATUS_NOT_STARTED,
    STATUS_IN_PROGRESS,
    STATUS_COMPLETED,
]


def normalize_url(url: str) -> str:
    """Normaliza uma URL adicionando https:// caso não possua esquema."""
    cleaned = url.strip()
    if not cleaned:
        return ""
    parsed = urlparse(cleaned)
    if not parsed.scheme:
        return f"https://{cleaned}"
    return cleaned


@dataclass
class Task:
    title: str
    status: str = STATUS_NOT_STARTED
    doc_link: str = ""
    web_link: str = ""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))

    def __post_init__(self) -> None:
        self.title = self.title.strip()
        if not self.title:
            raise ValueError("O título da atividade não pode estar vazio.")
        if self.status not in VALID_STATUSES:
            raise ValueError(f"Status inválido: {self.status}. Use um de {VALID_STATUSES}.")
        self.doc_link = normalize_url(self.doc_link)
        self.web_link = normalize_url(self.web_link)

    def to_dict(self) -> dict:
        return asdict(self)

    @classmethod
    def from_dict(cls, data: dict) -> "Task":
        return cls(
            id=data.get("id", str(uuid.uuid4())),
            title=data["title"],
            status=data.get("status", STATUS_NOT_STARTED),
            doc_link=data.get("doc_link", ""),
            web_link=data.get("web_link", ""),
        )


class TaskManager:
    """Gerencia a lista de tarefas estilo Kanban/Trello com persistência em JSON."""

    def __init__(self, storage_path: Optional[str] = "tasks.json") -> None:
        self.storage_path = storage_path
        self.tasks: List[Task] = []
        if self.storage_path and os.path.exists(self.storage_path):
            self.load()

    def add_task(
        self,
        title: str,
        doc_link: str = "",
        web_link: str = "",
        status: str = STATUS_NOT_STARTED,
    ) -> Task:
        """Adiciona uma nova atividade."""
        task = Task(
            title=title,
            status=status,
            doc_link=doc_link,
            web_link=web_link,
        )
        self.tasks.append(task)
        self.save()
        return task

    def get_task(self, task_id: str) -> Task:
        """Busca uma atividade pelo ID."""
        for task in self.tasks:
            if task.id == task_id:
                return task
        raise KeyError(f"Atividade com ID '{task_id}' não encontrada.")

    def get_tasks_by_status(self, status: str) -> List[Task]:
        """Retorna todas as atividades de uma determinada coluna/status."""
        if status not in VALID_STATUSES:
            raise ValueError(f"Status inválido: {status}")
        return [t for t in self.tasks if t.status == status]

    def move_task(self, task_id: str, new_status: str) -> Task:
        """Move uma atividade para outra coluna (Não iniciado, Em andamento, Concluído)."""
        if new_status not in VALID_STATUSES:
            raise ValueError(f"Status inválido: {new_status}")
        task = self.get_task(task_id)
        task.status = new_status
        self.save()
        return task

    def advance_task(self, task_id: str) -> Task:
        """Avança a atividade para a próxima coluna no fluxo Kanban."""
        task = self.get_task(task_id)
        idx = VALID_STATUSES.index(task.status)
        if idx < len(VALID_STATUSES) - 1:
            task.status = VALID_STATUSES[idx + 1]
            self.save()
        return task

    def retreat_task(self, task_id: str) -> Task:
        """Retorna a atividade para a coluna anterior no fluxo Kanban."""
        task = self.get_task(task_id)
        idx = VALID_STATUSES.index(task.status)
        if idx > 0:
            task.status = VALID_STATUSES[idx - 1]
            self.save()
        return task

    def complete_task(self, task_id: str) -> Task:
        """Marca uma atividade diretamente como Concluído."""
        return self.move_task(task_id, STATUS_COMPLETED)

    def update_task(
        self,
        task_id: str,
        title: str,
        doc_link: str = "",
        web_link: str = "",
        status: Optional[str] = None,
    ) -> Task:
        """Edita todos os dados de uma atividade existente."""
        cleaned_title = title.strip()
        if not cleaned_title:
            raise ValueError("O título da atividade não pode estar vazio.")
        if status is not None and status not in VALID_STATUSES:
            raise ValueError(f"Status inválido: {status}")

        task = self.get_task(task_id)
        task.title = cleaned_title
        if status is not None:
            task.status = status
        task.doc_link = normalize_url(doc_link)
        task.web_link = normalize_url(web_link)
        self.save()
        return task

    def update_links(self, task_id: str, doc_link: str = "", web_link: str = "") -> Task:
        """Atualiza os links de Google Docs e/ou página web da atividade."""
        task = self.get_task(task_id)
        return self.update_task(
            task_id,
            title=task.title,
            doc_link=doc_link,
            web_link=web_link,
            status=task.status,
        )

    def remove_task(self, task_id: str) -> None:
        """Remove uma atividade pelo ID."""
        task = self.get_task(task_id)
        self.tasks.remove(task)
        self.save()

    def save(self) -> None:
        """Salva as atividades no arquivo JSON configurado."""
        if not self.storage_path:
            return
        data = [t.to_dict() for t in self.tasks]
        with open(self.storage_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False, indent=2)

    def load(self) -> None:
        """Carrega as atividades do arquivo JSON configurado."""
        if not self.storage_path or not os.path.exists(self.storage_path):
            self.tasks = []
            return
        try:
            with open(self.storage_path, "r", encoding="utf-8") as f:
                raw_data = json.load(f)
            self.tasks = [Task.from_dict(item) for item in raw_data]
        except (json.JSONDecodeError, KeyError, ValueError):
            self.tasks = []
