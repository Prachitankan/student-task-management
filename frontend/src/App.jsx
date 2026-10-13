import { useState, useEffect } from 'react';
import TaskForm from './components/TaskForm';
import TaskItem from './components/TaskItem';
import './App.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all tasks from backend on initial load
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch('/api/tasks');
      if (!res.ok) throw new Error('Failed to load tasks');
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError('Cannot connect to backend server. Make sure it is running on port 5000 (npm run backend).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Add a new task
  const handleAddTask = async (newTask) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (!res.ok) throw new Error('Failed to add task');
      const savedTask = await res.json();
      setTasks([savedTask, ...tasks]);
    } catch (err) {
      alert('Error adding task: ' + err.message);
    }
  };

  // Toggle task completed status
  const handleToggleComplete = async (id, currentCompleted) => {
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentCompleted })
      });
      if (!res.ok) throw new Error('Failed to update task');
      const updated = await res.json();
      setTasks(tasks.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      alert('Error updating task: ' + err.message);
    }
  };

  // Delete a task
  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Failed to delete task');
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      alert('Error deleting task: ' + err.message);
    }
  };

  // Statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = totalCount - completedCount;

  // Filter & Search tasks
  const filteredTasks = tasks.filter(task => {
    // Filter by status
    if (filter === 'pending' && task.completed) return false;
    if (filter === 'completed' && !task.completed) return false;

    // Search by title or subject
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(query);
      const matchSubject = (task.subject || '').toLowerCase().includes(query);
      return matchTitle || matchSubject;
    }

    return true;
  });

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <h1>🎓 Student Task Manager</h1>
        <p>Keep track of your academic tasks, assignments, and deadlines</p>
      </header>

      {/* Backend connection warning if offline */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={fetchTasks} className="btn-retry">Retry</button>
        </div>
      )}

      {/* Summary Stats */}
      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-value">{totalCount}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card stat-pending">
          <span className="stat-value">{pendingCount}</span>
          <span className="stat-label">Pending</span>
        </div>
        <div className="stat-card stat-completed">
          <span className="stat-value">{completedCount}</span>
          <span className="stat-label">Completed</span>
        </div>
      </div>

      {/* Add Task Form */}
      <TaskForm onAddTask={handleAddTask} />

      {/* Task Filters & Search */}
      <div className="controls-row">
        <div className="filter-buttons">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'pending' ? 'active' : ''}`}
            onClick={() => setFilter('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed ({completedCount})
          </button>
        </div>

        <input
          type="text"
          className="search-input"
          placeholder="Search by title or subject..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Tasks List */}
      <div className="tasks-container">
        {loading ? (
          <p className="empty-message">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p className="empty-message">No tasks found.</p>
            <p className="empty-sub">
              {tasks.length === 0
                ? 'Add your first assignment using the form above!'
                : 'Try changing your search or filter criteria.'}
            </p>
          </div>
        ) : (
          filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
            />
          ))
        )}
      </div>
    </div>
  );
}