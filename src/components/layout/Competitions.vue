<template>
    <!-- Competiciones -->
    <div class="scrollable">
    <ul>
        <li v-for="competition in competitions" v-bind:key="competition.id">
            <article class="panel is-info">
                <p class="panel-heading">{{ competition.name }}</p>
                <p class="panel-block">{{ competition.name }}</p>
                <p class="panel-block">{{ competition.place }}</p>
                <p>{{ competition.date }}</p>
                <p class="panel-block">{{ competition.track }}</p>
                <p class="panel-block">{{ competition.result }}</p>
            </article>
            <hr>
        </li>
    </ul>
    </div>
</template>

<script>
import firebase from 'firebase'

export default {
    props: ['email'],
    data() {
        return {
            competitions: []
        };
    },
    mounted() {
        this.competitions = []
        firebase.firestore().collection('competitions').where("email", "==", this.email).orderBy("date", "desc")
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    // doc.data() is never undefined for query doc snapshots
                    console.log("Competition: ", doc.data());
                    this.competitions.push(doc.data());
                });
            })
            .catch((error) => {
                console.log("Error getting documents: ", error);
            });
    }
}
</script>