//this component will contain
//1. a body for the title of the todo message
//2. a button for deleting this todo entry
//3. a button to edit this todo entry
//4. a checkbox that will be used to check the entry if completed.

import type { TodoCardFunction } from "./TodoApp";

export default function TodoCard({
  id,
  checked,
  title,
  handleTodoCheck,
  handleDeleteTodo,
  handleEditTodo,
}: TodoCardFunction) {
  return (
    <div>
      <input
        type="checkbox"
        name="checked"
        id="checked"
        checked={checked}
        onChange={(e) => handleTodoCheck(e, id)}
      />
      <span>{title}</span>
      <button onClick={() => handleDeleteTodo(id)}>Delete</button>
      <button onClick={() => handleEditTodo(id)}>Edit</button>
    </div>
  );
}
