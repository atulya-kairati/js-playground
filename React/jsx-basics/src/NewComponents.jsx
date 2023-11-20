import { MyBanner } from "./MyBanner";
import { TodoList } from "./TodoList";
import { TodoListClass } from "./TodoListClass";

export function NewComponents() {
  return (
    <div>
      <MyBanner />
      <h1>Todo List</h1>
      <TodoList />
      <TodoListClass />
    </div>
  );
}
