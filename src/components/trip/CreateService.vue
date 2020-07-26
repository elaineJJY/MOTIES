<template>
    
    <el-dialog title="Create a Route" :visible.sync="dialogFormVisible"  :show-close="false" width="50%">
        <el-form  label-width="160px">
            
                <el-form-item label="Service ID">
                        <el-input v-model="serviceID">{{serviceID}}</el-input>
                </el-form-item>
           

            
            <el-form-item label="Service Interval">  
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    value-format="yyyyMMdd"
                    format="yyyy-MM-dd"
                    range-separator="-"
                    start-placeholder="Start date"
                    end-placeholder="End date"
                    
                >
                </el-date-picker>
            </el-form-item>      
            
            <br>

            <!-- select weekdays -->
            <el-row>    
                <el-col :offset="2">
                    <el-checkbox label="Mon" v-model="week[0]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Tue" v-model="week[1]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Wed" v-model="week[2]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Thu" v-model="week[3]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Fri" v-model="week[4]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sat" v-model="week[5]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sun" v-model="week[6]" true-label="1" false-label="0"></el-checkbox>
                </el-col >             
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
                serviceID:"",
                range: ["20200101","20200202"],
                week:[0,0,0,0,0,0,0], //week[0]=1 : Monday is selected

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
            onSubmit(){
                var theLastrow=this.GTFSmap.get("calendar.txt").length;
               //calendar.txt
                this.$store.commit("setRows",["calendar.txt",theLastrow,"service_id",this.serviceID]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"start_date",this.range[0]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"end_date",this.range[1]]);

                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"monday",this.week[0]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"tuesday",this.week[1]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"wednesday",this.week[2]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"thursday",this.week[3]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"friday",this.week[4]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"saturday",this.week[5]]);
                this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.serviceID,"sunday",this.week[6]]);

                this.setdialogFormVisible(false);
                this.$emit("setServiceID",this.serviceID);
                var service_list=this.$store.getters.getallAttribut("calendar.txt","service_id");
                this.$store.commit('setService_list',service_list);
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