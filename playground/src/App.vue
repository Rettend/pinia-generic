<script setup lang="ts">
import { useCategoryStore } from './store'

const category = useCategoryStore()
console.log(category.all)
</script>

<template>
  <div flex="~ col" font-sans p-3 gap-4>
    <div
      flex items-center justify-center w-32 h-32 text-4xl font-bold text-white bg-blue-500 rounded-full cursor-pointer
      @click="category.add({ name: 'Cat', id: category.getMaxId + 1 })"
    >
      +
    </div>
    <div
      v-for="item in category.all.value"
      :key="item.id"
      flex items-center justify-center w-32 h-32 text-4xl font-bold text-white bg-blue-500 rounded-full cursor-pointer
      @click="category.remove(item.id)"
    >
      {{ item.id }}
      {{ item.name }}
    </div>
  </div>
</template>
