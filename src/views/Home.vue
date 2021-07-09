<template>
  <v-container class="mt-70" fluid v-if="user">
    <v-row>
      <v-col cols="12" md="8">
        <!-- Entrenamientos -->
        <Calendar v-bind:email="user.email"/>
      </v-col>
      <v-col cols="12" md="4">
        <!-- Usuario -->
        <User v-bind:email="user.email"/>
        <br><hr><br>
        <Training v-bind:email="user.email"/>
        <br><hr><br>
        <LastCompetition v-bind:email="user.email"/>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import firebase from 'firebase';
import Calendar from '../components/layout/Calendar.vue';
import User from '../components/layout/User.vue';
import Training from '../components/layout/Training.vue';
import LastCompetition from '../components/layout/LastCompetition.vue';

export default {
  components: {
    Calendar,
    User,
    Training,
    LastCompetition
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
