'use client'

import { TodoList } from '@/components/todo-list'

export default function Page() {
  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <TodoList />
    </main>
  )
} 