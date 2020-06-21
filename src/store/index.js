import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    GTFSmap:new Map(),//(agency.txt,[[agency_id,agency_name,agency_url,agency_timezone],
                      //              [DTA,Demo Transit Authority,http://google.com,America/Los_Angeles]...])
    filenames:[],
    saved:false,
  },

  getters:{
  
    //input:filename   attributtype 
    //output:a Array of all the value of this Type 
    getallAttribut:(state)=>(filename,attributtype)=>{
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(',');
      var found=false;
      var i;// position of the attribute to find
      for(i in fileAttributeType){
        if(fileAttributeType[i]==attributtype){
          found=true;
          break;
        }
      }      
      var result=new Set();
      if(!found){return result;}
      for(var j =1;j<filearray.length;j++){
        var temp=filearray[j].split(',');
        result.add(temp[i]);
      }
      return Array.from(result);         
    },

    //input:filename,UIDvalue,UIDtype,attributtype
    //output: the value of this Type with UIDvalue
    getAttributeValue:(state)=>(filename,UIDtype,UIDvalue,attributtype)=>{
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(',');
      var found=false;
      var uid_position;// position of the UID
      var attribute_position;
      for(var i in fileAttributeType){        
        if(fileAttributeType[i]==attributtype){
          found=true;
          attribute_position=i;
        }
        if(fileAttributeType[i]==UIDtype){
          found=true;
          uid_position=i;
        }
      }      
      //var result=new Set();
      for(var j =1;j<filearray.length;j++){
        var temp=filearray[j].split(',');
        if(temp[uid_position]==UIDvalue){
          //result.add(temp[attribute_position]);
          return temp[attribute_position];
        }        
      }
      //return Array.from(result);     
    },

  },

  mutations: {   
    //save the txtfile into the GTFSmap
    storeFile(state,data){  
      var stringFile=data[1].split(/\r?\n/);            
      // for(var i in stringFile){
      //   console.log(stringFile[i]);
      // }
      state.GTFSmap.set(data[0],stringFile);     
      state.filenames.push(data[0]);      
    },

    setSaved(state,b){
      state.saved=b;
    },

    //reset GTFS Data
    reset(state){
      state.GTFSmap=new Map();
      state.filenames=[];
      state.saved=false;
    },

    //input:filename,UIDvalue,UIDtype,attributtype
    //change the attribute value,which has UIDvalue and in attributtype
    setAttributeValue(state,[filename,UIDtype,UIDvalue,attributtype,attributeValue]){
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(',');
      var found=false;
      var uid_position;// position of the UID
      var attribute_position;
      for(var i in fileAttributeType){        
        if(fileAttributeType[i]==attributtype){
          found=true;
          attribute_position=i;
        }
        if(fileAttributeType[i]==UIDtype){
          found=true;
          uid_position=i;
        }
      }      
      //var result=new Set();
      var j;
      for(j =1;j<filearray.length;j++){
        var temp=filearray[j].split(',');
        if(temp[uid_position]==UIDvalue){
          temp[attribute_position]=attributeValue;
          break;
        }        
      }
      var s="";
      for(var i in temp){
        s+=temp[i]+",";       
      }
      s=s.substring(0,s.length-1);
      filearray[j]=s;
      state.GTFSmap.set(filename,filearray);  
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
