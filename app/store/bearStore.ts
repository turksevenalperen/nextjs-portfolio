import { create } from "zustand";


interface BearState{
bears: number;
guncelleme : () =>void;
resetleme : () => void;
}


const bearStore = create<BearState>((set) => ({
    bears :0,
    guncelleme : () =>set((state)=> ({bears:state.bears+1})  )
    resetleme : () => set({bears:0}),


}) )

export default bearStore