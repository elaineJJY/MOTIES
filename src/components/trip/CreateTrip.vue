<template>
    <el-dialog title="Create a Route" :visible.sync="dialogFormVisible"  :show-close="false" width="80%">
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
                route_list:"",
                directions:["one direction","opposite direction"]

            }
        },
        computed:{
            ...mapState(['GTFSmap','filenames','saved','trip_id_list','service_list','route_id_list']), //improt share variable from store

        },
        methods:{
        
            setdialogFormVisible(val){
                this.dialogFormVisible=val;
                this.$emit("setVisible",val);
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

            onSubmit(){
                var theLastrow=this.GTFSmap.get("trips.txt").length;
                this.$store.commit("setRows",["trips.txt",theLastrow,"trip_id",this.form.tripID]);
               this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"trip_short_name",this.form.shortName]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"trip_headsign",this.form.headSign]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"block_id",this.form.blockID]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"direction_id",this.form.direction]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"wheelchair_accessible",this.form.wheelchair]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"bikes_allowed",this.form.bikes]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"route_id",this.form.routeID]);
                this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"service_id",this.form.serviceID]);
                this.setdialogFormVisible(false);
                this.$emit("setTripID",this.form.tripID);
                var trip_id_list=this.$store.getters.getallAttribut("trips.txt","trip_id");
                this.$store.commit('setTrip_id_list',trip_id_list);
            }
        },
        watch:{
            visible(val){
                this.dialogFormVisible=val;
            }

        },

    }
</script>

<style lang="scss" scoped>

</style>