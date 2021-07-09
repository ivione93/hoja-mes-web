<template>
  <v-app>
    <Navigation />
    <v-main>
      <v-container fluid>
        <router-view/>
      </v-container>
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navigation from './components/layout/Navigation.vue'
import Footer from './components/layout/Footer.vue'

export default {
  components: {
    Navigation, 
    Footer
  }
}
</script>

<style lang="css">
  @import './css/App.css';
</style>