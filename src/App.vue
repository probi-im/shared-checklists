<template>
  <router-view />
</template>

<style lang="scss">
*,
*::before,
*::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Avenir, Helvetica, Arial, sans-serif;
}

html,
body {
  height: 100vh;
}

body {
  background: linear-gradient(-45deg, hsl(261, 100%, 50%), hsl(261, 76%, 55%));
  display: grid;
  place-content: center;
}

#app {
  background-color: white;
  padding: 50px;
  border-radius: 30px;
  box-shadow: 0 10px 30px #333;
  min-width: 700px;
}
</style>
