import { create } from 'zustand'
import { Languages, User, Bot } from 'lucide-react';
import { Avatar, AvatarImage } from "@/components/ui/avatar"

export const useResponseStore = create((set) => ({
  responseList: [],
  setResponseList: (data) => set((state) => ({
    responseList: [
      ...state.responseList,
      {
        ...data,
        iconComponent: (data.user.type === 1)
          ? <User className="h-4 w-4 text-sky-500"/>
          : <Bot className="h-4 w-4 text-sky-500"/>
      }
    ]
  })),
}))
