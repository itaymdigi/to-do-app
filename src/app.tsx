import { TodoList } from './components/todo-list'
import { AddTodoForm } from './components/add-todo-form'

function App() {
  const [todos, setTodos] = useState<Todo[]>([])

  const addTodo = (newTodo: Todo) => {
    setTodos([...todos, newTodo])
  }

  return (
    <div>
      <AddTodoForm onAdd={addTodo} />
      <TodoList todos={todos} setTodos={setTodos} />
    </div>
  )
}

export default App 