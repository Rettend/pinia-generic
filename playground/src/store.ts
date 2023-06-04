import { defineStore } from 'pinia'

interface Category {
  id: number
  name: string
}

export const useCategoryStore = defineStore({
  id: 'category',
  state: () => ({
    all: [] as Category[],
    current: undefined as Category | undefined,
  }),
  actions: {
    addEmpty(item: Category) {
      this.all.push(item)
    },
  },
})
