// src/database/database.js
import * as SQLite from 'expo-sqlite';

// Abre ou cria o banco de dados localmente
const db = SQLite.openDatabaseSync('tasks_manager.db');

export const initDatabase = async () => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        category TEXT NOT NULL,
        status TEXT NOT NULL
      );
    `);
    console.log('Banco de dados inicializado com sucesso.');
  } catch (error) {
    console.error('Erro ao inicializar o banco de dados:', error);
    throw new Error('Falha ao configurar o banco de dados local.');
  }
};

export default db;