import { create } from 'zustand'
import { User, Bot } from 'lucide-react';

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
  roleList: [],
  setRoleList: (data) => set((state) => ({
    roleList: [
      ...state.roleList,
      {
        ...data
      }
    ]
  })),
}))
