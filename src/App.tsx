import { useState, useEffect } from "react";
import "./App.css";

interface TodoType {
  id: string;
  title: string;
  is_completed: boolean;
}

function App() {
  const [title, setTitle] = useState<string>("");
  const [isFetchTodo, setIsFetchTodo] = useState(true);
  const [todos, setTodos] = useState<TodoType[]>([]);

  const fetchAllTodos = async () => {
    const response = await fetch("http://127.0.0.1:8000/todos/active");
    const todoResponse = await response.json();
    setTodos(todoResponse);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (title.length > 3) {
      const formData = new FormData();
      formData.append("title", title);
      await fetch("http://127.0.0.1:8000/todo/create", {
        method: "POST",
        body: formData,
      });

      setIsFetchTodo(true);
    }
  };

  useEffect(() => {
    if (isFetchTodo) {
      fetchAllTodos();
    }
    setIsFetchTodo(false);
  }, [isFetchTodo]);

  const removeHandler = async (id) => {
    await fetch("http://127.0.0.1:8000/todo/" + id, {
      method: "PATCH",
    });
    setIsFetchTodo(true);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <input
            name="title"
            placeholder="Enter title"
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <button>Add Task</button>
      </form>

      <div>
        {todos.map((item) => (
          <li>
            {item.title}{" "}
            <button onClick={() => removeHandler(item.id)}>
              Mark as complete
            </button>
          </li>
        ))}
      </div>
    </div>
  );
}

export default App;
