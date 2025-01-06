'use client'

import { useEffect, useState } from 'react'
import TodoList from "@/components/TodoList"
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Todo } from '@/types/todo'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

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
    <main className="max-w-3xl mx-auto">
      <Card className="border-none shadow-lg bg-white/50 backdrop-blur-sm">
        <CardHeader className="text-center pb-2">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Todo App
          </h1>
          <p className="text-muted-foreground mt-2">
            Organize your tasks efficiently
          </p>
        </CardHeader>
        <CardContent>
          <TodoList todos={todos} />
        </CardContent>
      </Card>
    </main>
  )
}

