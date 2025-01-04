import { db } from './firebase';
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy } from 'firebase/firestore';
import { Todo } from '@/types/todo';

const COLLECTION_NAME = 'todos';

export async function addTodo(todo: Omit<Todo, 'id'>) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...todo,
    createdAt: new Date().toISOString()
  });
  return { ...todo, id: docRef.id };
}

export async function updateTodo(id: string, updates: Partial<Todo>) {
  const todoRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(todoRef, updates);
  return { id, ...updates };
}

export async function deleteTodo(id: string) {
  const todoRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(todoRef);
  return id;
}

export async function getTodos() {
  const todosQuery = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(todosQuery);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Todo[];
} 