import { useState } from "react";
import { create } from "zustand";
import { persist } from 'zustand/middleware';


interface BearState {


    bears : number;
    artırma :()=> void;
    resetle : ()=> void;

    
}


const bearStore = create<BearState>((set) => ({
  
bears : 0,
artırma : () => set((state) => ({bears : state.bears+1}) ),
resetle : ()  => set({bears:0})

}))

export default bearStore