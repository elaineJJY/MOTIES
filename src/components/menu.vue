<template>
    
  <div>

    <el-container>

        <el-aside width="120px" >
                <el-menu
                    class="el-menu-vertical-demo"
                    :default-active="this.$route.path"
                    :router="true"
                >
                    <el-menu-item index="/home">
                        <i class="el-icon-upload"></i>
                        <span slot="title">Home</span>
                    </el-menu-item>

                    <el-menu-item index="/trip">
                        <i class="el-icon-truck"></i>
                        <span slot="title">Trip</span>
                    </el-menu-item>
                    
                    <el-menu-item index="/">
                        <i class="el-icon-map-location"></i>
                        <span slot="title">Station</span>
                    </el-menu-item>

                    <el-menu-item index="/Station" >
                        <i class="el-icon-setting"></i>
                        <span slot="title">Station</span>
                    </el-menu-item>

                </el-menu>
        </el-aside>
        
      
          <el-main>
              <router-view></router-view>
          </el-main>
      
    </el-container>
    
  </div>
    
  

</template>

<script>
import documentMenu from '@/components/document-menu'
export default {
components:{
    documentMenu,
  },
data() {
    return {};
  },

methods: {
}

}
</script>

<style>
.el-col-12{
  width: 12%;
}

</style>