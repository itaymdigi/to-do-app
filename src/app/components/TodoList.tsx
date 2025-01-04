import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, deleteDoc, doc, updateDoc, collection } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Todo } from "@/types/todo"; // Fixed import path
import { Trash2 } from "lucide-react";

export default function TodoList({ todos }: { todos: Todo[] }) {
  const [newTodo, setNewTodo] = useState<string>(""); // Added type annotation
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Todo List</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTodo} className="flex gap-2 mb-6">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1"
          />
          <Button type="submit">Add</Button>
        </form>

        <div className="space-y-4">
          {todos.map((todo) => (
            <Card key={todo.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id, todo.completed)}
                  />
                  <span className={`${todo.completed ? 'line-through text-gray-500' : ''}`}>
                    {todo.text}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => deleteTodo(todo.id)}
                  className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 