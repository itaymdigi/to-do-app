import { Checkbox } from "@/components/ui/checkbox"
import { Todo, Priority } from "@/types/todo"
import { Trash2, Calendar, Tag, Pencil } from "lucide-react"
import { format } from "date-fns"

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}

const priorityColors: Record<Priority, string> = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800'
}

export function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="h-5 w-5"
      />
      <div className="flex-1 space-y-1">
        <span className={`block ${todo.completed ? 'line-through text-gray-500' : ''}`}>
          {todo.text}
        </span>
        <div className="flex items-center space-x-2 text-sm">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityColors[todo.priority]}`}>
            {todo.priority}
          </span>
          {todo.dueDate && (
            <span className="flex items-center text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {format(new Date(todo.dueDate), 'MMM d, yyyy')}
            </span>
          )}
          {todo.category && (
            <span className="flex items-center text-gray-500">
              <Tag className="h-4 w-4 mr-1" />
              {todo.category}
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onEdit(todo.id)}
        className="text-gray-400 hover:text-blue-500 transition-colors"
      >
        <Pencil className="h-5 w-5" />
      </button>
      <button
        onClick={() => onDelete(todo.id)}
        className="text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 className="h-5 w-5" />
      </button>
    </div>
  )
} 