'use client'

import { useEffect, useState } from 'react'
import TodoList from "@/components/TodoList"
import { collection, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Todo } from '@/types/todo'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const q = query(collection(db, "todos"), orderBy("createdAt", "desc"))
    
    try {
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const todosData = snapshot.docs.map(doc => {
          const data = doc.data()
          const createdAt = data.createdAt instanceof Timestamp 
            ? data.createdAt.toDate().toISOString()
            : new Date().toISOString()

          return {
            id: doc.id,
            ...data,
            createdAt,
          } as Todo
        })
        setTodos(todosData)
        setLoading(false)
      }, (error) => {
        console.error("Error fetching todos:", error)
        toast({
          title: "Error",
          description: "Failed to load todos. Please try again later.",
          variant: "destructive",
        })
        setLoading(false)
      })

      return () => unsubscribe()
    } catch (error) {
      console.error("Error setting up todos listener:", error)
      toast({
        title: "Error",
        description: "Failed to initialize todo list. Please refresh the page.",
        variant: "destructive",
      })
      setLoading(false)
    }
  }, [toast])

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
          {loading ? (
            <div className="text-center py-6 text-muted-foreground">
              Loading todos...
            </div>
          ) : (
            <TodoList todos={todos} />
          )}
        </CardContent>
      </Card>
    </main>
  )
}

