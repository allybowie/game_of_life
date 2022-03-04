<template>
  <div id="app">
    <h1>The Game of Life</h1>
    <grid />
  </div>
</template>

<script>
import Grid from './components/Grid/Grid.vue'

export default {
  name: 'App',
  components: {
    Grid
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
  width: 100%;
}
</style>
