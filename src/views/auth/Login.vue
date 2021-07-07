<template>
  <div class="container is-fluid mt-50">
    <div class="columns">
      <Info />
      <div class="column is-half">
          <h3 class="title is-3">INICIAR SESIÓN</h3>
        <form action="#" @submit.prevent="login" class="box">
          <div class="field">
            <div class="control">
              <input class="input" type="email" placeholder="Email" v-model="email">
            </div>
          </div>
          <div class="field">
            <div class="control">
              <input class="input" type="password" placeholder="Contraseña" v-model="password">
            </div>
            <a @click.prevent="recoveryPass" class="has-text-grey-dark level-right">Recuperar la contraseña</a>
          </div>
          <button type="submit" class="button is-accent">Iniciar sesión</button>
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
import Info from '../../components/layout/Info.vue';

export default {
  components: {
    Info
  },
  data() {
      return {
          email: '',
          password: '',
          error: '',
          emailSending: false
      }
  },
  name: "Login",
  methods: {
    login() {
      this.error = '';
      if (this.email && this.password) {
          firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .then(user => {
            this.$router.push({name: 'Home'});
            console.log(user);
          }).catch(err => {
            this.error = err.message
          })
      } else {
          this.error = 'Todos los campos son requeridos';
      }
    },
    recoveryPass() {
      if (!this.email) {
        this.error = "Please type in a valid email address.";
        return;
      }
      this.error = null;
      this.emailSending = true;
      firebase.auth().sendPasswordResetEmail(this.email)
        .then(() => {
          this.emailSending = false;
          this.error = 'Se ha enviado el correo para restaurar la contraseña';
        })
        .catch(error => {
          this.emailSending = false;
          this.error = error.message;
        });
    }
  }
}
</script>