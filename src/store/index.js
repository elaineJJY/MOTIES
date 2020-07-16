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
    trip_id_list:[],
    route_id_list:[],
    service_list:[],
    stop_id_list:[],
    
  },

  getters:{

     //returns a Array of all the value of this Type 
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
    


    
     //returns the value of this Type with UIDvalue, if the file does not have this AttributeType, than return""
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

    //return a row with UID  
    getRows:(state)=>(filename,UIDtype,UID)=>{
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(',');
      
      //get position
      var UID_position;
      
      for(var i in fileAttributeType){        
        if(fileAttributeType[i]==UIDtype){
          UID_position=i;
        }
      }     
      
      //filter the file, find out the rows with UID
      var result=[];
        for(var j =1;j<filearray.length;j++){
          var temp=filearray[j].split(',');
          if(temp[UID_position]==UID){
            temp[fileAttributeType.length]=j; //the last element is row index
            result.push(temp); 
          }        
      }

      
      return result;      
    },

  

    
     //returns the array of this Type with serviceID
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


    setTrip_id_list(state,list){
      state.trip_id_list=list;
    },
    setRoute_id_list(state,list){
      state.route_id_list=list;
    },
    setService_list(state,list){
      state.service_list=list;
    },
    setStop_id_list(state,list){
      state.stop_id_list=list;
    },

    
    //input:filename,UIDvalue,UIDtype,attributtype
    //change the attribute value,which has UIDvalue and in attributtype
    setAttributeValue(state,[filename,UIDtype,UIDvalue,attributtype,attributeValue]){
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(','); 
      
      
      //find the position of the element to change   
      var uid_position;// position of the UID
      var attribute_position=-1;
      for(var i in fileAttributeType){      
        if(fileAttributeType[i]==attributtype){ 
          attribute_position=i;
        }
        if(fileAttributeType[i]==UIDtype){
          uid_position=i;
        }
      }
      
      //if this type does not exitst and we should add it to the txt
      var s="";
      if(attribute_position<0){
        fileAttributeType.push(attributtype); 
        for(var i in fileAttributeType){
          s+=fileAttributeType[i]+",";       
        }
        s=s.substring(0,s.length-1);
        filearray[0]=s;
        attribute_position=fileAttributeType.length-1;
      } 
      
      //change the value
      var j;
      for(j =1;j<filearray.length;j++){
        var temp=filearray[j].split(',');
        if(temp[uid_position]==UIDvalue){
          temp[attribute_position]=attributeValue;
          break;
        }        
      }

      //write new text
      s="";
      for(var i in fileAttributeType){
        if(typeof(temp[i]) == "undefined"){
          temp[i]="";
        }
        s+=temp[i]+",";       
      }
      
      s=s.substring(0,s.length-1);
      filearray[j]=s;
      state.GTFSmap.set(filename,filearray);  
    },


    //change the attribute value by row index
    //row:on which row it is
    //attributename:the type of the variable to change
    setRows(state,[filename,row,attributename,value]){
      var filearray=state.GTFSmap.get(filename);
      var fileAttributeType=filearray[0].split(',');
      var index=-1;
      for(var i in fileAttributeType){        
        if(fileAttributeType[i]==attributename){
          index=i;
          break;
        }
      }
      var s="";
      
      //if this type does not exitst in the fileAttributeType and we should add it to the first row
      if(index<0){
        fileAttributeType.push(attributename); 
        for(var i in fileAttributeType){
          s+=fileAttributeType[i]+",";       
        }
        s=s.substring(0,s.length-1);
        filearray[0]=s;
        index=fileAttributeType.length-1;
      } 
      
      //change the value
      var temp;
      if(row>=filearray.length){ //add the new row
        temp=new Array(fileAttributeType.length).fill("");
      }
      else{
        temp=filearray[row].split(',');
      }
      
      temp[index]=value;
      
      //array=>string
      s="";
      for(var i in fileAttributeType){
        if(typeof(temp[i]) == "undefined"){
          temp[i]="";
        }
        s+=temp[i]+",";       
      }
      s=s.substring(0,s.length-1);
      filearray[row]=s;
      state.GTFSmap.set(filename,filearray); 
    },

    deleteRows(state,[filename,rows]){
      var filearray=state.GTFSmap.get(filename);
      rows.sort().reverse();
      
      for(var i in rows){
        filearray.splice(rows[i], 1);
        
      }
      state.GTFSmap.set(filename,filearray);
    }



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
