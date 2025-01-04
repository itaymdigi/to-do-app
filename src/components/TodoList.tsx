import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, deleteDoc, doc, updateDoc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Todo } from "@/types/todo";
import { Trash2 } from "lucide-react";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState("");
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
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">My Tasks</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1"
          />
          <Button type="submit" className="bg-primary hover:bg-primary/90">
            Add Task
          </Button>
        </form>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                  className="h-5 w-5"
                />
                <span 
                  className={`${
                    todo.completed 
                      ? 'line-through text-muted-foreground' 
                      : 'text-foreground'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteTodo(todo.id)}
                className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 