<template>
    <v-app-bar class='elevation-1' fixed dark color="#212B39">
        <router-link class="navbar-item link" to="/">
            <v-img src="../../img/logo.png" max-height="30" max-width="30"></v-img>
        </router-link>
        <h2 style="font-family: sans-serif">&nbsp;HOJA DEL MES</h2>
        <v-spacer></v-spacer>
        <template v-if="user">
            <v-btn @click.prevent="logout" icon>
                <v-icon>mdi-export</v-icon>
            </v-btn>
        </template>
        <template v-else>
            <v-btn elevation="2" color="#039BE5" dark depressed>
                <router-link to="/register" class="white--text link">
                    Registrar
                </router-link>
            </v-btn>&nbsp;
            <v-btn elevation="2" depressed color="#fff">
                <router-link to="/login" class="link">
                    Iniciar sesión
                </router-link>
            </v-btn>
        </template>
    </v-app-bar>
</template>

<script>
import firebase from 'firebase'

export default {
    data() {
        return {
            isOpen: false,
            user: null
        };
    },
    methods: {
        toggleMenu() {
            const status = !this.isOpen;
            this.isOpen = status;
        },
        logout() {
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'Login'})
            })
        }
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
