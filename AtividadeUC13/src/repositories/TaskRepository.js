// src/repositories/TaskRepository.js
import db from '../database/database';
import { Task } from '../models/Task';

export class TaskRepository {

    // CREATE (Inclusão)
    static async create(taskInstance) {
        try {
            const { title, description, category, status } = taskInstance.toPlainObject();
            const statement = await db.prepareAsync(
                'INSERT INTO tasks (title, description, category, status) VALUES (?, ?, ?, ?)'
            );
            try {
                const result = await statement.executeAsync([title, description, category, status]);
                return result.lastInsertRowId;
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao salvar a tarefa no banco de dados: ' + error.message);
        }
    }

    // READ (Consulta com Filtros e Ordenação)
    static async findAll(filterCategory = null, filterStatus = null) {
        try {
            let query = 'SELECT * FROM tasks WHERE 1=1';
            const params = [];

            if (filterCategory) {
                query += ' AND category = ?';
                params.push(filterCategory);
            }

            if (filterStatus) {
                query += ' AND status = ?';
                params.push(filterStatus);
            }

            query += ' ORDER BY id DESC';

            const allRows = await db.getAllAsync(query, params);

            // Mapeia os registros do banco de volta para instâncias da classe Task
            return allRows.map(row => new Task(row.title, row.description, row.category, row.status, row.id));
        } catch (error) {
            throw new Error('Erro ao consultar as tarefas: ' + error.message);
        }
    }

    // UPDATE (Alteração)
    static async update(taskInstance) {
        try {
            const { id, title, description, category, status } = taskInstance.toPlainObject();
            const statement = await db.prepareAsync(
                'UPDATE tasks SET title = ?, description = ?, category = ?, status = ? WHERE id = ?'
            );
            try {
                await statement.executeAsync([title, description, category, status, id]);
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao atualizar a tarefa: ' + error.message);
        }
    }

    // DELETE (Exclusão)
    static async delete(id) {
        try {
            const statement = await db.prepareAsync('DELETE FROM tasks WHERE id = ?');
            try {
                await statement.executeAsync([id]);
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao excluir a tarefa: ' + error.message);
        }
    }
}