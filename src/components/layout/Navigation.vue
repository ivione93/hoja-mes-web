<template>
    <v-app-bar class='elevation-1' fixed>
        <router-link class="navbar-item link" to="/">
            <h3 class="title is-3">HOJA DEL MES</h3>
        </router-link>
        <v-spacer></v-spacer>
        <template v-if="user">
            <v-btn @click.prevent="logout" icon>
                <v-icon>mdi-export</v-icon>
            </v-btn>
        </template>
        <template v-else>
            <v-btn elevation="2" color="primary">
                <router-link to="/register" class="white--text link">
                    Registrar
                </router-link>
            </v-btn>&nbsp;
            <v-btn elevation="2">
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
