import Vue from 'vue'
import App from './App.vue'
const axios = require('axios');

//for bootstrap
import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false


new Vue({
  //render: h => h(App), //this doesnt pass props to child
  render: function(rend) { 
    return rend(App, {
      props: {
        CryptoPrices: this.CryptoPrices, //"this" is essential
        flash: this.flash,
      }
    });
  },
  props:{ //needs to be props not data because data wont pass to app.vue
    CryptoPrices:[], //console.log will show Observer, needs to be empty because it is init before callAPI()
    flash: false,
  },
  computed: { //for state tracking for flash
    // watch the entire model as a new object
    computedPrices: function() {
        return Object.assign({}, this.CryptoPrices); //need this because cannot newVal !== oldVal, ref same obj in vue/javascript
    }
  },
  watch:{ //for state tracking for flash
    computedPrices:{
      deep: true, //essential for nested objected
      handler: function(newVal, oldVal){ 
        //console.log(newVal);
        //console.log(oldVal);
        for(var obj in newVal){
          if(newVal[obj].USD !== oldVal[obj].USD){
            //console.log("changed");
            this.flash = true;
            return; //if any prices changed stop immediately
          }else{
            //console.log("same");
            this.flash = false;
          }
        }
      }
    }
 },
  methods:{
    callAPI: function(){
      var vm = this; //essential to scope correctly, "this" refers to the vue instance here
      const url = "https://min-api.cryptocompare.com/data/pricemulti?fsyms=BTC,ETH,LTC&tsyms=USD";
      axios.get(url)
      .then(function(response){
        //console.log(response.data);
        var formattedData = [];

        //extract key/value from observer obj
        for(var symbol in response.data) { //symbol is the key, symbol.USD is not right
          var price = response.data[symbol]; //price is the value, price.USD is right
          var formattedObj = {sym:symbol, USD:price.USD}
          //console.log(formattedObj);
          formattedData.push(formattedObj); //this is only way it works
          /*below either doesnt work
          vm.CryptoPrices.push(formattedObj);
          Vue.set(vm.CryptoPrices, symbol, price.USD);
          */
        }
        //console.log(formattedData);
        
        vm.CryptoPrices = formattedData; //"this" instead of vm here will refer to axios instance
        //console.log(vm.CryptoPrices);
      })
      .catch(function(error){
        console.log(error);
      })
    }
  },
  mounted(){ //wait till component renders
    this.callAPI();

    //auto update every 10secs
    this.startLoop = setInterval(
      () => this.callAPI(),
      10000
    );
  },
  destroyed(){
    clearInterval(this.startLoop);
  }
}).$mount('#app')