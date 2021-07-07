<template>
  <div id="app">
    <div id="nav">
      <Navigation />
    </div>
    <router-view/>
    <Footer />
  </div>
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

<style lang="scss">
  @import './scss/App.scss';
</style>

