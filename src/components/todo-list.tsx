'use client'

import { useState } from 'react'
import { TodoItem } from './todo-item'
import { Todo } from '@/types/todo'
import { AddTodoForm } from './add-todo-form'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo])
  }

  const toggleTodo = (id: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ))
  }

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id))
  }

  const editTodo = (id: string, updatedText: string) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, text: updatedText } : todo
    ))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <AddTodoForm onAdd={addTodo} />
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onEdit={(id) => {
              const updatedText = prompt('Edit todo:', todo.text)
              if (updatedText) {
                editTodo(id, updatedText)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}

