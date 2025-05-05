import { create } from 'zustand'

export const useResponseStore = create((set) => ({
  language: '',
  request: '',
  response: '',
  setLanguage: (language) => set({ language }),
  setRequest: (request) => set({ request }),
  setResponse: (response) => set({ response }),

  // 共通のアニメーション関数
  animateSetText: async ({ key, text, interval = 50 }) => {
    set({ [key]: '' })
    for (let i = 1; i <= text.length; i++) {
      await new Promise(res => setTimeout(res, interval))
      set({ [key]: text.slice(0, i) })
    }
  }
}))
