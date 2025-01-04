import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import { Todo } from '@/types/todo';

const COLLECTION_NAME = 'todos';

export async function addTodo(todo: Omit<Todo, 'id' | 'createdAt'>) {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...todo,
    createdAt: serverTimestamp(),
  });
  return docRef.id;
}

export async function updateTodo(id: string, updates: Partial<Omit<Todo, 'id' | 'createdAt'>>) {
  const todoRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(todoRef, updates);
}

export async function deleteTodo(id: string) {
  const todoRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(todoRef);
}

export async function getTodos() {
  try {
    const todosQuery = query(
      collection(db, COLLECTION_NAME), 
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(todosQuery);
    
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const createdAt = data.createdAt instanceof Timestamp 
        ? data.createdAt.toDate().toISOString()
        : new Date().toISOString();

      return {
        id: doc.id,
        ...data,
        createdAt,
      } as Todo;
    });
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
} 