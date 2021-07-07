<template>
  <div class="container is-fluid mt-50">
    <div class="columns">
      <Info />
      <div class="column is-half">
          <h3 class="title is-3">ALTA USUARIO</h3>
        <form action="#" @submit.prevent="register" class="box">
          <div class="field">
            <label class="label">INTRODUCE TUS DATOS DE REGISTRO</label>
            <div class="control">
              <input class="input" type="text" placeholder="Nombre" v-model="name">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="text" placeholder="Apellidos" v-model="surname">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="date" placeholder="Fecha nacimiento" v-model="birth">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="email" placeholder="Email" v-model="email">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="password" placeholder="Contraseña" v-model="password">
            </div>
          </div>
          <button type="submit" class="button is-accent">Registrar</button>
        </form>
        <div class="notification is-danger mt-10" v-if="error">
            {{ error }}
        </div>
      </div>
    </div>
    <!--<div class="column is-half"></div>-->
  </div>
</template>

<script>
import '@/firebase/init.js';
import firebase from 'firebase';
import Info from '../../components/layout/Info.vue';

export default {
  components: {
    Info
  },
  data() {
    return {
      name: '',
      surname: '',
      birth: '',
      email: '',
      password: '',
      error: ''
    }
  },
  name: "Register",
  methods: {
    register() {
      this.error = '';
      if (this.name && this.surname && this.birth && this.email && this.password) {
        this.birth = this.birth.replaceAll('-','/');
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            if (user) {
              firebase.firestore().collection("athlete").doc(this.email).set({
                name: this.name,
                surname: this.surname,
                birth: this.birth,
                email: this.email
              })
              .then(() => {
                this.name = '';
                this.surname = '';
                this.birth = '';
                this.email = '';
                this.password = '';
                console.log(user);
                this.$router.push({name: 'Home'})
                console.log("Document successfully written!");
              })
              .catch();
            }
          }).catch(err => {
            this.error = err.message
          })
      } else {
        this.error = 'Todos los campos son requeridos';
      }
    }
  }
}
</script>