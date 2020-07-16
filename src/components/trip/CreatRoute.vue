<template>

  <el-dialog title="Create a Route" :visible.sync="dialogFormVisible"  :show-close="false" width="80%">
    <el-form :model="route_form" label-width="160px">

        <el-row>
            <el-form-item label="Route ID">
                    <el-input v-model="route_form.routeID">{{route_form.routeID}}</el-input>
            </el-form-item>
        </el-row>

        <el-row :gutter="2"> 

            <!-- select a existed Agency -->
            <el-col :span="10" >
                <el-form-item label="Agency">
                    <el-select 
                    v-model="route_form.agency_id" 
                    placeholder=""
                    style="width:100%" >
                        <el-option
                        v-for="item in agency_list"
                        :key="item"
                        :value="item"
                        :label="item+' '+$store.getters.getAttributeValue('agency.txt','agency_id',item,'agency_name')">
                        <span style="float: left">{{item}}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{$store.getters.getAttributeValue("agency.txt","agency_id",item,"agency_name")}}</span>
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="Short Name">
                    <el-input v-model="route_form.shortName">{{route_form.longName}}</el-input>
                </el-form-item>
            </el-col>

            <el-col :span="8">
                <el-form-item label="Long Name">
                    <el-input v-model="route_form.longName">{{route_form.longName}}</el-input>
                </el-form-item>
            </el-col>
        </el-row>

        

        <el-row :gutter="1">
            <el-col :span="8">
                <el-form-item label="Type">
                    <el-select 
                        v-model="route_form.type" 
                        placeholder="Filter"
                        filterable
                        :filter-method="filterMap">
                            <el-option
                            v-for="key in type_map.keys()"
                            :key="key"
                            :value="key"
                            :label="type_map.get(key)">
                            <span style="float: left">{{key}}</span>
                            <span style="float: right; color: #8492a6; font-size: 13px">{{type_map.get(key)}}</span>
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="6">
                <el-form-item label="Sort Order">
                    <el-input v-model="route_form.sort_order"></el-input>
                </el-form-item>

            </el-col>
        
            <el-col :span="3" :offset="1">
                <el-form-item label="Route Color">
                    <el-color-picker v-model="route_form.route_color"></el-color-picker>
                </el-form-item>    
            </el-col>   

            <el-col :span="4" :offset="1">
                <el-form-item label="Route Text Color">
                    <el-color-picker v-model="route_form.text_color"></el-color-picker>
                </el-form-item>    
            </el-col> 
    
        </el-row>


        <el-form-item label="Description">
                <el-input type="textarea" autosize  v-model="route_form.description"></el-input>
        </el-form-item>


        <el-row :gutter="100">
            <el-col :span="10">
                <el-form-item label="Continous pickup">
                    <el-select 
                        v-model="route_form.continuous_pickup" 
                        placeholder="-"
                        style="width:100%">
                            <el-option
                            v-for="(item, index) in pickup_list"
                            :key="index"
                            :value="index"
                            :label="item">
                            {{item}}
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-col>

            <el-col :span="10">
                <el-form-item label="Continous drop off">          
                    <el-select 
                        v-model="route_form.continuous_drop_off" 
                        placeholder="-"
                        style="width:100%">
                            <el-option
                            v-for="(item, index) in dropoff_list"
                            :key="index"
                            :value="index"
                            :label="item">
                            {{item}}
                            </el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>

        <el-row :gutter="10">
            <el-col>
                <el-form-item label="URL">
                    <el-input v-model="route_form.url">{{route_form.url}}</el-input>
                </el-form-item>
            </el-col>
        </el-row>
    </el-form>
    
    <div slot="footer" class="dialog-footer">
        <el-button @click="setdialogFormVisible(false)">Cancel</el-button>
        <el-button type="primary" @click="onSubmit">OK</el-button>
    </div>
  </el-dialog>
  
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
export default {
    props:['visible'],
    data(){
        return{
            dialogFormVisible:false,
            route_form:{
                    routeID:"",
                    agency_id:"",
                    shortName:"",
                    longName:"",                   
                    url:"",
                    type:"",
                    sort_order:"",
                    route_color:"",
                    text_color:"",
                    description:"",
                    continuous_pickup:"",
                    continuous_drop_off:"",
            },
            route_list:"",
            agency_name:"",
            agency_list:[],
            pickup_list:["Continuous stopping pickup","No continuous stopping pickup","Must phone an agency","Must coordinate with a driver"],
            dropoff_list:["Continuous stopping drop-off","No continuous stopping drop-off","Must phone an agency","Must coordinate with a driver"],
            type_map:new Map([[0,"Tram"],[1,"Subway"],[2,"Rail"],[3,"Bus"],[4,"Ferry"],[5,"Cable tram"],[6,"Aerial lift"],[7,"Funicular"],[11,"Trolleybus"],[12,"Monorail"],
                                    [100,"Railway Service"], //Extended GTFS Route Types supported by Google Maps
                                    [101,"High Speed Rail Service"],	
                                    [102,"Long Distance Trains"],		
                                    [103,"Inter Regional Rail Service"],		
                                    [104,"Car Transport Rail Service"],		 	 
                                    [105,"Sleeper Rail Service"],		
                                    [106,"Regional Rail Service"],		
                                    [107,"Tourist Railway Service"],	
                                    [108,"Rail Shuttle (Within Complex)"],		
                                    [109,"Suburban Railway"],	
                                    [200,"Coach Service"],			 
                                    [201,"International Coach Service"],		
                                    [202,"National Coach Service"],		
                                    [203,"Shuttle Coach Service"],		 
                                    [204,"Regional Coach Service"],		
                                    [400,"Urban Railway Service"],			 
                                    [401,"Metro Service	"],	
                                    [402,"Underground Service"],		
                                    [403,"Urban Railway Service"],		
                                    [405,"Monorail"],			 
                                    [700,"Bus Service"],			 
                                    [701,"Regional Bus Service"],		
                                    [702,"Express Bus Service"],		
                                    [704,"Local Bus Service"],	
                                    [715,"Demand and Response Bus Service"],	
                                    [800,"Trolleybus Service"],		 
                                    [900,"Tram Service"],	
                                    [1200,"Ferry Service	"],		 
                                    [1300,"Aerial Lift Service"],		
                                    [1400,"Funicular Service"],		
                                    [1500,"Taxi Service"],		 
                                    [1501,"Communal Taxi Service"],	
                                    [1700,"Miscellaneous Service"],			 
                                    [1702,"Horse-drawn Carriage"]]),
                
            type_map_copy:new Map([[0,"Tram"],[1,"Subway"],[2,"Rail"],[3,"Bus"],[4,"Ferry"],[5,"Cable tram"],[6,"Aerial lift"],[7,"Funicular"],[11,"Trolleybus"],[12,"Monorail"],
                                [100,"Railway Service"], //Extended GTFS Route Types supported by Google Maps
                                [101,"High Speed Rail Service"],	
                                [102,"Long Distance Trains"],		
                                [103,"Inter Regional Rail Service"],		
                                [104,"Car Transport Rail Service"],		 	 
                                [105,"Sleeper Rail Service"],		
                                [106,"Regional Rail Service"],		
                                [107,"Tourist Railway Service"],	
                                [108,"Rail Shuttle (Within Complex)"],		
                                [109,"Suburban Railway"],	
                                [200,"Coach Service"],			 
                                [201,"International Coach Service"],		
                                [202,"National Coach Service"],		
                                [203,"Shuttle Coach Service"],		 
                                [204,"Regional Coach Service"],		
                                [400,"Urban Railway Service"],			 
                                [401,"Metro Service	"],	
                                [402,"Underground Service"],		
                                [403,"Urban Railway Service"],		
                                [405,"Monorail"],			 
                                [700,"Bus Service"],			 
                                [701,"Regional Bus Service"],		
                                [702,"Express Bus Service"],		
                                [704,"Local Bus Service"],	
                                [715,"Demand and Response Bus Service"],	
                                [800,"Trolleybus Service"],		 
                                [900,"Tram Service"],	
                                [1200,"Ferry Service	"],		 
                                [1300,"Aerial Lift Service"],		
                                [1400,"Funicular Service"],		
                                [1500,"Taxi Service"],		 
                                [1501,"Communal Taxi Service"],	
                                [1700,"Miscellaneous Service"],			 
                                [1702,"Horse-drawn Carriage"]]),
        }
    },
    computed:{
            ...mapState(['GTFSmap','filenames','saved','trip_id_list','service_list','route_id_list']), //improt share variable from store

    },
    methods:{
        
        //filter the key and value in the type_map
        filterMap(input){
            input=input.toLowerCase();    
            this.type_map = this.type_map_copy;     
            if (input) { 
                //when input is not empty
                this.type_map = new Map(
                            [...this.type_map].filter(([k, v]) => k.toString().indexOf(input)>=0 || 
                                                                    this.type_map.get(k).toLowerCase().indexOf(input)>=0));                   
            } 
        },

        //filter routeid by route_id  short name and long name
        filterRoute(input){
            input=input.toLowerCase();
            this.route_list=this.route_id_list;
            if (input) { 
                //when input is not empty
                this.route_list = this.route_list.filter((id => this.$store.getters.getAttributeValue('routes.txt','route_id',id,'route_long_name').toLowerCase().indexOf(input)>=0 || 
                                                                    this.$store.getters.getAttributeValue('routes.txt','route_id',id,'route_short_name').toLowerCase().indexOf(input)>=0||
                                                                    id.toLowerCase().indexOf(input)>=0));                   
            } 
           
        },
        
        setdialogFormVisible(val){
            this.dialogFormVisible=val;
            this.$emit("setVisible",val);
        },

        onSubmit(){
            var theLastrow=this.GTFSmap.get("routes.txt").length;
            this.$store.commit("setRows",["routes.txt",theLastrow,"route_id",this.route_form.routeID]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"agency_id",this.route_form.agency_id]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_short_name",this.route_form.shortName]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_long_name",this.route_form.longName]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_url",this.route_form.url]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_type",this.route_form.type]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"sort_order",this.route_form.sort_order]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_color",this.route_form.route_color]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_text_color",this.route_form.text_color]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"route_desc",this.route_form.description]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"continuous_pickup",this.route_form.continuous_pickup]);
            this.$store.commit('setAttributeValue',["routes.txt","route_id",this.route_form.routeID,"continuous_drop_off",this.route_form.continuous_drop_off]);
            this.setdialogFormVisible(false);
            this.$emit("setRouteID",this.route_form.routeID);
            var route_id_list=this.$store.getters.getallAttribut("routes.txt","route_id");
            this.$store.commit('setRoute_id_list',route_id_list);
        }
    },
    watch:{
        visible(val){
            this.dialogFormVisible=val;
        }

    },
    

}
</script>

<style>

</style>