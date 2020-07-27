<template>
  <div>
       <h3>Service Days</h3>
        <el-form label-width="160px">
            <el-row :gutter="100">
                
                <!-- select a existed service to edit -->
                <el-col :span="10" >
                    <el-form-item label="Service ID">
                        <el-select 
                        v-model="form.serviceID" 
                        placeholder="select a Service" 
                        filterable  
                        style="width:100%"                     
                        @change="refresh_service">
                            <el-option
                            v-for="item in service_list"
                            :key="item"
                            :value="item">
                            {{item}}
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>

                <el-col :span="3">
                    <div class="grid-content bg-purple">
                        <el-button type="danger" plain @click="setdialogFormVisible(true)">Creat a Service</el-button>
                        <CreateService :visible="dialogFormVisible" @setVisible='setdialogFormVisible' @setServiceID="setServiceID"></CreateService>
                    </div>
                </el-col>
            
            </el-row>
                       

            <!-- Service Interval -->
               
            <el-form-item label="Service Interval"> 
                <el-date-picker
                v-model="range"
                type="daterange"
                value-format="yyyyMMdd"
                format="yyyy-MM-dd"
                range-separator="To"
                start-placeholder="Start date"
                end-placeholder="End date"
                >
                </el-date-picker>
            </el-form-item>
                
            

            <!-- select weekdays -->
            <el-row>
                <el-col :offset="2"  :span="14">                  
                    <el-checkbox label="Mon" v-model="week[0]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Tue" v-model="week[1]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Wed" v-model="week[2]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Thu" v-model="week[3]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Fri" v-model="week[4]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sat" v-model="week[5]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sun" v-model="week[6]" true-label="1" false-label="0"></el-checkbox>
                </el-col> 

                <el-col :span="4">
                    <el-button type="warning" @click="show" plain>show Calender</el-button>
                </el-col>  
                  
            </el-row>
            
            <br>
        
            <!-- Calender -->
            <v-calendar
            class="vc-container"
            :attributes="attrs"
            ref="calendar"
            is-inline
            :masks="{L: 'YYYYMMDD'}"               
            @dayclick="dayclick"
            :rows="3"
            :columns="$screens({ default: 4})"                  
            />

        </el-form>

        <div align="right">
            <el-button type="success" round @click="OnSubmit">Submit</el-button>
        </div>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import  CreateService from './CreateService';
