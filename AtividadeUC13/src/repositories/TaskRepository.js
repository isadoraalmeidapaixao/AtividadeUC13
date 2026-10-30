import db from '../database/database';
import { Task } from '../models/Task';

export class TaskRepository {

    static async create(taskInstance) {
        try {
            const { title, description, category, priority, status } = taskInstance.toPlainObject();
            const statement = await db.prepareAsync(
                'INSERT INTO tasks (title, description, category, priority, status) VALUES (?, ?, ?, ?, ?)'
            );
            try {
                const result = await statement.executeAsync([title, description, category, priority, status]);
                return result.lastInsertRowId;
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao salvar no banco: ' + error.message);
        }
    }

    // filtrar as tarefas
    static async findAll(searchQuery = '', statusFilter = 'todos') {
        try {
            let sql = 'SELECT * FROM tasks WHERE 1=1';
            const params = [];

            if (searchQuery.trim() !== '') {
                sql += ' AND (title LIKE ? OR description LIKE ?)';
                params.push(`%${searchQuery}%`, `%${searchQuery}%`);
            }

            if (statusFilter !== 'todos') {
                sql += ' AND status = ?';
                params.push(statusFilter);
            }

            sql += ` ORDER BY 
        CASE priority 
          WHEN 'Alta' THEN 1 
          WHEN 'Média' THEN 2 
          WHEN 'Baixa' THEN 3 
        END ASC, id DESC`;

            const allRows = await db.getAllAsync(sql, params);
            return allRows.map(row => new Task(row.title, row.description, row.category, row.priority, row.status, row.id));
        } catch (error) {
            throw new Error('Erro ao buscar tarefas: ' + error.message);
        }
    }

    static async update(taskInstance) {
        try {
            const { id, title, description, category, priority, status } = taskInstance.toPlainObject();
            const statement = await db.prepareAsync(
                'UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?, status = ? WHERE id = ?'
            );
            try {
                await statement.executeAsync([title, description, category, priority, status, id]);
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao atualizar tarefa: ' + error.message);
        }
    }

    static async delete(id) {
        try {
            const statement = await db.prepareAsync('DELETE FROM tasks WHERE id = ?');
            try {
                await statement.executeAsync([id]);
            } finally {
                await statement.finalizeAsync();
            }
        } catch (error) {
            throw new Error('Erro ao excluir tarefa: ' + error.message);
        }
    }
}