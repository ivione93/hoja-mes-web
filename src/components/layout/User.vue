<template>
    <!-- Usuario -->
    <v-card>
        <v-toolbar>
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
                                <v-card-title>
                                    <span class="text-h5">Editar perfil</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row cols="12" sm="6">
                                            <v-text-field v-model="userInfo.name" value="userInfo.name" label="Nombre" type="text" outlined clearable></v-text-field>
                                        </v-row>
                                        <v-row cols="12" sm="6">
                                            <v-text-field v-model="userInfo.surname" label="Apellidos" type="text" outlined clearable></v-text-field>
                                        </v-row>
                                        <v-row cols="12" sm="6">
                                            <v-text-field v-model="userInfo.birth" label="Fecha de nacimiento" type="date" outlined clearable></v-text-field>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer></v-spacer>
                                    <v-btn color="blue darken-1" text @click="dialog = false;">
                                        Cancelar
                                    </v-btn>
                                    <v-btn color="blue darken-1" text @click="dialog = false">
                                        Guardar
                                    </v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-dialog>
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-toolbar>
        <v-card-text>{{ userInfo.name }} {{ userInfo.surname }}</v-card-text>
        <v-card-text>{{ userInfo.birth }}</v-card-text>
    </v-card>
</template>

<script>
import firebase from 'firebase'
export default {
    props: ['email'],
    data() {
        return {
            userInfo: [],
            dialog: false,
        };
    },
    mounted() {
        this.userInfo = []
        firebase.firestore().collection('athlete').doc(this.email)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    this.userInfo = doc.data();
                    console.log("Document data:", doc.data());
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            })
            .catch((error) => {
                console.log("Error getting document:", error);
            });
    }
}
</script>