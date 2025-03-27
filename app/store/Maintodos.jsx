import React from "react";
import { useTodosStore } from "./todos";

const Maintodos = () => {
  const todos = useTodosStore((state) => state.todos);

  return (
    <div>
      {todos.length === 0 && <div>Hiç todo eklememişsin</div>}

      {todos.map((todo, key) => (
        <div key={key}>
          {todo.title} <br />
          {todo.completed ? "Tamamlandı" : "Bekliyor"}
        </div>
      ))}
    </div>
  );
};

export default Maintodos;