export default {
    props:['tripform'],
    components:{
        CreateService,
    },
    data(){
        return{
            dialogFormVisible:false,
            form:this.tripform,
            range: ["20200101","20200202"],
            exception_type1:[], //the imported specified date , will never be changed later   the edited array is in attrs
            exception_type2:[],
            week:[0,0,0,0,0,0,0], //week[0]=1 : Monday is selected
            toDeletRows:[],
            attrs:[
                    {   
                        highlight: true,
                        dates:{
                                start:"20200101",
                                end:"20200202",   
                                weekdays:[] //1: Sun to 7: Sat
                            },
                    },
                    {   //exception_type 2
                        highlight: "red", //Service has been removed for the specified date.
                        dates:[],  //edited Exception2
                    },
                    {   //exception_type 1
                        highlight: "green", //Service has been added for the specified date.
                        dates:[],  //edited Exception1
                    },
                    {   
                        highlight: false,
                        dates:[],
                    }
                ],
        }
    },
    
    computed:{
    ...mapState(['GTFSmap','filenames','saved','trip_id_list','service_list']), //improt share variable from store
    
        weekarray(){
            var weekarray=new Array();
            for(var index in this.week){
                if(this.week[index]==1){
                    if(index==6){
                        weekarray.push(1);
                        continue;
                    }
                    weekarray.push(parseInt(index)+2);
                }
            }
            return weekarray;
        },
    },
    methods:{
        refresh_service(){
            var temp=this.$store.getters.getDateArray(this.form.serviceID,1);
            this.exception_type1=temp[0];
            this.toDeletRows=temp[1];
            temp=this.$store.getters.getDateArray(this.form.serviceID,2);
            this.exception_type2=temp[0];
           
            this.toDeletRows=this.toDeletRows.concat(temp[1]); 
            
            var start=this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"start_date"); 
            var end=this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"end_date"); 
            this.range=[start,end];

            var week=[];
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"monday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"tuesday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"wednesday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"thursday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"friday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"saturday")); 
            week.push(this.$store.getters.getAttributeValue("calendar.txt","service_id",this.form.serviceID,"sunday")); 
            this.week=week;
            setTimeout(this.refreshCalender,100);        
        },

        refreshCalender(){
            this.closeHighlight();
            const calendar = this.$refs.calendar;                
            calendar.move({ month:1, year: this.range[0].substring(0,4) })
            let attrs=[...this.attrs];

            attrs=[
                {   
                    highlight: true,
                    dates:{
                            start:this.range[0]+100,
                            end:this.range[1]+100,   
                            weekdays:this.weekarray 
                        },
                },
                {   
                    highlight: "red",
                    dates:this.exception_type2,
                },
                {   
                    highlight: "green",
                    dates:this.exception_type1,
                },
                {   
                    highlight: false,
                    dates:[],
                }
            ],
            
            this.attrs=attrs;
            
        },

        show(){
            this.exception_type1=[];
            this.exception_type2=[];
            this.refreshCalender();
        },


        closeHighlight(){
            let attrs=[...this.attrs];
            for(var i in attrs){
                attrs[i].highlight=false;
            }  
            this.attrs=attrs;
        },
        openHighlight(){ 
            let attrs=[...this.attrs];
            attrs[0].highlight=true;
            attrs[1].highlight="red";
            attrs[2].highlight='green';
            attrs[3].highlight=false;       
            this.attrs=attrs;
        },

        //change the highlight in the calender
        dayclick(e){
            this.closeHighlight();
            var day="";
            if(e.year<1000){
                day+="0";
                day+=e.year;  
            }
            else{
                day+=e.year;
            }
            if(e.month<10){
                day+="0";
                day+=e.month;
            }
            else{
                day+=e.month;
            }
            if(e.day<10){
                day+="0";
                day+=e.day;
            }
            else{
                day+=e.day;
            }

            let attrs=[...this.attrs];

            var inRange=false;
            var inRed=attrs[1].dates.findIndex(item => item == day);
            var inGreen=attrs[2].dates.findIndex(item => item == day);

            if(day>=this.range[0]&&day<=this.range[1]){
                var date=new Date(e.year,e.month-1,e.day);
                var weekday=date.getDay();
                if(weekday==0){
                    weekday=6;
                }
                if(this.week[weekday-1]==1){
                    inRange=true;    
                } 
            }

            if(inRange&&(inRed==-1)){
                //blue->red
                attrs[1].dates.push(day);
            }
            else if(inRed!=-1){
                //red--> blue   
                attrs[1].dates.splice(inRed,1);
            }
            else if(inGreen!=-1){
                //green->white
                attrs[2].dates.splice(inGreen,1);
                attrs[3].dates.push(day);
            }
            else{
                //white->green
                attrs[2].dates.push(day);
            }
            
            this.attrs=attrs;
            this.openHighlight();
            
        },


        setdialogFormVisible(val){
            this.dialogFormVisible = val;
        },

        setServiceID(id){
            this.form.serviceID=id;
            this.refresh_service();
            this.$emit("setServiceID",id);
        },

        onSubmit(){
            //trip.txt
            this.$store.commit('setAttributeValue',["trips.txt","trip_id",this.form.tripID,"service_id",this.form.serviceID]);
            
            //calendar.txt
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"start_date",this.range[0]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"end_date",this.range[1]]);

            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"monday",this.week[0]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"tuesday",this.week[1]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"wednesday",this.week[2]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"thursday",this.week[3]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"friday",this.week[4]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"saturday",this.week[5]]);
            this.$store.commit('setAttributeValue',["calendar.txt","service_id",this.form.serviceID,"sunday",this.week[6]]);

            //calandar_dates.txt
        
            this.$store.commit('deleteRows',["calendar_dates.txt",this.toDeletRows]);
            for(let date of this.attrs[2].dates){     //exception_type 1
                var theLastrow=this.GTFSmap.get("calendar_dates.txt").length;
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"service_id",this.form.serviceID]);
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"date",date]);
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"exception_type",1]);
            }
            
            for(let date of this.attrs[1].dates){     //exception_type 2
                var theLastrow=this.GTFSmap.get("calendar_dates.txt").length;
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"service_id",this.form.serviceID]);
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"date",date]);
                this.$store.commit("setRows",["calendar_dates.txt",theLastrow,"exception_type",2]);
            }
            this.$message('already saved');
            this.refresh_service();
        },

    },
    mounted:function(){
        const calendar = this.$refs.calendar;                
        calendar.move({ month:1, year: this.range[0].substring(0,4)}) ; 
    },
    watch:{
        range(){
            this.closeHighlight();
        },
        week(){
            this.closeHighlight();
        },
    }

    
}
</script>

<style>

.vc-container{
  width: auto !important;
}

</style>