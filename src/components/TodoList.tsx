import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, deleteDoc, doc, updateDoc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Todo } from "@/types/todo";
import { Trash2 } from "lucide-react";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState<string>("");
  const { toast } = useToast();

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      await addDoc(collection(db, "todos"), {
        text: newTodo,
        completed: false,
        createdAt: new Date().toISOString(),
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

  const toggleTodo = async (id: string, completed: boolean) => {
    try {
      await updateDoc(doc(db, "todos", id), {
        completed: !completed,
      });
      toast({
        description: `Todo marked as ${!completed ? 'completed' : 'incomplete'}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update todo",
        variant: "destructive",
      });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteDoc(doc(db, "todos", id));
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
      <form onSubmit={addTodo} className="flex gap-2">
        <Input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-white/50 backdrop-blur-sm border-slate-200"
        />
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
                onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
              />
              <span 
                className={`flex-1 ${
                  todo.completed 
                    ? 'line-through text-muted-foreground' 
                    : ''
                }`}
              >
                {todo.text}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTodo(todo.id)}
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