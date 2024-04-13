import { create } from 'zustand'

interface MutedState {
    muted: boolean;
    onMuted: (value: boolean) => void; 
}

const useMutedStore = create<MutedState>((set) => ({
    muted: false,
    onMuted: (value) => set({ muted: value })
}));

export default useMutedStore;
