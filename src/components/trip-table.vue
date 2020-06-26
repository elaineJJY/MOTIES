<template>
    <div>
        <el-row :gutter="20">

            <!-- select a existed Trip to edit -->
            <el-col :span="6" :offset="15">
                <div class="grid-content bg-purple">
                    <el-select 
                    v-model="form.tripID" 
                    filterable
                    placeholder="select or search a Trip" 
                    :disabled="!trip_id_list.length>0"
                    @change="refresh_trip">
                        <el-option
                        v-for="item in trip_id_list"
                        :key="item"
                        :value="item">
                        
                        {{item}}
                        </el-option>
                    </el-select>
                </div>
            </el-col>

            <el-col :span="3">
                <div class="grid-content bg-purple">
                    <el-button type="info" plain>Creat a Trip</el-button>
                </div>
            </el-col>
        </el-row>



        <h3>Trip</h3>
        <el-form :model="form" label-width="160px">
            <el-row :gutter="1">

                <el-col :span="6">
                    <el-form-item label="Trip ID">
                        <el-input v-model="form.tripID">{{form.tripID}}</el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="Short Name">
                        <el-input v-model="form.shortName">{{form.shortName}}</el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="9">
                    <el-form-item label="Headsign">
                        <el-input v-model="form.headSign">{{form.headSign}}</el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="Block ID">
                        <el-input  v-model="form.blockID">{{form.blockID}}</el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="12">
                    <el-form-item label="Direction">
                        这个要再改
                        <el-select v-model="form.direction" placeholder="-">
                            <el-option label="1" value="shanghai"></el-option>
                            <el-option label="2" value="beijing"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="Wheelchair accessible">
                        <el-radio-group v-model="form.wheelchair">
                            <el-radio border label="1">Yes</el-radio>
                            <el-radio border label="0o">No</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>

                <el-col :span="10">
                    <el-form-item label="Bikes allowed">
                        <el-radio-group v-model="form.bikes">
                            <el-radio border label="1">Yes</el-radio>
                            <el-radio border label="0o">No</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>


        <h3>Route</h3>
        <el-form :model="route_form" label-width="160px">
            <el-row :gutter="30">
                
                <!-- select a existed Route to edit -->
                <el-col :span="7" >
                    <el-form-item label="Route ID">
                        <el-select 
                        v-model="form.routeID" 
                        placeholder="select a Route" 
                        filterable                       
                        @change="refresh_route">
                            <el-option
                            v-for="item in route_id_list"
                            :key="item"
                            :value="item">
                            {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                

                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="info" plain>Creat a Route</el-button>
                    </div>
                </el-col>


            </el-row>
           

            <el-row :gutter="2"> 

                <!-- select a existed Agency -->
                <el-col :span="9" >
                    <el-form-item label="Agency">
                        <el-select 
                        v-model="route_form.agency_id" 
                        placeholder="select a Agency" >
                            <el-option
                            v-for="item in agency_list"
                            :key="item"
                            :value="item">
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
                            placeholder="select or search"
                            filterable
                            :filter-method="filterMap">
                                <el-option
                                v-for="key in type_map.keys()"
                                :key="key"
                                :value="key">
                                {{key}}.{{type_map.get(key)}}
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
                    <el-input v-model="route_form.description"></el-input>
            </el-form-item>


            <el-row :gutter="20">
                <el-col :span="7">
                    <el-form-item label="Continous pickup">
                        <el-select 
                            v-model="route_form.continuous_pickup" 
                            placeholder="-">
                                <el-option
                                v-for="(item, index) in pickup_list"
                                :key="index"
                                :value="index">
                                {{item}}
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="Continous drop off">          
                        <el-select 
                            v-model="route_form.continuous_drop_off" 
                            placeholder="-">
                                <el-option
                                v-for="(item, index) in dropoff_list"
                                :key="index"
                                :value="index">
                                {{item}}
                                </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="9">
                    <el-form-item label="URL">
                        <el-input v-model="route_form.url">{{route_form.url}}</el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>

         <el-button type="success" round @click="onSubmit">Submit</el-button>
        <button @click="test">测试</button>
    </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
    export default {
        data(){
            return{
                form:{
                    tripID:"",
                    shortName:"",
                    headSign:"",
                    blockID:"",
                    direction:"",
                    wheelchair:"",
                    bikes:"",
                    routeID:"",
                },

                route_form:{
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

                agency_name:"",
                trip_id_list:[],
                route_id_list:[],
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
            ...mapState(['GTFSmap','filenames','saved']), //improt share variable from store
        },
       
        methods:{
            
            test(){
                this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
                
            },

            // //input:filename   attributtype 
            // //output:a Array of all the value of this Type 
            // getallAttribut(filename,attributtype){
            // var filearray=this.GTFSmap.get(filename);
            // var fileAttributeType=filearray[0].split(',');
            // var found=false;
            // var i;// position of the attribute to find
            // for(i in fileAttributeType){
            //     if(fileAttributeType[i]==attributtype){
            //     found=true;
            //     break;
            //     }
            // }      
            // var result=new Set();
            // if(!found){return result;}
            // for(var j =1;j<filearray.length;j++){
            //     var temp=filearray[j].split(',');
            //     result.add(temp[i]);
            // }
            // return Array.from(result);         
            // },



            //refresh the data in Trip according to the trip_id
            refresh_trip(){               
                this.form.shortName=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_short_name");                
                this.form.headSign=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_headsign");
                this.form.blockID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_block_id");
                this.form.direction=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_drection_id");
                this.form.wheelchair=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_wheelchair_accessible");
                this.form.bikes=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_bike_allowed");
                this.form.routeID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"route_id");
                this.refresh_route();
            }, 


            
            refresh_route(){
                this.route_form.agency_id=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"agency_id"); 
                this.route_form.shortName=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_short_name");  
                this.route_form.longName=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_long_name"); 
                this.route_form.url=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_url");  
                this.route_form.type=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_type");   
                this.route_form.sort_order=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_sort_order"); 
                this.route_form.route_color=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_color"); 
                this.route_form.text_color=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_text_color"); 
                this.route_form.description=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"route_desc"); 
                
                //1 or empty - No continuous stopping
                this.route_form.continuous_pickup=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"continuous_pickup");
                if(this.route_form.continuous_pickup.length==0){this.route_form.continuous_pickup=1;} 
                
                this.route_form.continuous_drop_off=this.$store.getters.getAttributeValue("routes.txt","route_id",this.form.routeID,"continuous_drop_off"); 
                if(this.route_form.continuous_drop_off.length==0){this.route_form.continuous_drop_off=1;} 
            },

          
            
            //save all the changes in this page
            onSubmit() {
                console.log('submit!');
                this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
            },


            //filter the key and value in the type_map
            filterMap(input){
                input=input.toLowerCase();         
                if (input) { 
                    //when input is not empty
                    this.type_map = new Map(
                                [...this.type_map].filter(([k, v]) => k.toString().indexOf(input)>=0 || 
                                                                        this.type_map.get(k).toLowerCase().indexOf(input)>=0));                   
                } 
                else { 
                    //when input is empty, resume the type_map
                    this.type_map = this.type_map_copy;
                }

                
            },

        },
        watch:{

            saved(val){               
                if(val){  
                    setTimeout(() => {
                        this.trip_id_list=this.$store.getters.getallAttribut("trips.txt","trip_id");                    
                        this.route_id_list=this.$store.getters.getallAttribut("routes.txt","route_id"); 
                        this.agency_list=this.$store.getters.getallAttribut("agency.txt","agency_id");
                    }, 100)  
                }                  
                
            },


        },

        
    }
</script>

<style scoped>

</style>