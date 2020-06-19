import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    count:0,
    GTFSmap:new Map(),
    filenames:[],
  },

  getters:{
    //不修改state里的内容  但是包装一下get
    showTxtFile(state,txtname){
      return state.count+1;
    }
  },

  mutations: {
    // //第一个形参一定是state  之后的就是传参了
    // add(state){
    //   state.count++
    // },
    // addN(state,n){
    //   state.count+=n;
    // },
    
    //save the txtfile into the GTFSmap
    storeTxtFile(state,data){
      state.GTFSmap.set(data[0],data[1]);     
      state.filenames.push(data[0]);      
    },

    //reset GTFS Data
    reset(state){
      state.GTFSmap=new Map();
      state.filenames=[];
    },
  },
  actions: {
    //在这里定义延时的调用mutations方法的方法  一步操作 大概用不上
    increment(context) {
      setTimeout(()=>{
        context.commit('add')
      },1000)      
    }
  },
  modules: {
  }
})
