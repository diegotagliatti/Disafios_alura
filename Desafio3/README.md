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
