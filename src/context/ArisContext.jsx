/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';

const ArisContext = createContext();

export const useAris = () => useContext(ArisContext);

const defaultProfile = {
  name: '',
  email: '',
  school: 'Loading...',
  class: 'Loading...',
  subjects: [],
  xp: 0,
  fps: 0,
  streak: 0,
  level: 'Beginner',
  role: 'student',
};

const sampleTasks = [
  { id: 1, title: 'Complete Math Worksheet', subject: 'Math', time: '14:00', completed: false },
  { id: 2, title: 'Read Physics Chapter 3', subject: 'Physics', time: '16:00', completed: true },
  { id: 3, title: 'Write CS Code', subject: 'Computer Science', time: '19:00', completed: false },
];

export const ArisProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [profile, setProfile] = useState(defaultProfile);
  const [tasks, setTasks] = useState(sampleTasks);
  const [motivationalMessage, setMotivationalMessage] = useState('Great consistency! Keep it up!');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (!user) {
        setProfile(defaultProfile);
        setAuthLoading(false);
        return;
      }

      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      const profileData = docSnap.exists() ? docSnap.data() : {};

      setProfile((prev) => ({
        ...prev,
        ...profileData,
        email: user.email ?? profileData.email ?? '',
        role: profileData.role ?? 'student',
      }));

      const unsubProfile = onSnapshot(docRef, (liveDoc) => {
        if (!liveDoc.exists()) {
          return;
        }

        const liveData = liveDoc.data();
        setProfile((prev) => ({
          ...prev,
          ...liveData,
          email: user.email ?? liveData.email ?? '',
          role: liveData.role ?? prev.role ?? 'student',
        }));
      });

      setAuthLoading(false);
      return () => unsubProfile();
    });

    return () => unsubscribe();
  }, []);

  const completeTask = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: true } : task)));

    setProfile((prev) => {
      const newXp = prev.xp + 50;
      let newLevel = prev.level;

      if (newXp > 2000) newLevel = 'Master';
      else if (newXp > 1000) newLevel = 'Intermediate';

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        fps: Math.min(100, prev.fps + 2),
      };
    });

    setMotivationalMessage('Mission accomplished. +50 XP');
  };

  const missTask = (taskId) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, missed: true } : task)));

    setProfile((prev) => ({
      ...prev,
      xp: Math.max(0, prev.xp - 20),
      fps: Math.max(0, prev.fps - 5),
    }));

    setMotivationalMessage('Task missed. Stay focused next time.');
  };

  const addTask = (newTask) => {
    setTasks([...tasks, { ...newTask, id: Date.now(), completed: false }]);
  };

  return (
    <ArisContext.Provider
      value={{
        currentUser,
        authLoading,
        profile,
        setProfile,
        tasks,
        completeTask,
        missTask,
        addTask,
        motivationalMessage,
        setMotivationalMessage,
      }}
    >
      {children}
    </ArisContext.Provider>
  );
};

