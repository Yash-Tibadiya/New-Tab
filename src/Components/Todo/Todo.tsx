import { useState, useEffect, useRef } from "react";
import { Trash2, Edit, Check } from "lucide-react";

interface Todo {
  id: number;
  todoText: string;
  isCompleted: boolean;
}

const Todo = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);
  const [editedTodo, setEditedTodo] = useState<number | null>(null);
  const [editedText, setEditedText] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);

  // Add todo function
  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (todo.trim() === "") return;

    setTodos((prevTodos) => [
      ...prevTodos,
      {
        id: new Date().getTime(),
        todoText: todo,
        isCompleted: false,
      },
    ]);
    setTodo("");
  };

  // Delete todo
  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // Edit todo
  const editTodo = (e: React.FormEvent, id: number) => {
    e.preventDefault();
    if (editedText.trim() === "") return;

    const newTodos = [...todos].map((todo) => {
      if (id === todo.id) {
        todo.todoText = editedText;
      }
      return todo;
    });
    setTodos(newTodos);
    setEditedTodo(null);
  };

  // Toggle todo completion state
  const toggleTodoState = (id: number) => {
    const newTodos = [...todos].map((todo) => {
      if (todo.id === id) {
        todo.isCompleted = !todo.isCompleted;
      }
      return todo;
    });
    setTodos(newTodos);
  };

  // Focus input field when editing
  useEffect(() => {
    if (editedTodo !== null && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editedTodo]);

  // Load todos from localStorage on initial render
  useEffect(() => {
    const json = localStorage.getItem("todos");
    if (json) {
      const loadedTodos = JSON.parse(json);
      if (loadedTodos) {
        setTodos(loadedTodos);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    const json = JSON.stringify(todos);
    localStorage.setItem("todos", json);
  }, [todos]);

  return (
    <div className="w-[350px] h-[400px] max-w-md bg-gradient-to-br from-violet-600 to-indigo-800 rounded-xl overflow-hidden">
      <div className="p-6 space-y-4">
        <h3 className="text-2xl font-bold text-white text-center">My Tasks</h3>

        {/* Todo input form */}
        <form
          className="flex items-center space-x-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm"
          onSubmit={addTodo}
        >
          <input
            type="text"
            className="flex-1 bg-transparent border-none text-white placeholder-white/60 focus:outline-none text-lg"
            placeholder="Add a task..."
            onChange={(e) => setTodo(e.target.value)}
            value={todo}
            ref={inputRef}
          />
          <button
            type="submit"
            className="bg-white text-indigo-800 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            disabled={todo.trim() === ""}
          >
            Add
          </button>
        </form>

        {/* Todo list */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {todos.map((todo) => (
            <div
              key={todo.id}
              className={`bg-white/10 backdrop-blur-sm rounded-lg transition-all ${
                todo.isCompleted ? "opacity-70" : "opacity-100"
              }`}
            >
              {todo.id === editedTodo ? (
                <div className="p-3 flex items-center">
                  <form
                    className="flex-1"
                    onSubmit={(e) => editTodo(e, todo.id)}
                  >
                    <input
                      type="text"
                      className="w-full bg-transparent border-b border-white/30 text-white focus:outline-none focus:border-white pb-1"
                      onChange={(e) => setEditedText(e.target.value)}
                      defaultValue={todo.todoText}
                      ref={inputRef}
                    />
                  </form>
                  <button
                    className="ml-2 text-white/70 hover:text-white text-sm"
                    onClick={() => setEditedTodo(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="p-3 flex items-center justify-between group">
                  <span
                    className={`text-white ${
                      todo.isCompleted ? "line-through text-white/70" : ""
                    }`}
                  >
                    {todo.todoText}
                  </span>
                  <div className="flex space-x-2 text-white/70">
                    <button
                      onClick={() => toggleTodoState(todo.id)}
                      className={`w-6 h-6 flex items-center justify-center rounded-full ${
                        todo.isCompleted ? "bg-green-500/30" : "bg-white/20"
                      } hover:bg-white/30 transition-colors`}
                    >
                      {todo.isCompleted ? (
                        <Check className="w-4 h-4 text-white" />
                      ) : (
                        <div className="w-3 h-3 rounded-sm border border-white/70 group-hover:border-white"></div>
                      )}
                    </button>
                    <button
                      onClick={() => setEditedTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {todos.length === 0 && (
            <div className="text-center text-white/50 py-6">
              No tasks yet. Add one above!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Todo;
