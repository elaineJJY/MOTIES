import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    GTFSmap:new Map(),//(agency.txt,[[agency_id,agency_name,agency_url,agency_timezone],
                      //              [DTA,Demo Transit Authority,http://google.com,America/Los_Angeles]...])
    filenames:[],
    zipsize:0,
    saved:false,
    
  },

  getters:{

      /**
     * @param {*} filename 
     * @param {*} attributtype
     * @returns a Array of all the value of this Type 
     */
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
    


    /**
     * @param {*} filename 
     * @param {*} UIDtype 
     * @param {*} UIDvalue
     * @param {*} attributtype
     * @returns the value of this Type with UIDvalue, if the file does not have this AttributeType, than return""
     */
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
          uid_position=i;
        }
      }      
      //var result=new Set();
      if(found){
        for(var j =1;j<filearray.length;j++){
          var temp=filearray[j].split(',');
          if(temp[uid_position]==UIDvalue){
            //result.add(temp[attribute_position]);
            return temp[attribute_position];
          }        
        }
      }
      return "";     
    },

    /**
     * @param {*} serviceID 
     * @param {*} exception_type
     * @returns the array of this Type with serviceID
     */
    getDateArray:(state)=>(serviceID,exception_type)=>{
      var filearray=state.GTFSmap.get("calendar_dates.txt");
      var result=[];
      var indexServiceID;
      var indexException;
      var indexDate;
      var temp=filearray[0].split(',');
      for(var j =0;j<temp.length;j++){
        if(temp[j]=="service_id"){
          indexServiceID=j;
        }
        else if(temp[j]=="date"){
          indexDate=j;
        }
        else{
          indexException=j;
        }
      }
      for(j =1;j<filearray.length;j++){
        temp=filearray[j].split(',');
        if(temp[indexServiceID]==serviceID&&temp[indexException]==exception_type){
          result.push(temp[indexDate]);
        }        
      }
      return result;     
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

      if(state.zipsize!=0){
        if(state.GTFSmap.size==state.zipsize){
          state.saved=true;
        }
      }   
    },

    setSaved(state,b){
      Vue.set(state,'saved',b);
      
    },

    setZipsize(state,size){
      state.zipsize=size;
    },

    addZipsize(state){
      state.zipsize++;
    },

    

    //reset GTFS Data
    reset(state){
      state.zipsize=0;
      state.GTFSmap=new Map();
      state.filenames=[];
      state.saved=false;
    },

    //input:filename,UIDvalue,UIDtype,attributtype
    //change the attribute value,which has UIDvalue and in attributtype
    /**
     * @param {*} filename 
     * @param {*} UIDtype 
     * @param {*} UIDvalue
     * @param {*} attributtype
     * @param {*} attributeValue
     */
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
    setSavedAsync(context,b) {
      setTimeout(() => {
        context.commit('setSaved',b)
      }, 1000)},
  
    setZipsizeAsync(context,size) {
      setTimeout(() => {
        context.commit('setZipsize',size)
      }, 1000)},
},
  modules: {
  }
})
