// App.js
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, FlatList, Alert } from 'react-native';
import { initDatabase } from './src/database/database';
import { TaskRepository } from './src/repositories/TaskRepository';
import { Task } from './src/models/Task';

export default function App() {
  const [tasks, setTasks] = useState([]);

  const loadTasks = async () => {
    try {
      const loadedTasks = await TaskRepository.findAll();
      setTasks(loadedTasks);
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        await initDatabase();
        await loadTasks();
      } catch (error) {
        Alert.alert('Erro Crítico', error.message);
      }
    })();
  }, []);

  const handleAddTask = async () => {
    try {
      // Exemplo de criação validada pela POO
      const newTask = new Task('Estudar React Native', 'Revisar conceitos de SQLite e POO', 'Estudos', 'pendente');
      await TaskRepository.create(newTask);
      loadTasks();
      Alert.alert('Sucesso', 'Tarefa cadastrada com sucesso!');
    } catch (error) {
      // Tratamento de exceção de validação da classe
      Alert.alert('Validação', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Tarefas</Text>
      <Button title="Adicionar Tarefa de Exemplo" onPress={handleAddTask} />

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.getId().toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.taskTitle}>{item.getTitle()}</Text>
            <Text>{item.getDescription()}</Text>
            <Text style={styles.category}>Categoria: {item.getCategory()} | Status: {item.getStatus()}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 40, backgroundColor: '#f5f5f5' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  card: { backgroundColor: '#fff', padding: 15, borderRadius: 8, marginVertical: 8, elevation: 2 },
  taskTitle: { fontSize: 16, fontWeight: 'bold' },
  category: { fontSize: 12, color: '#666', marginTop: 5 }
});