import React, { useState } from 'react';
import { useAris } from '../context/ArisContext';
import { Flame, Target, Trophy, Award, Sparkles } from 'lucide-react';

const QUOTES = [
  "Success is the sum of small efforts.",
  "Push yourself, because no one else is going to do it for you.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Stay focused and never give up."
];

const Dashboard = () => {
  const { profile, tasks, motivationalMessage } = useAris();
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks === 0 ? 0 : Math.round((completedTasksCount / totalTasks) * 100);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const dynamicName = profile?.name ? profile.name.split(' ')[0] : 'Student';

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem' }}>
      
      {/* Header Profile */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {getGreeting()}, {dynamicName} <span className="bounce-small">👋</span>
          </h1>
          <p style={{ color: 'var(--text-muted)' }}>Level: {profile.level} • {profile.school === 'Not Set' ? 'No School Set' : profile.school}</p>
        </div>
        <div className="avatar-wrapper" style={{ padding: '0.3rem', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))' }}>
          <img src={`https://ui-avatars.com/api/?name=${dynamicName}&background=0a0a0b&color=fff`} alt="Avatar" style={{ borderRadius: '50%', width: '48px', height: '48px', border: '2px solid transparent' }} />
        </div>
      </div>

      {/* AI Motivation Message */}
      <div className="glass-panel" style={{ 
          padding: '1rem', 
          marginBottom: '1rem', 
          display: 'flex', 
          alignItems: 'flex-start', 
          gap: '1rem', 
          borderLeft: '4px solid var(--accent-secondary)',
          background: 'linear-gradient(to right, rgba(139, 92, 246, 0.1), transparent)'
        }}>
        <div style={{ fontSize: '1.5rem' }} className="pulse-glow">🤖</div>
        <div>
          <p style={{ fontSize: '0.75rem', color: 'var(--accent-secondary)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Aris AI Suggests</p>
          <p style={{ fontWeight: 500, lineHeight: 1.4 }}>{motivationalMessage}</p>
        </div>
      </div>

      {/* Daily Motivation */}
      <div style={{ marginBottom: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px dashed var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
         <Sparkles size={16} color="var(--warning)" />
         <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>"{quote}"</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
        
        <div className="card stat-card hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', marginBottom: '0.5rem' }}>
            <Trophy size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>XP Points</span>
          </div>
          <span className="gradient-text" style={{ fontSize: '1.8rem', fontWeight: 700 }}>{profile.xp}</span>
        </div>

        <div className="card stat-card hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>
            <Award size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Rank</span>
          </div>
          <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'white' }}>{profile.level}</span>
        </div>

        <div className="card stat-card hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', marginBottom: '0.5rem' }}>
            <Target size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>FPS Score</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'white' }}>{profile.fps}<span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>/100</span></span>
        </div>

        <div className="card stat-card hover-lift">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', marginBottom: '0.5rem' }}>
            <Flame size={18} />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>Streak</span>
          </div>
          <span style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--danger)' }}>{profile.streak} <span style={{fontSize: '1rem', color: 'var(--text-muted)'}}>Days</span></span>
        </div>

      </div>

      {/* Daily Progress */}
      <div className="card hover-lift">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem' }}>Daily Progress</h3>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{completedTasksCount}/{totalTasks} Missions</span>
        </div>
        <div className="progress-container">
          <div className="progress-bar progress-primary" style={{ width: `${progressPercent}%`, background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))' }}></div>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
