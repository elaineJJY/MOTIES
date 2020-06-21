<template>
  <div>

        <el-row :gutter="30">
          
          <!--title-->
          <el-col :span="6" class="title">GTFS Editor</el-col>

          <!--Uploade-->
          <el-col :span="4" :offset="6">
            <el-upload
              class="upload-demo"
              action="1"
              accept=".zip"
              :limit="1"
              :before-upload="importUpload">
              <el-button  type="primary">Click to upload zip file<i class="el-icon-upload el-icon--right"></i></el-button>
            </el-upload>
          </el-col> 
         
          <!-- Create a  new GTFS -->
          <el-col :span="2" >                  
            <el-button type="danger">New</el-button>
          </el-col>

          <!-- File List Drawer-->
          <el-col :span="3" >
            <el-button v-show="saved" @click="drawer = true" type="info" plain style="margin-left: 16px;">
              Show File List
            </el-button>
            <el-drawer
              title="File List"
              :visible.sync="drawer"
              :with-header="false"
              size="25%">
              <p class="title">File List</p>
              <ul >
                <li class="list" v-for="(item, index ) in filenames" :key="item">
                  [{{index+1}}]----{{ item }}  
                </li>
              </ul>  
            </el-drawer>
          </el-col>
          
          <!--Export-->
          <el-col :span="2" >
            <el-button type="success" @click="exportDownload">Export</el-button>
          </el-col>

        </el-row>
      
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import JsZip from 'jszip'; 


export default {
  computed: {
    ...mapState(['GTFSmap','filenames','saved']) //improt share variable from store
  },
  
  data(){
      return{
          drawer: false,
          //saved:false,
      }  
  },

  methods:{
    //improt functions from store
    ...mapMutations(['storeFile','reset','setSaved']), 
    ...mapGetters(['getFile']),

   //open the zip and save all the txt ducument in to the store
    importUpload(zipfile){
      this.reset();
      let new_zip = new JsZip();
      new_zip.loadAsync(zipfile).then((zip) => { // read zip
        for (let key in zip.files){
            if (/\.(txt)$/.test(zip.files[key].name)) { //check whether it is a txt file
              let txtName=key;
              let txtfile="";
              let base=zip.file(zip.files[key].name).async('string');
              base.then(
                res=>{txtfile+=res;
                //console.log(txtfile);   
                this.$store.commit('storeFile',[txtName,txtfile]);
              });  
              //console.log(this.GTFSmap.get(key));      
              // this.$store.commit('storeFile',[txtName,txtfile]);   
            }
            else{
              //if it is not a txt file
              alert("You have a wrong GTFS Form")
            }
        }
      });
      this.setSaved(true);
      return false;
    },

////create a zip file and download
    exportDownload(){
    //create a zip file
      let zip = new JsZip();
      var content;
      for(var key of this.GTFSmap.keys()){
        var txtfile=this.GTFSmap.get(key);       
        var stringFile=""
        //console.log(txtfile);
        for(var index in txtfile){
          stringFile+=txtfile[index]+"\n";
          // console.log(index);
          // console.log(txtfile[index]);
        }
        zip.file(key, stringFile);
      }
      
      //download
      let filename="GTFS.zip";
      zip.generateAsync({type:"blob"}).then(function(content) { 
        if (window.navigator.msSaveOrOpenBlob) {
          //IE10
          navigator.msSaveBlob(content, filename)
        } else {
          // chrome/firefox
          let aTag = document.createElement('a')
          aTag.download = filename;
          aTag.href = URL.createObjectURL(content);
          aTag.click();
          URL.revokeObjectURL(aTag.href);
        }
      });
    }
 
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