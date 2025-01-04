'use client'

import { useState } from 'react'
import { Todo, Priority } from '@/types/todo'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface AddTodoFormProps {
  onAdd: (newTodo: Omit<Todo, 'id'>) => void
}

export function AddTodoForm({ onAdd }: AddTodoFormProps) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState<Priority>('low')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const newTodo: Omit<Todo, 'id'> = {
      text: text.trim(),
      completed: false,
      createdAt: new Date(),
      priority,
    }
    
    onAdd(newTodo)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a new todo"
        className="flex-1"
        required
      />
      <select 
        value={priority} 
        onChange={(e) => setPriority(e.target.value as Priority)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <Button type="submit">
        Add
      </Button>
    </form>
  )
} 