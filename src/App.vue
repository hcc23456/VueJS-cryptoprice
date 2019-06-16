<template>
<!--this is parent file component, hosting HelloWorld child component-->
<!--unless there is another custom parent component/template, everything needs to be inside #app-->
  <div id="app">
    <!--<img alt="Vue logo" src="./assets/logo.png">-->
    <!--<HelloWorld msg="Welcome to Your Vue.js App"/>-->

    <h2>Crypto Prices</h2>
    <!--need :key below-->
    <b-card-group deck id="card-deck"><!--start cards-->
      <b-card :title="crypto.sym" v-for="crypto in CryptoPrices" :key="crypto.sym">
        <!--only 1 of the 2 below lines will show, flash cannot be both true and false-->
        <!--if flash is true, apply update css, , this text will only show if flash is true-->
        <b-card-text id="update" v-if="flash">{{crypto.USD}}</b-card-text>
        <!--if flash is false, apply noupdate css, , this text will only show if flash is false-->
        <b-card-text id="noupdate" v-if="!flash">{{crypto.USD}}</b-card-text>
      </b-card>
    </b-card-group><!--end cards-->
  </div>
</template>

<script>
//import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'app',
  components: {
    //HelloWorld,
  },
  props: ['CryptoPrices', 'flash'] //passed from main.js
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
#card-deck{
  margin: 2em;
}

/*animation for flash*/
@keyframes update {
  from { background-color: white; }
  to { background-color: red; }
}

#noupdate{ /*default style*/
  background-color: white;
  transition-property: background-color;
  transition-duration: 2s;
}

#update{ /*style to be added on change*/
  animation-name: update;
  animation-duration: 2s;
}
</style>