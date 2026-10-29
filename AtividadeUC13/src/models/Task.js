import { Entity } from './Entity';

export class Task extends Entity {
    #title;
    #description;
    #category;
    #priority;
    #status;

    constructor(title, description, category, priority = 'Média', status = 'pendente', id = null) {
        super(id);
        this.setTitle(title);
        this.setDescription(description);
        this.setCategory(category);
        this.setPriority(priority);
        this.setStatus(status);
    }

    // getters
    getTitle() { return this.#title; }
    getDescription() { return this.#description; }
    getCategory() { return this.#category; }
    getPriority() { return this.#priority; }
    getStatus() { return this.#status; }

    setTitle(title) {
        if (!title || title.trim() === '') {
            throw new Error('O título da tarefa é obrigatório.');
        }
        this.#title = title.trim();
    }

    setDescription(description) {
        this.#description = description ? description.trim() : '';
    }

    setCategory(category) {
        const validCategories = ['Trabalho', 'Estudos', 'Pessoal', 'Outros'];
        if (!validCategories.includes(category)) {
            throw new Error('Categoria inválida.');
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
            ...super.toPlainObject(),
            title: this.#title,
            description: this.#description,
            category: this.#category,
            priority: this.#priority,
            status: this.#status,
        };
    }
}