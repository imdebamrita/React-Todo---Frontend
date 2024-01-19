import { useEffect, useRef, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { MdDeleteOutline } from "react-icons/md";
import { FiEdit3 } from "react-icons/fi";

import "./App.css";

type sentTodo = {
  description: string;
  completed: boolean;
  category: string;
};

type getTodo = {
  id: number;
  description: string;
  completed: boolean;
  category: string;
  created_at: string;
};

const categories = ["Study", "Work", "Home"];

function App() {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<getTodo[]>([]);
  const [category, setCategoty] = useState<string>(categories[0]);

  const inputRef = useRef<HTMLInputElement | null>(null);

  async function getAllTodo() {
    try {
      const responce = await fetch("http://localhost:5000/todos");
      const data = await responce.json();

      setTodos(data);
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getAllTodo();
    inputRef.current?.focus();
  }, []);

  async function addTodo(e: any) {
    e.preventDefault();
    if (!todo) {
      alert("No Todo!!");
      return;
    }
    try {
      const body: sentTodo = {
        description: todo,
        completed: false,
        category: category,
      };

      const response = await fetch("http://localhost:5000/todos/create", {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(body),
      });

      setTodo("");
      console.log(response);
      getAllTodo();
      // window.location = "/";
    } catch (error) {
      console.log(error);
    }
    // const newTodos: Todo[] = [
    //   {
    //     content: todo,
    //     complete: false,
    //     category: category,
    //     createdAt: new Date(Date.now()),
    //   },
    //   ...todos,
    // ];
    // setTodo("");
    // setTodos(newTodos);
  }

  async function completeTodoToggle(id: number) {
    try {
      const response = await fetch(
        `http://localhost:5000/todos/toggleComplete/${id}`,
        {
          method: "PUT",
        }
      );
      getAllTodo();
    } catch (error) {
      console.log(error);
    }

    // let newTodos: Todo[] = [...todos];
    // newTodos[index].completed = !todos[index].completed;
    // setTodos(newTodos);
  }

  async function editTodo(description: string, id: number) {
    setTodo(description);
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      getAllTodo();
    } catch (error) {
      console.log(error);
    }
  }

  async function removeTodo(id: number) {
    const isConfirmed = window.confirm("Are you sure to delete this Todo?");

    if (!isConfirmed) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:5000/todos/${id}`, {
        method: "DELETE",
      });
      console.log(response);
      getAllTodo();
    } catch (error) {
      console.log(error);
    }

    // const newTodos = [...todos];
    // newTodos.splice(index, 1);
    // setTodos(newTodos);
  }

  return (
    <>
      <div className="flex flex-col items-center gap-8 min-h-screen min-w-screen bg-zinc-900">
        {/* <div> */}
        <form
          className="flex gap-4 mt-20 w-[calc(90vw)] sm:w-[calc(80vw)] md:w-1/2"
          onSubmit={addTodo}
        >
          <input
            type="text"
            ref={inputRef}
            placeholder="Enter The Todo"
            onChange={(e) => setTodo(e.target.value)}
            className="w-full p-2 rounded-lg focus:outline-none"
            value={todo}
          />
          <select
            className="bg-gray-700 text-gray-300 p-2 text-sm rounded-lg focus:outline-none"
            onChange={(e) => setCategoty(e.target.value)}
          >
            {categories.map((category, index) => {
              return (
                <option key={index} value={category}>
                  {category}
                </option>
              );
            })}
          </select>
          <button
            type="submit"
            // onClick={() => addTodo()}
            className="text-zinc-900 bg-gradient-to-r from-indigo-500  to-pink-500 p-2 px-4 rounded-lg hover:opacity-80 active:opacity-50 active:scale-90"
          >
            <IoMdAdd />
          </button>
        </form>
        {/* </div> */}
        <div className="flex flex-col gap-5 w-[calc(90vw)] sm:w-[calc(80vw)] md:w-1/2 overflow-x-clip overflow-y-scroll no-scrollbar max-h-[calc(70vh)]">
          {todos.map((todo) => {
            return (
              <div
                key={todo.id}
                className={`flex justify-between ${
                  todo.completed && "opacity-50"
                }`}
              >
                <div className="flex gap-4 items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded-full bg-gray-700 cursor-pointer"
                    onChange={() => {
                      completeTodoToggle(todo.id);
                    }}
                    defaultChecked={todo.completed}
                  />
                  <p
                    className={`text-gray-300 ${
                      todo.completed && "line-through"
                    }`}
                  >
                    {todo.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-gray-600 text-sm">
                    {new Date(todo.created_at).toLocaleString("en-US", {
                      timeZone: "Asia/Kolkata",
                      hour12: true,
                    })}
                  </p>
                  <p
                    className={`text-gray-800 p-1.5 text-sm rounded-lg
                  ${todo.category == "Study" && "bg-green-200"} 
                  ${todo.category == "Work" && "bg-sky-200"} 
                  ${todo.category == "Home" && "bg-yellow-200"} `}
                  >
                    {todo.category}
                  </p>
                  <button
                    className="bg-gradient-to-r from-indigo-500  via-indigo-400  to-indigo-500  p-2 rounded-lg hover:opacity-80 active:opacity-50 active:scale-90"
                    onClick={() => editTodo(todo.description, todo.id)}
                  >
                    <FiEdit3 />
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-600 via-red-500 to-red-600 p-2 rounded-lg hover:opacity-80 active:opacity-50 active:scale-90"
                    onClick={() => removeTodo(todo.id)}
                  >
                    <MdDeleteOutline />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

export default App;
