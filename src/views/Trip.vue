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
                    <el-button type="danger" plain @click="setdialogFormVisible(true)">Creat a Trip</el-button>
                    <CreateTrip :visible="dialogFormVisible" @setVisible='setdialogFormVisible' @setTripID="setTripID"></CreateTrip>
                </div>
            </el-col>
        </el-row>

    <br>

    <el-tabs type="border-card">
        <el-tab-pane label="Trip">
            
                <h2>Trip</h2>
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

                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="Block ID">
                                <el-input  v-model="form.blockID">{{form.blockID}}</el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="10">
                            <el-form-item label="Direction">
                                <el-select v-model="form.direction" placeholder="-">
                                    <el-option
                                    v-for="(item, index) in directions"
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
                                placeholder="Filter" 
                                filterable 
                                popper-class="optionsContainter"
                                :filter-method="filterRoute">
                                    <template>
                                        <div class="optionHeader" >
                                            <span style="float: left">ID</span>
                                            <span style="float: left">Short Name</span>
                                            <span style="float: left">Long Name</span>
                                        </div>
                                    </template>
                                    <el-option
                                    v-for="item in route_id_list"
                                    :key="item"
                                    :value="item">
                                    
                                    <span style="float: left">{{item}}</span>
                                    <span style="float: left">{{$store.getters.getAttributeValue('routes.txt','route_id',item,'route_short_name')}}</span>
                                    <span style="float: left">{{$store.getters.getAttributeValue('routes.txt','route_id',item,'route_long_name')}}</span>
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
                                filterable
                                style="width:100%">
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
                
                <el-row>
                    <el-col :offset="20">
                        <el-button type="success" round @click="onSubmit">Submit</el-button>
                    </el-col>
                </el-row>
        </el-tab-pane>

        <el-tab-pane label="Route">
            <Route 
                ref="route" 
                :tripform='form'
                @setRouteID="setRouteID">
            </Route>
        </el-tab-pane>

        <el-tab-pane label="Service Days">
            <Service 
                ref="service" 
                :tripform='form' 
                @setServiceID="setServiceID">
            </Service>
        </el-tab-pane>

        <el-tab-pane label="Stop">
            <Stop
                ref="stop" 
                :tripform='form'>
            </Stop>
        </el-tab-pane>

        <el-tab-pane label="Frenquencies">
            <Frenquencies
                ref="frenquencies" 
                :tripform='form'>
            </Frenquencies>
        </el-tab-pane>
    </el-tabs>
     
        
    </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import Service from '@/components/trip/Service'
import Route from '@/components/trip/Route'
import Stop from '@/components/trip/Stop'
import Frenquencies from '@/components/trip/Frenquencies'
import CreateTrip from '@/components/trip/CreateTrip'
    export default {
        components:{
            Service,
            Route,
            Stop,
            Frenquencies,
            CreateTrip,
        },
        data(){
            return{
                dialogFormVisible:false,
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
               
                directions:["one direction","opposite direction"]


            }
        },
        computed:{
            ...mapState(['GTFSmap','filenames','saved','trip_id_list','route_id_list','service_list']), //improt share variable from store
            

        },
       
        methods:{
            setdialogFormVisible(val){
                this.dialogFormVisible = val;
            },

            setServiceID(id){
                this.form.tripID=id;
                this.$emit("setTripID",id);
                this.refresh_trip();
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
                this.$refs.stop.refresh_stop();
                this.$refs.frenquencies.refresh();
                
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
            setRouteID(id){
                this.form.routeID=id;
            },
            setServiceID(id){
                this.form.serviceID=id;
            },
            setTripID(id){
                this.form.tripID=id;
                this.refresh_trip();
            },

            //save all the changes in this page
            onSubmit() {
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"trip_short_name",this.form.shortName]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"trip_headsign",this.form.headSign]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"block_id",this.form.blockID]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"direction_id",this.form.direction]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"wheelchair_accessible",this.form.wheelchair]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"bikes_allowed",this.form.bikes]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"route_id",this.form.routeID]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"service_id",this.form.serviceID]);
                this.$message('already saved');
            },


        },
        watch:{
        },

        
    }
</script>

<style scoped>

.optionsContainter span{
    width:120px;
    text-align: center;
}
.optionsContainter{
    width:70%;
    display: block;
}

.optionHeader span{
    width:120px;
    text-align: center;
}
.optionHeader{
    background:rgb(98, 116, 150);
    color:#fff;
    height: 40px;
    line-height: 40px;
    font-size:14px;
    font-family:HiraginoSansGB-W3;
    font-weight:600;
    padding: 0 20px;
}


</style>