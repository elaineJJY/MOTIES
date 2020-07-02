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

            <el-row>
                <!-- select a existed Route -->
                <el-col :span="9" >
                    <el-form-item label="Route ID">
                        <el-select 
                        v-model="form.routeID" 
                        placeholder="select a Route" 
                        filterable>
                            <el-option
                            v-for="item in route_id_list"
                            :key="item"
                            :value="item">
                            {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <!-- select a existed service -->
                <el-col :span="9" >
                    <el-form-item label="Service ID">
                        <el-select 
                        v-model="form.serviceID" 
                        placeholder="select a Service" 
                        filterable>
                            <el-option
                            v-for="item in service_list"
                            :key="item"
                            :value="item">
                            {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>


            </el-row>
        </el-form>


             
        <el-button type="success" round @click="onSubmit">Submit</el-button>
        <button @click="test">测试</button>

        <Route 
            ref="route" 
            :tripform='form'
            :trip_list='trip_id_list'
            :route_list='route_id_list'>
        </Route>

        <Service 
            ref="service" 
            :tripform='form' 
            :trip_list='trip_id_list'
            :service_list_fromtrip='service_list'>
        </Service>
        
    </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import Service from '@/components/trip/Service'
import Route from '@/components/trip/Route'
    export default {
        components:{
            Service,
            Route,
        },
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
                    serviceID:"",
                },


            }
        },
        computed:{
            ...mapState(['GTFSmap','filenames','saved','trip_id_list','route_id_list','service_list']), //improt share variable from store
            

        },
       
        methods:{
            
            test(){
                //this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
                
            },

         

            //refresh the data in Trip according to the trip_id
            refresh_trip(){               
                this.form.shortName=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_short_name");                
                this.form.headSign=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_headsign");
                this.form.blockID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_block_id");
                this.form.direction=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_drection_id");
                this.form.wheelchair=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_wheelchair_accessible");
                this.form.bikes=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_bike_allowed");
                this.form.routeID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"route_id");
                this.form.serviceID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"service_id");
                
                this.$refs.route.refresh_route();
                this.$refs.service.refresh_service();
                
                
            }, 


            //save all the changes in this page
            onSubmit() {
                console.log('submit!');
                this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
            },


        },
        watch:{

            saved(val){              
                if(val){  
                    setTimeout(() => {
                        var trip_id_list=this.$store.getters.getallAttribut("trips.txt","trip_id");
                        this.$store.commit('setTrip_id_list',trip_id_list);                    
                        
                        var route_id_list=this.$store.getters.getallAttribut("routes.txt","route_id");
                        this.$store.commit('setRoute_id_list',route_id_list);  
                        
                        var service_list=this.$store.getters.getallAttribut("calendar.txt","service_id");
                        this.$store.commit('setService_list',service_list);   
                    }, 100)  
                }                  
                
            },

        },

        
    }
</script>

<style scoped>




</style>