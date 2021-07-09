<template>
    <!-- Entrenamiento más reciente -->
    <v-card class='elevation-1'>
        <v-toolbar class='elevation-0'>
            <v-toolbar-title><v-icon>mdi-run</v-icon> Último entrenamiento</v-toolbar-title>
        </v-toolbar>
        <v-list>
            <v-list-item v-for="training in lastTraining" v-bind:key="training.id">
                <v-list-item-content>
                    <v-list-item-title>Tiempo: {{ training.time }}</v-list-item-title>
                    <v-list-item-subtitle>Distancia: {{ training.distance }} kms</v-list-item-subtitle>
                    <v-list-item-subtitle>Media: {{ training.partial }} /km</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                    <v-list-item-action-text v-text="'06/06/2021'"></v-list-item-action-text>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import firebase from 'firebase'

export default {
    props: ['email'],
    name: 'LastTraining',
    data() {
        return {
            lastTraining: [],
            dialog: false
        };
    },
    mounted() {
        this.training = []
        firebase.firestore().collection('trainings').where("email", "==", this.email).orderBy("date", "desc").limit(1)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("Last training: ", doc.data());
                    this.lastTraining.push(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting last training: ", error);
            });
    }
}
</script>