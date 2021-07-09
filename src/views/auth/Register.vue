<template>
    <v-row class="mt-100" justify="center">
      <Info />
      <v-col cols="12" sm="4">
        <v-form action="#" @submit.prevent="register" class="box">
          <h3>INTRODUCE TUS DATOS DE REGISTRO</h3><br><hr><br>
          <v-container>
            <v-row cols="12" sm="6">
              <v-text-field v-model="name" label="Nombre" type="text" outlined clearable></v-text-field>
            </v-row>
            <v-row cols="12" sm="6">
              <v-text-field v-model="surname" label="Apellidos" type="text" outlined clearable></v-text-field>
            </v-row>
            <v-row cols="12" sm="6">
              <v-text-field v-model="password" label="Fecha de nacimiento" type="date" outlined clearable></v-text-field>
            </v-row>
            <v-row cols="12" sm="6">
              <v-text-field v-model="email" label="Email" type="email" outlined clearable></v-text-field>
            </v-row>
            <v-row cols="12" sm="6">
              <v-text-field v-model="password" label="Contraseña" type="password" outlined clearable></v-text-field>
            </v-row>
            <v-row cols="12" sm="6" align="center">
              <v-btn type="submit" color="primary">Registrar</v-btn>
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
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
          .then(user => {
            if (user) {
              firebase.firestore().collection("athlete").doc(this.email).set({
                name: this.name,
                surname: this.surname,
                birth: this.birth.replaceAll('-','/'),
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