<template>
  <Note/>
</template>

<script>
import { defineComponent } from 'vue';

// Components
import Navbar from '../components/Navbar.vue'
import Note from '../components/Note.vue';

export default defineComponent({
  name: 'HomeView',

  components: {
    Navbar,
    Note,
  },
});
</script>
