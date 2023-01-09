<template>
  <div class="flex justify-center px-5">
    <div class="flex flex-col">
      <div class="flex justify-between">
        <input
          type="text"
          class="border-2 border-gray-300 p-2 rounded-lg"
          placeholder="Add Task"
          v-model="task"
        />
        <button
          class="bg-blue-500 ml-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          @click="addTask"
          :disabled="!task"
        >
          Add
        </button>
      </div>
      <div class="flex flex-col mt-5">
        <div
          v-for="(task, index) in tasks"
          :key="index"
          class="flex mb-3 justify-between items-center p-2 border-2 border-gray-300 rounded-lg"
          :class="task.completed ? 'bg-green-200' : 'bg-red-200'"
        >
          <div>{{ task.name }}</div>
          <button
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            @click="doneTask(task.id)"
          >
            Done
          </button>
          <button
            class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            @click="removeTask(task.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { db } from '../assets/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
// firebase
const todosCollectionRef = collection(db, 'todos');
const todosCollectionQuery = query(
  todosCollectionRef,
  orderBy('date', 'desc'),

  limit(20)
);
// gettodos
const task = ref('');
const tasks = ref([]);
onMounted(async () => {
  onSnapshot(todosCollectionQuery, (querySnapshot) => {
    const fbTodos = [];
    querySnapshot.forEach((doc) => {
      const todo = {
        id: doc.id,
        name: doc.data().name,
        completed: doc.data().completed,
      };
      fbTodos.push(todo);
    });
    tasks.value = fbTodos;
  });
});

const addTask = () => {
  addDoc(collection(db, 'todos'), {
    name: task.value,
    completed: false,
    date: Date.now(),
  });
  task.value = '';
};

const doneTask = (id) => {
  const todo = tasks.value.find((task) => task.id === id);
  todo.completed = !todo.completed;
  updateDoc(doc(db, 'todos', id), {
    completed: todo.completed,
  });
};

const removeTask = (id) => {
  deleteDoc(doc(db, 'todos', id));
};
</script>
