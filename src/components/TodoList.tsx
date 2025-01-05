import { useState, useEffect } from "react";
import { addTodo, updateTodo, deleteTodo } from "@/lib/firebase-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Todo, Priority } from "@/types/todo";
import { Trash2, Calendar } from "lucide-react";

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  const [newTodo, setNewTodo] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("low");
  const { toast } = useToast();

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await addTodo({
        text: newTodo.trim(),
        completed: false,
        priority,
      });
      setNewTodo("");
      toast({
        title: "Success",
        description: "Todo added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add todo",
        variant: "destructive",
      });
    }
  };

  const handleToggleTodo = async (id: string, completed: boolean) => {
    try {
      await updateTodo(id, { completed: !completed });
      toast({
        description: `Task marked as ${!completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTodo = async (id: string) => {
    try {
      await deleteTodo(id);
      toast({
        description: "Todo deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete todo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleAddTodo} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-white/50 backdrop-blur-sm border-slate-200"
        />
        <select 
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
          className="px-3 py-2 rounded-md border border-slate-200 bg-white/50 backdrop-blur-sm"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <Button 
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
        >
          Add Task
        </Button>
      </form>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No tasks yet. Add one above!
          </div>
        ) : (
          todos.map((todo) => (
            <div
              key={todo.id}
              className="group flex items-center gap-3 p-4 rounded-lg border border-slate-200 bg-white/50 backdrop-blur-sm hover:shadow-md transition-all"
            >
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <div className="flex-1 space-y-1">
                <span className={todo.completed ? 'line-through text-muted-foreground' : ''}>
                  {todo.text}
                </span>
                {todo.priority && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    todo.priority === 'high' ? 'bg-red-100 text-red-700' :
                    todo.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
                  }`}>
                    {todo.priority}
                  </span>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteTodo(todo.id)}
                className="opacity-0 group-hover:opacity-100 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
} 