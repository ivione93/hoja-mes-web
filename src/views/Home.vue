<template>
  <div class="container is-fluid" v-if="user">
    {{ user.email }}
  </div>
  <div class="container is-fluid" v-else>
    No se ha encontrado usuario
  </div>
</template>

<script>
import firebase from 'firebase'
export default {
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
