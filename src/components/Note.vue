<template>
  <v-container fluid>
    <!-- Navbar -->
    <Navbar :search="searchNotes" :booleanSearch="search" :editNote="showNote" :showNote="noteDB" 
    :fixedNote="fixedNote" :update="update"/>

    <!-- snackbar -->
    <v-snackbar v-model="snack.boolean" :color="snack.color" timeout="3000" vertical>
      <p class="text-h6">{{ snack.title }}</p>
      <p class="text-h6 text-subtitle-1">{{ snack.subtitle }} </p>
    </v-snackbar>    

    <!-- Titulo de Notas -->
    <div v-if="!search" class="d-flex mt-5 mb-4 mx-10" style="align-items: center;">
      <h1 class="text-h2 font-weight-bold mr-10">Notas</h1>
      <div>
        <v-btn icon="mdi-plus" color="black" @click="create = !create"></v-btn>
        <v-tooltip activator="parent" location="bottom">Crear nota</v-tooltip>
      </div>
    </div>

    <!-- Notas -->
    <div v-if="!search" class="my-5 mx-5 d-flex" style="flex-wrap: wrap; justify-content: center;">

      <!-- Notas fijas -->
      <v-card v-for="item in notesFixed" class="ma-5" height="300" width="285" :color="newColor()"
        style="border-radius: 20px;">

        <div style="height: 81%">
          <div class="d-flex" style="justify-content: space-between;">
            <v-btn icon="mdi-link" variant="plain" @click="noteDB(item.id)"></v-btn>
            <v-btn :icon="item.fixed ? 'mdi-pin' : 'mdi-pin-outline'" variant="plain" style="transform: rotate(45deg)"
              @click="fixedNote(item.id)"></v-btn>
          </div>
          <v-card-title class="font-weight-bold pr-0" style="font-size: 22px">{{ item.title }}</v-card-title>
          <v-card-text class="mt-2 font-weight-regular" style="font-size: 20px; max-height: 147px; text-overflow: ellipsis; overflow: hidden;" >{{item.note }}</v-card-text>
        </div>

        <div class="d-flex" style="justify-content: space-between; align-items: center; width: 100%">
          <v-card-subtitle>{{ formatDate(item.createdAt) }}</v-card-subtitle>
          <v-btn icon="mdi-pencil" variant="plain" @click="showNote(item.id)"></v-btn>
        </div>

      </v-card>

      <!-- Notas -->
      <v-card v-for="item in notes" class="ma-5" height="300" width="285" :color="newColor()" style="border-radius: 20px;">

        <div style="height: 81%">
          <div class="d-flex" style="justify-content: space-between;">
            <v-btn icon="mdi-link" variant="plain" @click="noteDB(item.id)"></v-btn>
            <v-btn :icon="item.fixed ? 'mdi-pin' : 'mdi-pin-outline'" variant="plain" style="transform: rotate(45deg)"
              @click="fixedNote(item.id)"></v-btn>
          </div>
          <v-card-title class="font-weight-bold pr-0" style="font-size: 22px">{{ item.title }}</v-card-title>
          <v-card-text class="mt-2 font-weight-regular"
            style="font-size: 20px; max-height: 147px; text-overflow: ellipsis; overflow: hidden;">
            {{ item.note }}</v-card-text>
        </div>

        <div class="d-flex" style="justify-content: space-between; align-items: center; width: 100%">
          <v-card-subtitle>{{ formatDate(item.createdAt) }}</v-card-subtitle>
          <v-btn icon="mdi-pencil" variant="plain" @click="showNote(item.id)"></v-btn>
        </div>


      </v-card>


      <!-- agregar -->
      <v-card class="d-flex ma-5" height="300" width="285" color="blue-grey-lighten-4" @click="create = !create"
        style="justify-content: center; align-items: center;border-radius: 20px;">
        <v-icon class="text-h2" icon="mdi-plus"></v-icon>
      </v-card>


    </div>

    <!-- Dialogo -->
    <div>
      <!-- Crear -->
      <v-dialog v-model="create" width="850" persistent>
        <v-card class="pa-5">
          <div class="d-flex" style="justify-content: space-between;">
            <v-card-title class="text-h5 font-weight-bold">Crear</v-card-title>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
          </div>
          <v-form @submit.once="createNote">

            <v-text-field class="text-h4 pt-0 font-weight-bold mb-2" v-model="title.value.value"
              :error-messages="title.errorMessage.value" placeholder="Title" variant="underlined"></v-text-field>

            <v-textarea height="400" placeholder="Note" v-model="note.value.value"
              :error-messages="note.errorMessage.value" variant="underlined"></v-textarea>

            <div class="d-flex my-4" style="justify-content: space-between;align-items: center;">
              <div>
                <v-tooltip activator="parent" location="top">Fijar</v-tooltip>
                <v-switch color="success" hide-details inset false-value="0" true-value="1" v-model="fixed.value.value"
                  :error-messages="fixed.errorMessage.value"></v-switch>
              </div>

              <div class="text-end">
                <v-btn class="ma-1" color="warning" @click="handleReset()">limpiar</v-btn>
                <v-btn type="submit" class="mx-1" color="info">Crear nota</v-btn>
              </div>

            </div>

          </v-form>
        </v-card>
      </v-dialog>

      <!-- Editar -->
      <v-dialog v-model="edit" width="850" persistent>
        <v-card class="pa-5">
          <div class="d-flex" style="justify-content: space-between;">
            <v-card-title class="text-h5 font-weight-bold">Editar</v-card-title>
            <v-btn icon="mdi-close" variant="text" @click="close"></v-btn>
          </div>
          <v-form @submit.prevent="editNote">

            <v-text-field class="text-h2 font-weight-bold my-2" elevation="0" v-model="title.value.value"
              :error-messages="title.errorMessage.value" placeholder="Title" variant="underlined"></v-text-field>

            <v-textarea height="400" placeholder="Note" v-model="note.value.value"
              :error-messages="note.errorMessage.value" variant="underlined"></v-textarea>

            <div class="d-flex my-4" style="justify-content: end">
              <div class="text-end">
                <v-btn class="ma-1" color="error" @click="deleteNote">Eliminar nota</v-btn>
                <v-btn type="submit" class="mx-1" color="info">Actualizar nota</v-btn>
              </div>

            </div>

          </v-form>
        </v-card>
      </v-dialog>

      <!-- mostrar nota -->
      <v-dialog v-model="show" width="850" persistent>
        <v-card class="pa-5" height="400">
          <div class="d-flex" style="justify-content: space-between;">
            <v-card-title class="text-h5 font-weight-bold">Nota</v-card-title>
            <v-btn icon="mdi-close" variant="text" @click="show = false"></v-btn>
          </div>
          <v-card-title class="mb-5">{{ showNoteDB.title }}</v-card-title>
          <v-divider></v-divider>
          <v-card-text>{{ showNoteDB.note }}</v-card-text>
         
        </v-card>
      </v-dialog>

    </div>

  </v-container>
