import { create } from 'zustand';

interface UserState {
users: any[];
fethusers : () =>Promise<void>

}