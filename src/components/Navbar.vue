<template>
    <div>
        <v-app-bar class="d-flex" elevation="0" height="85" style="align-items: center;">
            <p class="font-weight-bold text-center mx-5" style="font-size: 1.3em;letter-spacing: -1px;">Dracker</p>
            <div class="mx-auto d-flex" style="align-items: center;">
                <v-responsive min-width="180" max-width="250">
                    <v-form class="d-flex" @submit.prevent="submit">
                        <v-text-field placeholder="Buscar" hide-details="auto" variant="solo"
                            prepend-inner-icon="mdi-magnify" v-model="search.value.value"
                            :error-messages="search.errorMessage.value" @keyup.prevent="submit"></v-text-field>
                    </v-form>
                </v-responsive>
                <v-btn color="warning" variant="plain" @click="handleReset">Reset</v-btn>
            </div>

        </v-app-bar>

        <!-- Busqueda de notas -->
        <v-btn v-if="props.booleanSearch" variant="plain" @click="props.search(false), handleReset()">
            <v-icon class="text-h5 font-weight-bold" icon="mdi-chevron-left"></v-icon>
            volver
        </v-btn>
        <h1 v-if="props.booleanSearch" class="text-h3 font-weight-medium mx-10 my-6">Busqueda:</h1>

        <!-- Notas buscada -->
        <div v-if="props.booleanSearch" class="d-flex my-5 mx-5" style="flex-wrap: wrap; justify-content: center;">
            <v-card v-for="item in searchNotes" class="ma-5" height="300" width="285" :color="newColor()"
                style="border-radius: 20px;">

                <div style="height: 81%">
                    <div class="d-flex" style="justify-content: space-between;">
                        <v-btn icon="mdi-link" variant="plain" @click="props.showNote(item.id)"></v-btn>
                        <v-btn :icon="item.fixed ? 'mdi-pin' : 'mdi-pin-outline'" variant="plain"
                            style="transform: rotate(45deg)" @click="fixed(item.id)"></v-btn>
                    </div>
                    <v-card-title class="font-weight-bold pr-0" style="font-size: 22px">{{ item.title }}</v-card-title>
                    <v-card-text class="mt-2 font-weight-regular"
                        style="font-size: 20px; max-height: 147px; text-overflow: ellipsis; overflow: hidden;">{{ item.note
                        }}</v-card-text>
                </div>

                <div class="d-flex" style="justify-content: start; align-items: center; width: 100%">
                    <v-card-subtitle>{{ formatDate(item.createdAt) }}</v-card-subtitle>
                </div>

            </v-card>
        </div>
        <h3 v-if="searchNotes.length === 0 && props.booleanSearch" class="text-h5 text-center">No se encontraron notas</h3>
    </div>
</template>

<script setup>
import { useField, useForm } from 'vee-validate';
import { ref, defineProps } from 'vue';

const props = defineProps(['search', 'booleanSearch', 'showNote', 'fixedNote'])

const searchNotes = ref([])

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        search(value) {
            if (value?.length < 0 || !value?.trim()) return 'Busqueda invalida'
            return true
        },
    }
})
const search = useField('search')

const submit = handleSubmit(async value => {
    props.search(true)
    await fetch('http://localhost:3000/search/note', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(value)
    })
        .then(async response => {
            const resDB = await response.json()
            if (resDB.error) return
            searchNotes.value = resDB.data
        })
        .catch(err => console.log(err))
})


const fixed = async (id) => {
    await props.fixedNote(id)
    await submit()
}
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
</script>