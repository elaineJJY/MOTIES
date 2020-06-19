<template>
  <div>
    <!-- <el-container>
      <el-header> -->
        <el-row :gutter="25">
          <!--title-->
          <el-col :span="11" class="title">GTFS Editor</el-col>
          
          
          <el-col :span="10">
            <!--Uploade-->
            <el-col :span="7">
              <el-upload
                class="upload-demo"
                action="1"
                accept=".zip"
                :before-upload="successUpload"
                :file-list="fileList">
                <el-button  type="primary">Click to upload zip file<i class="el-icon-upload el-icon--right"></i></el-button>
              </el-upload>
            </el-col>
          
            <!-- File List -->
            <el-col :span="2">
              <el-button @click="drawer = true" type="info" plain style="margin-left: 16px;">
                Show File List
              </el-button>
              <el-drawer
                title="File List"
                :visible.sync="drawer"
                :with-header="false"
                size="20%">
                <p class="title">File List</p>
                <ul >
                  <li class="list" v-for="(item, index ) in filenames" :key="item">
                    [{{index+1}}]----{{ item }}  
                  </li>
                </ul>  
              </el-drawer>
            </el-col>
          </el-col>
          
          <!--Export or Create a  new GTFS-->
          <el-col :span="3">
              <div class="grid-content bg-purple">
                  <el-button type="success">Export</el-button>
                  <el-button type="danger">New</el-button>
              </div>
          </el-col>

        </el-row>
      <!-- </el-header>    
    </el-container> -->
    
    <p>测试</p>
    <el-button type="danger" @click="test">test</el-button>
    <el-button type="danger">MapSize {{this.GTFSmap.size}}</el-button>
    
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import JsZip from 'jszip'; 
export default {
  computed: {
    ...mapState(['count','GTFSmap','filenames']) //improt share variable from store
  },
  
  data(){
      return{
          drawer: false,
      }  
  },

  methods:{
    //improt functions from store
    ...mapMutations(['storeTxtFile','reset']), 
    ...mapActions(['increment']),
    ...mapGetters(['showTxtfile']),

    test(){
      for(var i=0;i<=10;i++){
        this.$store.commit('storeTxtFile',[i,123]);
      }
      
    },

    //执行解压缩 检查内容是否正确 正确保存下来 不正确或者有缺胳膊少腿就警告
    //jszip
    successUpload(zipfile){
      this.reset();
      let new_zip = new JsZip();
      new_zip.loadAsync(zipfile).then((zip) => { // read zip
        for (let key in zip.files){
            if (/\.(txt)$/.test(zip.files[key].name)) { // 判断是否是文本文件
              let txtName=key;
              zip.file(zip.files[key].name).async('string').then(function(txtfile) {
                alert(tansfer(txtfile));
              });
              
              
              this.$store.commit('storeTxtFile',[txtName,1]);
              
            }
            else{
              alert("You have a wrong GTFS Form")
            }
        }
      });
      alert("all saved");
      return false;
    },

//transfer txt to string
    transfer(txtfile){    
      var fso = new ActiveXObject("Scripting.FileSystemObject");
      var f = fso.OpenTextFile(txtfile,1);
      var s = "";
      while (!f.AtEndOfStream)
      s += f.ReadLine()+"\n";
      f.Close();
      return s;
    },

  

  },
    
    
  }
</script>

<style scoped>
.title{
  font-family: Arial, sans-serif;
  font-size: 35px;
  color: #369;
}

.list{
    display:block;
    color:rgba(13, 98, 138, 0.931);
    font-family: 'Open Sans';
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
}

</style>