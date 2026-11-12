import { useEffect, useState, type ChangeEvent, type SubmitEvent } from "react";
import FormComponent from "./FormComponent";
import TodosContainer from "./TodosContainer";
import axios from "axios";

export interface TodoCardProps {
  id: string;
  title: string;
  checked: boolean;
}

export interface TodoCardFunction extends TodoCardProps {
  handleTodoCheck: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleEditTodo: (id: string) => void;
}

export interface TodosContainerProps {
  todosList: TodoCardProps[];
  handleTodoCheck: (e: ChangeEvent<HTMLInputElement>, id: string) => void;
  handleDeleteTodo: (id: string) => void;
  handleEditTodo: (id: string) => void;
}

export interface FormComponentProps extends TodoCardProps {
  handleFormOnChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleOnSubmit: (e: SubmitEvent<HTMLFormElement>) => void;
}

export default function ToDoApp() {
  //States_-_-_-_-_-_-_-_-_-_-_-_
  //A state to store the input change
  //Once the submit button is clicked, the state will be stored
  //as a todo entry in the other state that will save a list of todos.
  const [todo, setTodo] = useState<TodoCardProps>({
    id: "",
    title: "",
    checked: false,
  });

  //second state: a state to store all the todo entry in one array
  const [todosList, setTodosList] = useState<TodoCardProps[]>([]);

  //Handlers_-_-_-_-_-_-_-_-_-_-_-_

  //0. Handle getting all the stored data from the localhost:3000 server
  const handleGetData = async () => {
    try {
      await axios
        .get("http://localhost:3000/data")
        .then((data) => setTodosList(data.data));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetData();
  }, []);

  //1. Handle the form input change that will allow typing in the input field
  const handleFormOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setTodo((prevTodo) => ({ ...prevTodo, [e.target.name]: e.target.value }));
  };

  //2. Handle the onSubmit event for the form to add the input to the todo list
  const handleOnSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault(); //to prevent the default refresh action from submitting the form
    if (todo.id === "") {
      //This is creating a new task, then send it to the POST route
      try {
        const newTodo: TodoCardProps = {
          id: crypto.randomUUID(),
          title: todo.title,
          checked: false,
        };
        setTodosList((prevList) => [...prevList, newTodo]);
        await axios.post("http://localhost:3000/data", newTodo);
      } catch (error) {
        console.log(error);
      }
    } else {
      //Edit Section used for PATCH
      setTodosList((prevList) =>
        prevList.map((entry) =>
          entry.id === todo.id ? { ...entry, title: todo.title } : { ...entry },
        ),
      );
    }
    setTodo({
      id: "",
      title: "",
      checked: false,
    }); //reset the input field after submission
  };

  //3. Handle the checkbox toggle in the TodoCard
  const handleTodoCheck = (e: ChangeEvent<HTMLInputElement>, id: string) => {
    setTodosList((prevList) =>
      prevList.map((entry) =>
        entry.id === id
          ? { ...entry, checked: e.target.checked }
          : { ...entry },
      ),
    );
  };

  //4. Handle the deleting an entry using the delete button in the TodoCard
  const handleDeleteTodo = async (id: string) => {
    try {
      //We will send a delete request to the server
      //and add the id to the link to be used as params
      await axios.delete(`http://localhost:3000/data/${id}`);
      setTodosList((prevList) => prevList.filter((entry) => entry.id !== id));
    } catch (error) {
      console.log(console.log(error));
    }
  };

  //5. Handle editing an entry to change the title
  const handleEditTodo = (id: string) => {
    const todoEntry = todosList.find((entry) => entry.id === id) || {
      title: "",
      id: "",
      checked: false,
    };
    setTodo({ ...todoEntry });
  };

  //Main Return_-_-_-_-_-_-_-_-_-_-_-_
  return (
    <div>
      <h1>Todo List App</h1>
      <FormComponent
        {...todo}
        handleFormOnChange={handleFormOnChange}
        handleOnSubmit={handleOnSubmit}
      />
      <TodosContainer
        todosList={todosList}
        handleTodoCheck={handleTodoCheck}
        handleDeleteTodo={handleDeleteTodo}
        handleEditTodo={handleEditTodo}
      />
    </div>
  );
}
