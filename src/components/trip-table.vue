<template>
    <div>
        <el-row :gutter="1">

            <!-- select a existed Trip to edit -->
            <el-col :span="3" :offset="18">
                <div class="grid-content bg-purple">
                    <el-select 
                    v-model="form.tripID" 
                    placeholder="select a Trip" 
                    @visible-change="getTriplist"
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
                        <el-input v-model="form.blockID">{{form.blockID}}</el-input>
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

            <el-row :gutter="90">
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
                    <div class="grid-content bg-purple">
                        <el-select 
                        v-model="form.routeID" 
                        placeholder="select a Route" 
                        @visible-change="getRoutelist"
                        @change="refresh_route">
                            <el-option
                            v-for="item in route_id_list"
                            :key="item"
                            :value="item">
                            {{item}}
                            </el-option>
                        </el-select>
                    </div>
                </el-col>

                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="info" plain>Creat a Route</el-button>
                    </div>
                </el-col>
            </el-row>

            <el-row>

                <!-- select a existed Agency -->
                <el-col :span="7" >
                    <div class="grid-content bg-purple">
                        <el-select 
                        v-model="route_form.agency_id" 
                        placeholder="select a Agency" 
                        @visible-change="getAgencylist"
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

                <el-col :span="4">
                    <el-form-item label="Short Name">
                        <el-input v-model="route_form.shortName">{{route_form.shortName}}</el-input>
                    </el-form-item>
                </el-col>

                <el-col :span="7">
                    <el-form-item label="Long Name">
                        <el-input v-model="form.headSign">{{form.headSign}}</el-input>
                    </el-form-item>
                </el-col>
            </el-row>


            <el-row :gutter="100">
                <el-col :span="12">
                    <el-form-item label="Block ID">
                        <el-input v-model="form.blockID">{{form.blockID}}</el-input>
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

            <el-row :gutter="90">
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

                },

               
                trip_id_list:"",
                route_id_list:"",
                
            }
        },
        computed:{
            ...mapState(['GTFSmap','filenames','saved']), //improt share variable from store
 
        },
       
        methods:{

            
            test(){
                this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
                
            },

            getTriplist(){
                if(this.$store.state.filenames.length==0){
                    alert("please upload or creat a GTFS document");
                    return;
                }
                this.trip_id_list=this.$store.getters.getallAttribut("trips.txt","trip_id"); 
                // for(var i in this.trip_id_list){
                //     console.log(this.trip_id_list[i]);
                // }
                              
            },

            //refresh the data in Trip according to the trip_id
            refresh_trip(){
                this.form.shortName=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_short_name"); 
                this.form.headSign=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_headsign");
                this.form.blockID=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_block_id");
                this.form.direction=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_drection_id");
                this.form.wheelchair=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_wheelchair_accessible");
                this.form.bikes=this.$store.getters.getAttributeValue("trips.txt","trip_id",this.form.tripID,"trip_bike_allowed");
            }, 

            getRoutelist(){
                this.route_id_list=this.$store.getters.getallAttribut("agency.txt","agency_id"); 
            },
            
            refresh_route(){

            },

            getAgencylist(){
                
            },
            
            //save all the changes in this page
            onSubmit() {
                console.log('submit!');
                this.$store.commit('setAttributeValue',["trips.txt","trip_id","AB1","trip_id","123123123"])
            },
        },
        watch:{

        },

        
    }
</script>

<style scoped>

</style>