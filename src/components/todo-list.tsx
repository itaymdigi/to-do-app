'use client'

import { useEffect, useState } from 'react'
import { TodoItem } from './todo-item'
import { Todo } from '@/types/todo'
import { AddTodoForm } from './add-todo-form'
import { getTodos, addTodo, updateTodo, deleteTodo } from '@/lib/firebase-service'

export function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTodos()
  }, [])

  const loadTodos = async () => {
    try {
      const fetchedTodos = await getTodos()
      setTodos(fetchedTodos)
    } catch (error) {
      console.error('Error loading todos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTodo = async (newTodo: Omit<Todo, 'id'>) => {
    try {
      const addedTodo = await addTodo(newTodo)
      setTodos(prev => [addedTodo, ...prev])
    } catch (error) {
      console.error('Error adding todo:', error)
    }
  }

  const handleToggleTodo = async (id: string) => {
    try {
      const todoToUpdate = todos.find(todo => todo.id === id)
      if (!todoToUpdate) return

      await updateTodo(id, { completed: !todoToUpdate.completed })
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      ))
    } catch (error) {
      console.error('Error toggling todo:', error)
    }
  }

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id)
      setTodos(prev => prev.filter(todo => todo.id !== id))
    } catch (error) {
      console.error('Error deleting todo:', error)
    }
  }

  const handleEditTodo = async (id: string, updatedText: string) => {
    try {
      await updateTodo(id, { text: updatedText })
      setTodos(prev => prev.map(todo =>
        todo.id === id ? { ...todo, text: updatedText } : todo
      ))
    } catch (error) {
      console.error('Error editing todo:', error)
    }
  }

  if (loading) {
    return <div className="flex justify-center p-4">Loading...</div>
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <AddTodoForm onAdd={handleAddTodo} />
      <div className="space-y-2">
        {todos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggleTodo}
            onDelete={handleDeleteTodo}
            onEdit={handleEditTodo}
          />
        ))}
      </div>
    </div>
  )
}