</template>

<script setup>
import { ref, onBeforeMount } from 'vue';
import { useField, useForm } from 'vee-validate'

import Navbar from './Navbar.vue';

const create = ref(false)
const edit = ref(false)
const show = ref(false)
const idNote = ref()
const showNoteDB = ref({})

const search = ref(false)
const update = ref(false)

const notes = ref(null)
const notesFixed = ref(null)

const snack = ref({
  title: '',
  subtitle: '',
  color: '',
  boolean: false
})

const newColor = () => {
  const simbols = "0123456789ABCDEF";
  let color = "#";
  const transparent = 'a5'

  for (var i = 0; i < 6; i++) {
    color = color + simbols[Math.floor(Math.random() * 16)];
  }
  return color + transparent
}

const formatDate = (date) => {
  const newDate = date.split("T")
  const format = new Date(newDate).toLocaleDateString('es-es', { weekday: "long", year: "numeric", month: "short", day: "numeric" }).split(",")
  return format[1]
}

const close = () => {
  create.value = false
  edit.value = false
  update.value = false
  handleReset()
}

const { handleReset, handleSubmit } = useForm({
  validationSchema: {
    title(value) {
      if (value?.length >= 21) return 'Titulo Largo'
      return true
    },
    note(value) {
      if (value?.length < 4) return 'Nota Invalida'
      if(value?.length > 300) return 'Nota muy Larga'
      return true
    },
    fixed(value) {
      return true
    }
  }
})

const title = useField('title')
const note = useField('note')
const fixed = useField('fixed')


// funcion para crear
const createNote = handleSubmit(async value => {
  await fetch('http://localhost:3000/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(value)
  }).then(async response => {
    const resDB = await response.json()
    snack.value = resDB

  })
    .catch(error => console.error(error))
    .finally(async () => {
      await database()
      close()
    })
})

// funcion para traer contenido de la nota
const showNote = async (id) => {
  edit.value = !edit.value
  idNote.value = id
  await fetch(`http://localhost:3000/note/${id}`)
    .then(async response => {
      const resDB = await response.json()
      title.value.value = resDB.title
      note.value.value = resDB.note

    })
    .catch(err => console.error(err))
}

// funcion para editar
const editNote = handleSubmit(async value => {
  await fetch(`http://localhost:3000/update/${idNote.value}`, {
    method: "PUT",
    headers: {
      'Content-Type': "application/json"
    },
    body: JSON.stringify(value)
  })
    .then(async response => {
      const resDB = await response.json()
      snack.value = resDB
      update.value = true
    })
    .catch(err => console.error(err))
    .finally(async () => {
      await database()
      close()
    })
})

// funcion para mostrar nota individual
const noteDB = async (id) => {
  show.value = true
  await fetch(`http://localhost:3000/note/${id}`)
    .then(async response => {
      const resDB = await response.json()
      showNoteDB.value = resDB
    })
    .catch(err => console.error(err))
}

// funcion para eliminar
const deleteNote = async () => {
  await fetch(`http://localhost:3000/delete/${idNote.value}`, {
    method: "DELETE"
  })
    .catch(err => console.error(err))
    .finally(async () => {
      await database()
      close()
    })
}

// funcion para fijar
const fixedNote = async (id) => {
  await fetch(`http://localhost:3000/fixed/${id}`, {
    method: "PUT"
  })
    .catch(err => console.error(err))
    .finally(async () => {
      await database()
    })
}

const searchNotes = (boolean) => {
  search.value = boolean
}


const database = async () => {
  await fetch('http://localhost:3000')
    .then(async response => {
      const resDB = await response.json();
      notes.value = resDB.notes
      notesFixed.value = resDB.notesFixed
    })
    .catch(err => console.error(err))
}

onBeforeMount(async () => {
  await database()
})
</script>
