<template>
  <div class="container mt-50">
    <div class="columns">
      <div class="column is-6 is-offset-3">
          <h3 class="title is-3">ALTA ATLETA</h3>
        <form action="#" @submit.prevent="register">
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
              <input class="input" type="email" placeholder="Email" v-model="email">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="password" placeholder="Contraseña" v-model="password">
            </div>
          </div>
          <button type="submit" class="button is-primary">Registrar</button>
        </form>

        <div class="notification is-danger mt-10" v-if="error">
            {{ error }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import '@/firebase/init.js';
import firebase from 'firebase';

export default {
    data() {
        return {
            name: '',
            surname: '',
            email: '',
            password: '',
            error: ''
        }
    },
    name: "Register",
    methods: {
        register() {
          this.error = '';
            if (this.name && this.surname && this.email && this.password) {
                firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then(user => {
                  this.name = '';
                  this.surname = '';
                  this.email = '';
                  this.password = '';
                  console.log(user);
                  this.$router.push({name: 'Home'})
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