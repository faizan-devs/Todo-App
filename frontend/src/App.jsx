import { useEffect, useState } from "react";
import axios from "axios";
import { MdOutlineDone } from "react-icons/md";
import { IoClose } from "react-icons/io5";
import { MdModeEditOutline } from "react-icons/md";
import { FaTrash } from "react-icons/fa6";

function App() {
  const [newTodo, setNewTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editingTodo, setEditingTodo] = useState(null);
  const [editedText, setEditedText] = useState("");

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const response = await axios.post("/api/todos", { text: newTodo });
      setTodos([...todos, response.data]);
      setNewTodo("");
    } catch (error) {
      console.log("Error adding todo", error);
    }
  };

  const fetchTodos = async () => {
    try {
      const response = await axios.get("/api/todos");
      setTodos(response.data);
    } catch (error) {
      console.log("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const startEditing = (todo) => {
    setEditingTodo(todo._id);
    setEditedText(todo.text);
  };

  const saveEdit = async (id) => {
    try {
      const response = await axios.patch(`/api/todos/${id}`, {
        text: editedText,
      });
      setTodos(todos.map((todo) => (todo._id === id ? response.data : todo)));
      setEditingTodo(null);
    } catch (error) {
      console.log("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`/api/todos/${id}`);
      setTodos(todos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log("Error deleting todo:", error);
    }
  };

  const toggleTodo = async (id) => {
    try {
      const todo = todos.find((t) => t._id === id);
      const response = await axios.patch(`/api/todos/${id}`, {
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t._id === id ? response.data : t)));
    } catch (error) {
      console.log("Error toggling todo:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-lg shadow-md w-full max-w-xl p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
          Task Manager
        </h1>

        <form
          onSubmit={addTodo}
          className="flex items-center gap-2 border border-gray-300 p-3 rounded-md bg-gray-50"
        >
          <input
            className="flex-1 outline-none px-3 py-2 text-sm text-gray-800 placeholder-gray-400 bg-transparent"
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            required
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add
          </button>
        </form>

        <div className="mt-6">
          {todos.length === 0 ? (
            <p className="text-center text-sm text-gray-500">No tasks yet</p>
          ) : (
            <div className="flex flex-col gap-3">
              {todos.map((todo) => (
                <div
                  key={todo._id}
                  className="bg-white border border-gray-200 rounded-md p-4 flex justify-between items-center shadow-sm"
                >
                  {editingTodo === todo._id ? (
                    <div className="flex w-full gap-3 items-center">
                      <input
                        className="flex-1 border border-gray-300 p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        type="text"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                      />
                      <button
                        onClick={() => saveEdit(todo._id)}
                        className="text-green-600 hover:text-green-800"
                      >
                        <MdOutlineDone size={20} />
                      </button>
                      <button
                        onClick={() => setEditingTodo(null)}
                        className="text-gray-500 hover:text-gray-700"
                      >
                        <IoClose size={20} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center gap-4 w-full">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <button
                          onClick={() => toggleTodo(todo._id)}
                          className={`h-5 w-5 flex-shrink-0 rounded-full border flex items-center justify-center transition-colors duration-200 ${
                            todo.completed
                              ? "bg-green-500 border-green-500 text-white"
                              : "border-gray-300 hover:border-blue-400"
                          }`}
                        >
                          {todo.completed && <MdOutlineDone size={14} />}
                        </button>

                        <span
                          className={`text-sm font-medium truncate ${
                            todo.completed
                              ? "line-through text-gray-400"
                              : "text-gray-800"
                          }`}
                        >
                          {todo.text}
                        </span>
                      </div>

                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => startEditing(todo)}
                          className="text-blue-500 hover:text-blue-700"
                        >
                          <MdModeEditOutline size={16} />
                        </button>
                        <button
                          onClick={() => deleteTodo(todo._id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
