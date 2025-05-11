import { create } from 'zustand'
import { Languages, User, Bot } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const useResponseStore = create((set) => ({
  responseList: [{
    iconComponent: <User className="h-4 w-4 text-sky-500"/>,
    type: 0,
    title: '',
    subtitle: ''
  }, {
    iconComponent: <Bot className="h-4 w-4 text-sky-500"/>,
    type: 1,
    title: '',
    subtitle: ''
  }],

  setResponseList:(type, title, subtitle) => set((state) => ({
    responseList: state.responseList.map((item) => item.type === type ? { ...item, title, subtitle } : item)
  })),
}))
