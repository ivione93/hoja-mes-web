<template>
    <!-- Entrenamientos -->
    <div class="card">
        <div class="card-content">
            <ul>
                <li v-for="training in trainings" v-bind:key="training.id">
                    <p class="panel-heading">{{ training.distance }}</p>
                    <p class="panel-block">{{ training.time }}</p>
                    <p class="panel-block">{{ training.partial }}</p>
                    <p>{{ training.date }}</p>
                    <hr>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    props: ['email'],
    data() {
        return {
            trainings: []
        };
    },
    mounted() {
        this.trainings = []
        firebase.firestore().collection('trainings').where("email", "==", this.email).orderBy("date", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("Training: ", doc.data());
                    this.trainings.push(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
}
</script>