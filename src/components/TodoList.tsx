import { useState } from "react";
import { addTodo, updateTodo, deleteTodo } from "@/lib/firebase-service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { Todo, Priority } from "@/types/todo";
import { 
  Trash2, 
  Calendar,
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TodoListProps {
  todos: Todo[];
}

const priorityConfig = {
  low: { color: "bg-blue-100 text-blue-800", icon: Clock },
  medium: { color: "bg-yellow-100 text-yellow-800", icon: AlertCircle },
  high: { color: "bg-red-100 text-red-800", icon: AlertCircle },
} as const;

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
      <Card className="p-4">
        <form onSubmit={handleAddTodo} className="flex gap-2">
          <Input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="What needs to be done?"
            className="flex-1"
          />
          <Select
            value={priority}
            onValueChange={(value: Priority) => setPriority(value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low Priority</SelectItem>
              <SelectItem value="medium">Medium Priority</SelectItem>
              <SelectItem value="high">High Priority</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit">
            Add Task
          </Button>
        </form>
      </Card>

      <div className="space-y-3">
        {todos.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <div className="flex flex-col items-center gap-2">
              <CheckCircle2 className="h-8 w-8 text-muted-foreground/50" />
              <p>No tasks yet. Add one above!</p>
            </div>
          </Card>
        ) : (
          todos.map((todo) => {
            const priorityDetails = priorityConfig[todo.priority || 'low'];
            const PriorityIcon = priorityDetails.icon;

            return (
              <Card
                key={todo.id}
                className={cn(
                  "group flex items-center gap-3 p-4 transition-all",
                  todo.completed && "bg-muted/50"
                )}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => handleToggleTodo(todo.id, todo.completed)}
                  className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                />
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium",
                      todo.completed && "line-through text-muted-foreground"
                    )}>
                      {todo.text}
                    </span>
                    <Badge 
                      variant="secondary"
                      className={cn(
                        "flex items-center gap-1",
                        priorityDetails.color
                      )}
                    >
                      <PriorityIcon className="h-3 w-3" />
                      {todo.priority}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Added {new Date(todo.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteTodo(todo.id)}
                  className="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
} 