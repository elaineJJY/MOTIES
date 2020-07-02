<template>
  <div>
       <h3>Service Days</h3>
        <el-form label-width="160px">
            <el-row :gutter="100">
                
                <!-- select a existed service to edit -->
                <el-col :span="9" >
                    <el-form-item label="Service ID">
                        <el-select 
                        v-model="form.serviceID" 
                        placeholder="select a Service" 
                        filterable                       
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
                        <el-button type="info" plain>Creat a Service</el-button>
                    </div>
                </el-col>
            
            </el-row>
                       

            <!-- Service Interval -->
            <el-row>
                <el-col :offset="1">
                    <div class="block">
                        <span class="demonstration">Service Interval </span>
                        <el-date-picker
                        inline
                        v-model="range"
                        type="daterange"
                        value-format="yyyyMMdd"
                        format="yyyy-MM-dd"
                        range-separator="To"
                        start-placeholder="Start date"
                        end-placeholder="End date"
                        >
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>
            
            <br>

            <!-- select weekdays -->
            <el-row>
                <el-col :offset="6"  :span="12">                  
                    <el-checkbox label="Mon" v-model="week[0]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Tue" v-model="week[1]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Wed" v-model="week[2]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Thu" v-model="week[3]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Fri" v-model="week[4]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sat" v-model="week[5]" true-label="1" false-label="0"></el-checkbox>
                    <el-checkbox label="Sun" v-model="week[6]" true-label="1" false-label="0"></el-checkbox>
                </el-col> 

                <el-col :span="4">
                    <el-button type="warning" @click="refreshCalender" plain>show Calender</el-button>
                </el-col>  
                  
            </el-row>
            
            <br>
        
            <!-- Calender -->
        
            <v-calendar
            class="vc-container "
            :attributes="attrs"
            ref="calendar"
            is-inline
            :masks="{L: 'YYYYMMDD'}"               
            @dayclick="dayclick"
            :rows="3"
            :columns="$screens({ default: 4})"                  
            />

           
        </el-form>
  </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
export default {
    props:['tripform'],
    
    data(){
        return{
            form:this.tripform,
            range: ["20200101","20200202"],
            exception_type1:[], //the imported specified date , will never be changed later   the edited array is in attrs
            exception_type2:[],
            week:[0,0,0,0,0,0,0], //week[0]=1 : Monday is selected
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
            this.exception_type1=this.$store.getters.getDateArray(this.form.serviceID,1); 
            this.exception_type2=this.$store.getters.getDateArray(this.form.serviceID,2); 
            
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
            setTimeout(this.refreshCalender,200);
            //this.refreshCalender();               
        },

        refreshCalender(){
            this.closeHighlight;
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
            attrs[4].highlight=true;
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
            
        }

    },
    watch:{
        saved(val){   
                const calendar = this.$refs.calendar;                
                calendar.move({ month:1, year: this.range[0].substring(0,4)})            
                                 
                
        },
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
  --day-content-height : 5px;
  --day-content-width : 5px;
  width: auto !important;
  
}

</style>