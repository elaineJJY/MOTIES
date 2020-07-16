<template>
 
 <el-select 
        :value="stop_id"
         placeholder="Filter"
         filterable
         :filter-method="filterHandler"
         style="width:100%"
         >

    <el-option :value="stop_id" :label="stop_id">
        <el-table
            :data="options"
            :row-style="{height:'20px'}"
            :cell-style="{padding:'0px'}"
            style="width:auto;margin-bottom: 20px;"
            row-key="id"
            border
            default-expand-all
            @row-click="handleRowclick"
            :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            
                <el-table-column
                prop="id"
                label="Stop ID" 
                width="150">
                </el-table-column>

                <el-table-column
                prop="name"
                label="Name"
                width="250">
                </el-table-column>

                <el-table-column
                v-if="showType"
                prop="type"
                label="Type"
                sortable
                width="180">
                </el-table-column>

                <el-table-column
                v-if="showPlatform"
                prop="platform"
                label="Platform"
                width="180">
                </el-table-column>  
        </el-table>
    </el-option>
  </el-select>

</template>


<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'

  export default {
    props:['content'],
    data() {
      return {
        stop_id:this.content[0],
        index:this.content[1],
        filterText:"",
        showPlatform:true,
        showType:true,
        options: [],
        options_backup: [],
        indexMap:[],
      };
    },
    computed:{
        ...mapState(['GTFSmap','filenames','saved','trip_id_list','route_id_list','service_list','stop_id_list']), //improt share variable from store
    },
    methods: {

        initTable(){
            var filearray=this.GTFSmap.get("stops.txt");
            
            var fileAttributeType=filearray[0].split(',');
            //get positions of each important field Name
            var stop_id_position=-1;
            var stop_name_position=-1;
            var location_type_position=-1;
            var parent_station_position=-1;
            var platform_code_positoon=-1;
            for(var i in fileAttributeType){
                if(fileAttributeType[i]=="stop_id"){
                    stop_id_position=i;
                }
                if(fileAttributeType[i]=="stop_name"){
                    stop_name_position=i;
                }
                if(fileAttributeType[i]=="location_type"){
                    this.showType=true;
                    location_type_position=i;
                }
                if(fileAttributeType[i]=="parent_station"){
                    parent_station_position=i;
                }
                if(fileAttributeType[i]=="platform_code"){
                    this.showPlatform=true;
                    platform_code_position=i;
                }
            }
            

            var map = new Map();
            var parentlist = [];
            for(var j =1;j<filearray.length;j++){
                var filerow=filearray[j].split(',');
                var temp={
                    id : filerow[stop_id_position],
                    name : filerow[stop_name_position],
                    type : filerow[location_type_position],
                    parent : filerow[parent_station_position], 
                    platform  : filerow[platform_code_positoon],
                }
                if(parent_station_position>0 && filerow[parent_station_position]!=""){
                    parentlist.push(filerow[parent_station_position]);
                }
                map.set(filerow[stop_id_position],temp);
            }

            this.showPlatform=false;
            this.showType=false;
            //build this.options
            this.options=[];
            //set the parents
            for(var j in parentlist){
                var node = map.get(parentlist[j]);
                node.children=[];
                map.set(node.id,node);
            }
            
            
            for (let [key, value] of map.entries()){
                var isParent=parentlist.indexOf(key)>0;
                
                if(isParent){continue;}

                if((typeof value.parent)!="undefined"){
                    //push this node into its parent's childrenArray
                    var parent_node=map.get(node.parent);
                    parent_node.children.push(value);
                    map.set(node.parent,parent_node);
                }
                else{
                    //dont have parent
                    this.options.push(value); 
                }
                map.delete(key);
                    
                
            }
            for(var key of map){
                this.options.push(map.get(key)); //puah the parents
                map.delete(key);
            } 
            this.options_backup=this.options;  
        },

        filterHandler(input){
            input=input.toLowerCase();
            this.options=JSON.parse(JSON.stringify(this.options_backup)); //copy
            if (input) { 
                //when input is not empty
                var newoptions=[];
                for(var j in this.options){
                    
                    var data = this.options[j];
                   
                    var id=data.id.toString().toLowerCase();
                    var type=data.type.toString().toLowerCase();
                    var name=data.name.toString().toLowerCase();
                    var children=data.children;
                    var match=false;

                    if(typeof children != "undefined"){ //check whether the child match the input
                        var newchildren=[];
                        for(var i in children){
                            var id=children[i].id.toString().toLowerCase();
                            var type=children[i].type.toString().toLowerCase();
                            var name=children[i].name.toString().toLowerCase();
                            var matchChild=(id.indexOf(input)>=0||
                                    type.indexOf(input)>=0||
                                        name.indexOf(input)>=0);
                            if(matchChild){
                                newchildren.push(children[i]);
                                match=true
                            }
                        }
                        data.children=newchildren; 
                    }
            
                    match=(id.toLowerCase().indexOf(input)>=0||
                                    type.toLowerCase().indexOf(input)>=0||
                                        name.toLowerCase().indexOf(input)>=0)||match;
                                
                                        
                    if(match){
                        newoptions.push(data);
                    }
                }
                this.options=newoptions;                
            } 

        },

        handleRowclick(row){
            this.stop_id=row.id;
        }

    },
    mounted(){
        this.initTable();  
        
    },
    watch: {
        stop_id(){
            this.$emit("setStopID",[this.stop_id,this.index]);
        },
        saved(val){
            if(val){
                setTimeout(this.initTable,100);
            }
           
            //this.initTable(); 
        }
    },
  };
</script>

<style scoped>
.el-scrollbar .el-scrollbar__view .el-select-dropdown__item{
height: auto;
max-height: 500px;
padding: 0;
overflow: hidden;
overflow-y: auto;
}
.el-select-dropdown__item.selected{
font-weight: normal;
}







</style>