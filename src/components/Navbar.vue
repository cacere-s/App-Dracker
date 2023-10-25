<template>
    <div>
        <v-app-bar class="d-flex" elevation="0" style="align-items: center;">
            <p class="font-weight-bold text-center mx-5" style="font-size: 1.3em;letter-spacing: -1px;">Dracker</p>
            <v-responsive class="mx-auto" min-width="200" max-width="300">
                <v-text-field placeholder="Search" hide-details="auto" variant="solo" prepend-inner-icon="mdi-magnify"></v-text-field>
            </v-responsive>
        </v-app-bar>
    </div>
</template>

<script setup>
import { ref,defineProps } from 'vue';

const searchNavbar = ref()


const props = defineProps(['search'])
</script>