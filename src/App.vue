<template>
  <div id="app">
    <div id="nav">
      <dynamic-form  v-model="formData" :model="formModel"/>
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      formData: {},
      formModel: {
        fields: [
          {
            type: 'string',
            name: 'ceshi',
            code: 'cc'
          }
        ]

      }
    }
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
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
