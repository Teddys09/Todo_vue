<template>
  <div class="flex justify-center px-5">
    <div class="flex flex-col relative">
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
          :class="
            (task.completed ? 'bg-green-200' : 'bg-red-200',
            noteModal ? 'opacity-50' : 'opacity-100')
          "
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

          <button
            v-if="task.note"
            class="w-6 rounded"
            @click="displayNote(task.note)"
          >
            <img class="w-full" :src="Note" alt="Note" />
          </button>

          <button
            v-if="!task.note"
            class="w-6 rounded"
            @click="addNewNote(task.id)"
          >
            <img class="w-full" :src="addNote" alt="Add Note" />
          </button>
        </div>
      </div>
      <div v-if="noteModal" class="h-full w-full absolute z-10">
        <div class="flex flex-col items-center">
          <input
            type="text"
            class="border-2 border-gray-300 p-2 rounded-lg h-20 w-full"
            placeholder="Add Note"
            v-model="noteRef"
          />
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded w-full"
            @click="addNewNote()"
            :disabled="!noteRef"
          >
            Add
          </button>
        </div>
      </div>
      <div
        v-if="noteDivOpen"
        class="h-full w-full absolute z-10 bg-blue-500 flex justify-between items-center flex-col"
      >
        <div class="text-white mt-6">
          {{ actualNote }}
        </div>

        <button
          @click="displayNote()"
          class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mb-6"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import Note from '../assets/icons/note-sticky-solid.svg';
import addNote from '../assets/icons/notes-medical-solid.svg';
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
        note: doc.data().note,
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

// note
const noteRef = ref('');
const noteModal = ref(false);
const noteId = ref('');
const addNewNote = (id) => {
  if (id !== undefined) {
    noteId.value = id;
  }

  noteModal.value = !noteModal.value;

  if (noteRef.value.length > 0) {
    updateDoc(doc(db, 'todos', noteId.value), {
      note: noteRef.value,
    });
    noteRef.value = '';
    noteId.value = '';
  }
};

const noteDivOpen = ref(false);
const actualNote = ref('');

const displayNote = (note) => {
  noteDivOpen.value = !noteDivOpen.value;
  actualNote.value = note;
};
</script>
