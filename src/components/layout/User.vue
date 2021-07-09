<template>
    <!-- Usuario -->
    <v-card class='elevation-1'>
        <v-toolbar class='elevation-0'>
            <v-toolbar-title><v-icon>mdi-account</v-icon> Perfil</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-menu>
                <template v-slot:activator="{ on, attrs }">
                <v-btn icon v-bind="attrs" v-on="on">
                    <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
                </template>
                <v-list>
                    <v-list-item link>
                        <v-dialog v-model="dialog" persistent max-width="600px">
                            <template v-slot:activator="{ on, attrs }">
                                <v-btn text plain v-bind="attrs" v-on="on">
                                    <v-icon>mdi-pencil</v-icon> Editar perfil
                                </v-btn>
                            </template>
                            <v-card>
                                <v-form action="#" @submit.prevent="editProfile" class="box">
                                    <v-card-title>
                                        <span class="text-h5">Editar perfil</span>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-container>
                                            <v-row cols="12" sm="6">
                                                <v-text-field v-model="name" label="Nombre" type="text" outlined required></v-text-field>
                                            </v-row>
                                            <v-row cols="12" sm="6">
                                                <v-text-field v-model="surname" label="Apellidos" type="text" outlined required></v-text-field>
                                            </v-row>
                                            <v-row cols="12" sm="6">
                                                <v-text-field v-model="birth" label="Fecha de nacimiento" type="date" outlined required></v-text-field>
                                            </v-row>
                                        </v-container>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="blue darken-1" text @click="dialog = false;">
                                            Cancelar
                                        </v-btn>
                                        <v-btn type="submit" color="blue darken-1" text>
                                            Guardar
                                        </v-btn>
                                    </v-card-actions>
                                </v-form>
                                <v-alert type="error" v-if="error">{{ error }}</v-alert>
                            </v-card>
                        </v-dialog>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-card-title>Nombre: {{ userInfo.name }} {{ userInfo.surname }}</v-card-title>
        <v-card-subtitle>Fecha de nacimiento:{{ userInfo.birth }}</v-card-subtitle>
        <v-card-text>Correo de registro: {{ userInfo.email }}</v-card-text>
    </v-card>
</template>

<script>
import firebase from 'firebase'
export default {
    props: ['email'],
    data() {
        return {
            userInfo: [],
            error: '',
            name: '',
            surname: '',
            birth: '',
            dialog: false,
        };
    },
    mounted() {
        this.getProfile();
    },
    methods: {
        getProfile() {
            this.userInfo = []
            firebase.firestore().collection('athlete').doc(this.email)
                .get()
                .then((doc) => {
                    if (doc.exists) {
                        this.userInfo = doc.data();
                        this.name = doc.data().name;
                        this.surname = doc.data().surname;
                        this.birth = doc.data().birth;
                        console.log("User data:", doc.data());
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                })
                .catch((error) => {
                    console.log("Error getting document:", error);
                });
        },
        editProfile() {
            this.error = '';
            if (this.name && this.surname && this.birth) {
                firebase.firestore().collection('athlete').doc(this.userInfo.email).update({
                    name: this.name,
                    surname: this.surname,
                    birth: this.birth.replaceAll('-', '/')
                })
                .then(() => {
                    this.dialog = false;
                    this.getProfile();
                })
            } else {
                this.error = 'Todos los campos son requeridos';
            }
        }
    }
}
</script>