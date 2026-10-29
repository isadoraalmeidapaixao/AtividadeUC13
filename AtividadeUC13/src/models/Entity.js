export class Entity {
    #id;

    constructor(id = null) {
        this.#id = id;
    }

    getId() {
        return this.#id;
    }

    toPlainObject() {
        return { id: this.#id };
    }
}