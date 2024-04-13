import { create } from 'zustand';

interface useDashboardMenuModal{
    isOpen: boolean;
    onOpen: () => void;
    onClose: () => void;
}

const useDashboardMenuModal = create<useDashboardMenuModal> ((set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false })
}));

export default useDashboardMenuModal;