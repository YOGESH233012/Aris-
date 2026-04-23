import React, { useState, useEffect } from 'react';
import { useAris } from '../context/ArisContext';
import { CheckCircle, Circle, Plus, Clock, Book } from 'lucide-react';
import { format } from 'date-fns';

const TasksView = () => {
  const { tasks, completeTask, addTask, setMotivationalMessage } = useAris();
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', subject: '', time: '' });

  // AI-like time check
  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = format(new Date(), 'HH:mm');
      const dueTask = tasks.find(t => t.time === currentTime && !t.completed);
      
      if (dueTask) {
        setMotivationalMessage(`📚 Time for ${dueTask.subject}! Complete your mission: ${dueTask.title}`);
        // In real app we would fire a local notification here
      }
    }, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [tasks, setMotivationalMessage]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (newTask.title && newTask.subject && newTask.time) {
      addTask(newTask);
      setNewTask({ title: '', subject: '', time: '' });
      setShowAdd(false);
    }
  };

  return (
    <div className="animate-slide-in" style={{ padding: '1.5rem', paddingBottom: '100px' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem' }}>Missions</h1>
        <button className="btn btn-primary btn-icon" onClick={() => setShowAdd(!showAdd)}>
          <Plus size={24} />
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleAdd} className="card animate-fade-in" style={{ marginBottom: '2rem' }}>
          <h3 style={{ marginBottom: '1rem' }}>New Mission</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Task Name"
              value={newTask.title}
              onChange={e => setNewTask({...newTask, title: e.target.value})}
              required
            />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input 
                type="text" 
                className="input-field" 
                placeholder="Subject"
                value={newTask.subject}
                onChange={e => setNewTask({...newTask, subject: e.target.value})}
                required
              />
              <input 
                type="time" 
                className="input-field" 
                value={newTask.time}
                onChange={e => setNewTask({...newTask, time: e.target.value})}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Add Mission</button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {tasks.sort((a,b) => a.time.localeCompare(b.time)).map(task => (
          <div key={task.id} className="card" style={{ 
            display: 'flex', alignItems: 'center', gap: '1rem', 
            opacity: task.completed ? 0.6 : 1,
            borderLeft: task.completed ? '4px solid var(--success)' : '4px solid var(--accent-primary)'
          }}>
            <div onClick={() => !task.completed && completeTask(task.id)} style={{ cursor: 'pointer', color: task.completed ? 'var(--success)' : 'var(--text-muted)' }}>
              {task.completed ? <CheckCircle size={28} /> : <Circle size={28} />}
            </div>
            <div style={{ flex: 1 }}>
              <h3 style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Book size={14}/> {task.subject}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> {task.time}</span>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)' }}>
            <p>No missions today. Take a rest or add a new one!</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default TasksView;
