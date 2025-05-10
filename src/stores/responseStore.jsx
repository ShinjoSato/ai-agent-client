import { create } from 'zustand'
import { Languages, User, Bot } from 'lucide-react';

export const useResponseStore = create((set) => ({
  responseList: [{
    iconComponent: <Languages className="h-4 w-4 text-sky-500"/>,
    type: 'language',
    title: '',
    subtitle: ''
  }, {
    iconComponent: <User className="h-4 w-4 text-sky-500"/>,
    type: 'request',
    title: '',
    subtitle: ''
  }, {
    iconComponent: <Bot className="h-4 w-4 text-sky-500"/>,
    type: 'response',
    title: '',
    subtitle: ''
  }],

  setResponseList:(type, title, subtitle) => set((state) => ({
    responseList: state.responseList.map((item) => item.type === type ? { ...item, title, subtitle } : item)
  })),
}))
