// src/models/Task.js
export class Task {
    #id;
    #title;
    #description;
    #category;
    #status;

    constructor(title, description, category, status = 'pendente', id = null) {
        this.#id = id;
        this.setTitle(title);
        this.setDescription(description);
        this.setCategory(category);
        this.setStatus(status);
    }

    // Getters
    getId() { return this.#id; }
    getTitle() { return this.#title; }
    getDescription() { return this.#description; }
    getCategory() { return this.#category; }
    getStatus() { return this.#status; }

    // Setters com Validação (Encapsulamento)
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
        if (!category || category.trim() === '') {
            throw new Error('A categoria é obrigatória.');
        }
        this.#category = category.trim();
    }

    setStatus(status) {
        const validStatuses = ['pendente', 'concluida'];
        if (!validStatuses.includes(status)) {
            throw new Error('Status inválido. Use "pendente" ou "concluida".');
        }
        this.#status = status;
    }

    // Retorna um objeto simples para persistência
    toPlainObject() {
        return {
            id: this.#id,
            title: this.#title,
            description: this.#description,
            category: this.#category,
            status: this.#status,
        };
    }
}