<template>
  <router-view/>
</template>

<style lang="scss">
body {
  margin: 0;
  width: 100vw;
  height: 100vh;
  min-width: 640px;
  min-height: 480px;
  overflow: hidden;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#root {
  width: 100vw;
  height: 100vh;
  min-width: 640px;
  min-height: 480px;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
