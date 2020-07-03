
<template>
  <div>
    
    <!-- <el-tabs v-model="activeName">
      <el-tab-pane label="Station" name="station">Station</el-tab-pane>
      <el-tab-pane label="Trip" name="trip">
      <trip-table></trip-table>
      </el-tab-pane>      
      <el-tab-pane label="Picker Popups" name="pp">Picker Popups</el-tab-pane>
    </el-tabs> -->


  </div>
</template>

<script>
// @ is an alias to /src
//这里可以写这个页面里搭载什么组件
import documentMenu from '@/components/document-menu'
import tripTable from '@/components/trip-table'
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
export default {
  name: 'Home',
  components: {
    documentMenu,
    tripTable,
  },
  data(){
    return{
      activeName: 'trip',
    }    
  },
   computed:{
      ...mapState(['GTFSmap','filenames','saved']), //improt share variable from store
        },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
  watch:{
    
  }
}
</script>

<style scoped>

</style>
