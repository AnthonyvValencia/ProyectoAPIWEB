<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style scoped>
html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

footer {
  background-color: #703ca0;
  color: white;
  padding: 0.5rem;
  text-align: center;
  margin-top: auto;
}
</style>
