// @ts-check
import { create } from "zustand";

export const useGuilds = create((set) => ({
	array: [],
	setArray: (array) => set(() => ({ array })),
}));