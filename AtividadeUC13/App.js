import React, { useEffect, useState } from 'react';
import {
  StyleSheet, Text, View, TextInput, TouchableOpacity,
  FlatList, Alert, KeyboardAvoidingView, Platform, ScrollView
} from 'react-native';
import { initDatabase } from './src/database/database';
import { TaskRepository } from './src/repositories/TaskRepository';
import { Task } from './src/models/Task';

const CATEGORIES = ['Trabalho', 'Estudos', 'Pessoal', 'Outros'];
const PRIORITIES = ['Baixa', 'Média', 'Alta'];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Trabalho');
  const [selectedPriority, setSelectedPriority] = useState('Média');
  const [editingId, setEditingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('todos');

  const loadTasks = async () => {
    try {
      const loadedTasks = await TaskRepository.findAll(searchQuery, statusFilter);
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
  }, [searchQuery, statusFilter]);

  const handleSaveTask = async () => {
    try {
      if (editingId) {
        const taskToUpdate = new Task(title, description, selectedCategory, selectedPriority, 'pendente', editingId);
        await TaskRepository.update(taskToUpdate);
        Alert.alert('Sucesso', 'Tarefa atualizada!');
        setEditingId(null);
      }
      else {
        const newTask = new Task(title, description, selectedCategory, selectedPriority, 'pendente');
        await TaskRepository.create(newTask);
        Alert.alert('Sucesso', 'Tarefa cadastrada!');
      }

      setTitle('');
      setDescription('');
      setSelectedCategory('Trabalho');
      setSelectedPriority('Média');
      loadTasks();
    } catch (error) {
      Alert.alert('Atenção', error.message);
    }
  };

  const handleEditPress = (item) => {
    setTitle(item.getTitle());
    setDescription(item.getDescription());
    setSelectedCategory(item.getCategory());
    setSelectedPriority(item.getPriority());
    setEditingId(item.getId());
  };

  const handleToggleStatus = async (item) => {
    try {
      const newStatus = item.getStatus() === 'pendente' ? 'concluida' : 'pendente';
      const taskToUpdate = new Task(
        item.getTitle(), item.getDescription(), item.getCategory(),
        item.getPriority(), newStatus, item.getId()
      );
      await TaskRepository.update(taskToUpdate);
      loadTasks();
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  const handleDeleteTask = (id) => {
    Alert.alert('Excluir Tarefa', 'Deseja excluir esta tarefa?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir', style: 'destructive',
        onPress: async () => {
          try {
            await TaskRepository.delete(id);
            loadTasks();
          } catch (error) {
            Alert.alert('Erro', error.message);
          }
        }
      }
    ]);
  };


  const completedCount = tasks.filter(t => t.getStatus() === 'concluida').length;
  const totalCount = tasks.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Text style={styles.headerTitle}>Gerenciador de Tarefas</Text>

      <ScrollView contentContainerStyle={styles.scrollForm} showsVerticalScrollIndicator={false}>


        <View style={styles.statsContainer}>
          <Text style={styles.statsTitle}>Status: {progressPercent}%</Text>
          <Text style={styles.statsSubtitle}>{completedCount} de {totalCount} tarefas concluídas</Text>
        </View>


        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Título da tarefa" value={title} onChangeText={setTitle} />
          <TextInput style={styles.input} placeholder="Descrição (opcional)" value={description} onChangeText={setDescription} />

          <Text style={styles.label}>Categoria:</Text>
          <View style={styles.optionsRow}>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity key={cat} style={[styles.chip, selectedCategory === cat && styles.chipSelected]} onPress={() => setSelectedCategory(cat)}>
                <Text style={[styles.chipText, selectedCategory === cat && styles.chipTextSelected]}>{cat}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Prioridade:</Text>
          <View style={styles.optionsRow}>
            {PRIORITIES.map((prio) => (
              <TouchableOpacity key={prio} style={[styles.chip, selectedPriority === prio && styles.chipPrioritySelected]} onPress={() => setSelectedPriority(prio)}>
                <Text style={[styles.chipText, selectedPriority === prio && styles.chipTextSelected]}>{prio}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSaveTask}>
            <Text style={styles.saveButtonText}>{editingId ? 'Atualizar Tarefa' : 'Adicionar Tarefa'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterSection}>
          <TextInput
            style={styles.searchInput}
            placeholder=" Filtrar tarefas..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <View style={styles.filterTabs}>
            {['todos', 'pendente', 'concluida'].map((st) => (
              <TouchableOpacity
                key={st}
                style={[styles.tab, statusFilter === st && styles.activeTab]}
                onPress={() => setStatusFilter(st)}
              >
                <Text style={[styles.tabText, statusFilter === st && styles.activeTabText]}>
                  {st.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Lista Proporcional de Tarefas */}
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.getId().toString()}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <View style={[styles.card, item.getStatus() === 'concluida' && styles.cardCompleted]}>
              <View style={styles.taskContent}>
                <Text style={[styles.taskTitle, item.getStatus() === 'concluida' && styles.textCompleted]}>
                  {item.getTitle()}
                </Text>
                {item.getDescription() ? <Text style={styles.taskDesc}>{item.getDescription()}</Text> : null}

                <View style={styles.badgeRow}>
                  <View style={styles.badgeCategoryContainer}>
                    <Text style={styles.badgeCategory}>📂 {item.getCategory()}</Text>
                  </View>
                  <View style={[
                    styles.badgePriorityContainer,
                    item.getPriority() === 'Alta' && { backgroundColor: '#ffebee' },
                    item.getPriority() === 'Média' && { backgroundColor: '#fff3e0' },
                    item.getPriority() === 'Baixa' && { backgroundColor: '#e8f5e9' },
                  ]}>
                    <Text style={[
                      styles.badgePriority,
                      item.getPriority() === 'Alta' && { color: '#c62828' },
                      item.getPriority() === 'Média' && { color: '#ef6c00' },
                      item.getPriority() === 'Baixa' && { color: '#2e7d32' },
                    ]}>
                      ⚡ {item.getPriority()}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.actionsContainer}>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]} onPress={() => handleToggleStatus(item)}>
                  <Text style={styles.actionBtnText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#FF9800' }]} onPress={() => handleEditPress(item)}>
                  <Text style={styles.actionBtnText}>✎</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F44336' }]} onPress={() => handleDeleteTask(item.getId())}>
                  <Text style={styles.actionBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5',
    paddingTop: 40
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333'
  },

  scrollForm: {
    paddingHorizontal: 20,
    paddingBottom: 30
  },

  statsContainer: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    alignItems: 'center'
  },

  statsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  },

  statsSubtitle: {
    color: '#e3f2fd',
    fontSize: 12,
    marginTop: 2
  },

  formContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3
  },

  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa'
  },

  label: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#555',
    marginTop: 5,
    marginBottom: 5
  },

  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10
  },

  chip: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 6,
    marginBottom: 6,
    backgroundColor: '#fff'
  },

  chipSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF'
  },

  chipPrioritySelected: {
    backgroundColor: '#333',
    borderColor: '#333'
  },

  chipText: {
    fontSize: 12,
    color: '#333'
  },

  chipTextSelected: {
    color: '#fff',
    fontWeight: 'bold'
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 12, borderRadius: 6,
    alignItems: 'center', marginTop: 5
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15
  },

  filterSection: {
    marginBottom: 15
  },

  searchInput: {

    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8
  },
  filterTabs: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: '#e0e0e0',
    marginHorizontal: 2,
    borderRadius: 6
  },
  activeTab: {
    backgroundColor: '#333'
  },

  tabText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#555'
  },

  activeTabText: {
    color: '#fff'
  },

  card: {
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2
  },

  cardCompleted: {
    backgroundColor: '#f1f8e9'
  },

  taskContent: {
    flex: 1,
    marginRight: 10
  },

  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 3
  },

  textCompleted: {
    textDecorationLine: 'line-through',
    color: '#888'
  },

  taskDesc: {
    fontSize: 13,
    color: '#555',
    marginBottom: 10
  },

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },

  badgeCategoryContainer: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginRight: 8
  },

  badgeCategory: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1565c0'
  },

  badgePriorityContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6
  },

  badgePriority: {
    fontSize: 12,
    fontWeight: 'bold'
  },
  actionsContainer: {
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 3
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14
  }
});
