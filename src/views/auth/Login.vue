<template>
    <v-row class="mt-100" justify="center">
      <Info />
      <v-col cols="12" md="4">
        <v-form action="#" @submit.prevent="login" class="box">
          <h3>INICIAR SESIÓN</h3><br><hr><br>
          <v-container>
            <v-row cols="12" sm="6">
              <v-text-field v-model="email" label="Email" type="email" outlined></v-text-field>
            </v-row>
            <v-row cols="12" sm="6">
              <v-text-field v-model="password" label="Contraseña" type="password" outlined></v-text-field>
            </v-row>
            <v-row cols="12" sm="6" align="center">
              <v-btn type="submit" color="primary">Iniciar sesión</v-btn>&nbsp;
              <v-spacer></v-spacer>
              <v-btn @click.prevent="recoveryPass" text>Recuperar la contraseña</v-btn>
            </v-row>
          </v-container>
        </v-form>
        <v-alert type="error" v-if="error">{{ error }}</v-alert>
      </v-col>
    </v-row>
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