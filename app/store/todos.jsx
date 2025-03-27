import { create } from "zustand";


export const UseTodosStore = create((set) =>({
     todos : [
        {
            title :'Todo 1',
            completed : falsef
        }
     ],
     addTodo : item => set(state => [...state.todos,item]),
     removeTodo : id => set(state => state.filter((_,key)=> id ==! key   ))
}))