<template>
    <!-- Competición más reciente -->
    <v-card>
        <v-toolbar>
            <v-toolbar-title><v-icon>mdi-trophy</v-icon> Última competición</v-toolbar-title>
        </v-toolbar>
        <v-list>
            <v-list-item v-for="competition in lastCompetition" v-bind:key="competition.id">
                <v-list-item-content>
                    <v-list-item-title>{{ competition.name }}</v-list-item-title>
                    <v-list-item-subtitle>Lugar: {{ competition.place }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Prueba: {{ competition.track }}</v-list-item-subtitle>
                    <v-list-item-subtitle>Resultado: {{ competition.result }}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-list-item-action-text v-text="'06/06/2021'"></v-list-item-action-text>
                    <v-menu left>
                        <template v-slot:activator="{ on, attrs }">
                        <v-btn icon v-bind="attrs" v-on="on">
                            <v-icon>mdi-dots-vertical</v-icon>
                        </v-btn>
                        </template>
                        <v-list>
                            <v-list-item link>
                                <v-list-item-title><v-icon>mdi-pencil</v-icon> Ver competición</v-list-item-title>
                            </v-list-item>
                            <v-list-item link>
                                <v-list-item-title><v-icon>mdi-delete</v-icon> Eliminar</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import firebase from 'firebase'

export default {
    props: ['email'],
    name: 'LastCompetition',
    data() {
        return {
            lastCompetition: [],
            dialog: false
        };
    },
    mounted() {
        this.lastCompetition = []
        firebase.firestore().collection('competitions').where("email", "==", this.email).orderBy("date", "desc").limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("Last competition: ", doc.data());
                    this.lastCompetition.push(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting last competition: ", error);
            });
    }
}
</script>