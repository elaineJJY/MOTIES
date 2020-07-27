
<template>
  <div>
    <el-container>
      <el-header>
        
          <!-- title -->
          <div  class="title">GTFS Editor</div>
          
          <div align="right">
            <el-button type="success" @click="exportDownload">Export</el-button>
            <el-button type="danger">New</el-button>
            <el-button v-show="saved" @click="drawer = true" type="info" plain style="margin-left: 16px;">
              Show File List
            </el-button>
          </div>
          <el-drawer
              title="File List"
              :visible.sync="drawer"
              :with-header="false"
              size="30%">
              <el-table
                  :data="files"
                  stripe
                  style="width: 100%">
                  <el-table-column
                    prop="index"
                    label="index"
                    width="100">
                  </el-table-column>
                  <el-table-column
                    prop="name"
                    label="File name"
                    width="180">
                  </el-table-column>
                  <el-table-column
                    prop="type"
                    label="Type"
                    width="auto">
                  </el-table-column>
                </el-table>
            </el-drawer>        
        
      </el-header>
      
     
      
      <el-main>  
        <br>
        <br> 
        <el-row >
          <el-col :offset="1" :span="7">
            <el-upload
              class="upload-demo"
              action="1"
              accept=".zip"
              drag
              :limit="1"
              :before-upload="importUpload"
              v-loading.fullscreen.lock="fullscreenLoading"
              >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">Drop file here or <em>click to upload</em></div>
              <div class="el-upload__tip" slot="tip">only zip file</div>
            </el-upload>
          </el-col>

          <el-col :span="14">
            <Agency ref="agency"></Agency>
          </el-col>
        </el-row>
        
      </el-main>
      
    </el-container>
      
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import JsZip from 'jszip'; 
import Agency from '@/components/agency'

export default {
  components:{
    Agency,
  },
  computed: {
    ...mapState(['GTFSmap','filenames','saved','zipsize']), //improt share variable from store

  },
  
  data(){
      return{
          drawer: false,
          //saved:false,
          fullscreenLoading:false,
         files:[],
         required:['agency.txt','stops.txt','routes.txt','trips.txt','stop_times.txt','calendar.txt'],
         conditionall_required:["calendar.txt","calendar_dates.txt","feed_info.txt"],
      }  
  },

  methods:{
    //improt functions from store
    ...mapMutations(['storeFile','reset','setSaved','setZipsize','addZipsize']), 

   //open the zip and save all the txt ducument in to the store
    importUpload(zipfile){
      this.fullscreenLoading = true;
      this.reset();
      var size=0;
      let new_zip = new JsZip();
      new_zip.loadAsync(zipfile).then((zip) => { // read zip
        for (let key in zip.files){
            if (/\.(txt)$/.test(zip.files[key].name)) { //check whether it is a txt file
              let txtName=key;
              let txtfile="";
              let base=zip.file(zip.files[key].name).async('string');
              base.then(
                res=>{txtfile+=res;  
                this.$store.commit('storeFile',[txtName,txtfile]);
              });  
  
              // this.$store.commit('storeFile',[txtName,txtfile]);   
              this.addZipsize();
              
            }
            else{
              //if it is not a txt file
              alert("You have a wrong GTFS Form")
            }           
        }
      });
      
      //this.setZipsize(size); 
      //this.setSaved(true);
      //this.$store.dispatch('setZipsizeAsync',size);
      //console.log("zipsize:"+this.zipsize);
      //this.$store.dispatch('setSavedAsync',true);
      
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
  watch:{
    saved(val){     
      if(val){  
        setTimeout(() => {
          this.fullscreenLoading = false;
          var trip_id_list=this.$store.getters.getallAttribut("trips.txt","trip_id");
          this.$store.commit('setTrip_id_list',trip_id_list);                    
          
          var route_id_list=this.$store.getters.getallAttribut("routes.txt","route_id");
          this.$store.commit('setRoute_id_list',route_id_list);  
          
          var service_list=this.$store.getters.getallAttribut("calendar.txt","service_id");
          this.$store.commit('setService_list',service_list);   
      
          var stop_id_list=this.$store.getters.getallAttribut("stops.txt","stop_id");
          this.$store.commit('setStop_id_list',stop_id_list); 
          this.$refs.agency.refresh();
        }, 1000);
      }  
      
    },
    drawer(val){
      if(val){
        this.files=[];
        var req=[];
        var con_req=[];
        var optimal=[];
        for(var name of this.filenames){
          if(this.required.indexOf(name)!=-1){
            req.push(name);
          }
          else if(this.conditionall_required.indexOf(name)!=-1){
            con_req.push(name);
          }
          else{
            optimal.push(name);
          }
        }
        
        var index;
        for(index=0;index<req.length;index++){
          this.files.push({
            index:index+1,
            name:req[index],
            type:"Required",
          })
        }
        index=0;
        while(index<con_req.length){
          this.files.push({
            index:index+req.length+1,
            name:con_req[index],
            type:"Conditionally required",
          })
          index++;
        }
        index=0;
        while(index<optimal.length){
          this.files.push({
            index:index+req.length+con_req.length+1,
            name:optimal[index],
            type:"Optional",
          });
          index++;
        }

      }
    }
  }
    
    
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