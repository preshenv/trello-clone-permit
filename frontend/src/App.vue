<template>
  <div id="app">
    <ErrorModal />
    <router-view></router-view>
  </div>
</template>

<script>
import ErrorModal from './components/ErrorModal.vue'

export default {
  name: 'App',
  components: {
    ErrorModal
  }
}
</script>

<style>
#app {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
  margin: 0;
  padding: 0;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
}
</style>