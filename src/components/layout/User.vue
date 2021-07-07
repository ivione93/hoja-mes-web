<template>
    <!-- Competiciones -->
    <div class="card">
        <div class="card-content">
        <div class="media">
            <div class="media-left">
            <figure class="image is-48x48">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image">
            </figure>
            </div>
            <div class="media-content">
            <p class="title is-4">{{ userInfo.name }} {{ userInfo.surname }}</p>
            <p class="subtitle is-6">{{ userInfo.birth }}</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    props: ['email'],
    data() {
        return {
            userInfo: []
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