<template>
  <div class="container is-fluid" v-if="user">
    <div class="columns">
      <div class="column is-three-quarters mt-10">
        <!-- Entrenamientos -->
        <p class="subtitle is-4">Entrenamientos</p>
        <Trainings v-bind:email="user.email"/>
      </div>
      <div class="column mt-10">
        <!-- Usuario -->
        <p class="subtitle is-4">Usuario</p>
        <User v-bind:email="user.email"/>
        <hr>
        <p class="subtitle is-4">Competiciones</p>
        <Competitions v-bind:email="user.email"/>
      </div>
    </div>
  </div>
  <div class="container is-fluid" v-else>
    No se ha encontrado usuario
  </div>
</template>

<script>
import firebase from 'firebase'
import Competitions from '../components/layout/Competitions.vue';
import Trainings from '../components/layout/Trainings.vue';
import User from '../components/layout/User.vue';

export default {
  components: {
    Competitions,
    Trainings,
    User
  },
  name: 'Home',
  data() {
    return {
        user: null
    };
  },
  created() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            this.user = user
        } else {
            this.user = null
        }                    
    })   
  }
}
</script>
