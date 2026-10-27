// src/models/Task.js
export class Task {
    #id;
    #title;
    #description;
    #category;
    #priority;
    #status;

    constructor(title, description, category, priority = 'Média', status = 'pendente', id = null) {
        this.#id = id;
        this.setTitle(title);
        this.setDescription(description);
        this.setCategory(category);
        this.setPriority(priority);
        this.setStatus(status);
    }

    // Getters
    getId() { return this.#id; }
    getTitle() { return this.#title; }
    getDescription() { return this.#description; }
    getCategory() { return this.#category; }
    getPriority() { return this.#priority; }
    getStatus() { return this.#status; }

    // Setters com Validação
    setTitle(title) {
        if (!title || title.trim() === '') {
            throw new Error('O título da tarefa não pode estar vazio.');
        }
        this.#title = title.trim();
    }

    setDescription(description) {
        this.#description = description ? description.trim() : '';
    }

    setCategory(category) {
        const validCategories = ['Trabalho', 'Estudos', 'Pessoal', 'Outros'];
        if (!validCategories.includes(category)) {
            throw new Error('Categoria inválida selecionada.');
        }
        this.#category = category;
    }

    setPriority(priority) {
        const validPriorities = ['Baixa', 'Média', 'Alta'];
        if (!validPriorities.includes(priority)) {
            throw new Error('Prioridade inválida.');
        }
        this.#priority = priority;
    }

    setStatus(status) {
        const validStatuses = ['pendente', 'concluida'];
        if (!validStatuses.includes(status)) {
            throw new Error('Status inválido.');
        }
        this.#status = status;
    }

    toPlainObject() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            category: this.#category,
            priority: this.#priority,
            status: this.#status,
        };
    }
}