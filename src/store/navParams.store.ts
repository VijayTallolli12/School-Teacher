import { create } from "zustand";

interface NavParams {
  [key: string]: any;
}

interface NavParamStore {
  params: NavParams;
  setParams: (key: string, value: any) => void;
  clearParams: (key: string) => void;
}

export const useNavParamStore = create<NavParamStore>((set) => ({
  params: {},
  setParams: (key, value) =>
    set((s) => ({ params: { ...s.params, [key]: value } })),
  clearParams: (key) =>
    set((s) => {
      const { [key]: _, ...rest } = s.params;
      return { params: rest };
    }),
}));
