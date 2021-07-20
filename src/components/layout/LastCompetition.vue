<template>
    <!-- Competición más reciente -->
    <v-card class='elevation-1'>
        <v-toolbar class='elevation-0'>
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
                    <v-list-item-action-text>{{ competition.date }}</v-list-item-action-text>
                </v-list-item-action>
            </v-list-item>
        </v-list>
    </v-card>
</template>

<script>
import firebase from 'firebase'
import moment from 'moment'

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
        this.getLastCompetition();
    },
    methods: {
        getLastCompetition() {
            this.lastCompetition = []
            firebase.firestore().collection('competitions').where("email", "==", this.email).orderBy("date", "desc").limit(1)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        // doc.data() is never undefined for query doc snapshots
                        console.log("Last competition: ", doc.data());
                        this.lastCompetition.push({
                            email: doc.data().email,
                            id: doc.data().id,
                            name: doc.data().name,
                            place: doc.data().place,
                            result: doc.data().result,
                            track: doc.data().track,
                            date: moment.unix(doc.data().date.seconds).format("DD/MM/YYYY"),
                        });
                    });
                })
                .catch((error) => {
                    console.log("Error getting last competition: ", error);
                });
        }
    }
}
</script>