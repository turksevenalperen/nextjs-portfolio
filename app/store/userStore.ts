import { create } from "zustand";

interface UserState {

users : any[];

fetchUser : () => Promise<void>;

}


const useUserStore  = create<UserState>((set) => ({

    users: [],
    fetchUser: async () =>{
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        const data = await response.json();
        set({ users : data})

    },
}));

export default useUserStore;