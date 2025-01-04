'use client'

import { useEffect, useState } from 'react'
import TodoList from "@/components/TodoList"
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Todo } from '@/types/todo'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"))
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const todosData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Todo[]
      setTodos(todosData)
    })

    return () => unsubscribe()
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8 text-slate-900">
          Todo App
        </h1>
        <TodoList todos={todos} />
      </div>
    </main>
  )
}

