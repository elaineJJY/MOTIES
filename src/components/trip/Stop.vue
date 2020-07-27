<template>
  <div>
    <el-table
        :data="stopTimes"
        style="width:100%"
        height="500px"
        row-key="row"
        ref="table"
        >
        
        <el-table-column prop="stop_id" label="Stop" width="300">
            <template slot-scope="scope">
                <stop-picker :content="[stopTimes[scope.$index].stop_id,scope.$index]" @setStopID='setID'></stop-picker>
           </template>
        </el-table-column>
        
       <el-table-column prop="arrival_time" label="Arrival" placeholder="00:00:00" width="200">
           <template slot-scope="scope">
            <el-input v-model="stopTimes[scope.$index].arrival_time"></el-input>
           </template>
       </el-table-column>

        <el-table-column prop="departure_time" label="Departure" placeholder="00:00:00" width="200">
           <template slot-scope="scope">
            <el-input v-model="stopTimes[scope.$index].departure_time"></el-input>
           </template>
       </el-table-column>

        <el-table-column prop="pickup_type" label="Pickup" width="140">
           <template slot-scope="scope">
               
                <el-select 
                    v-model="stopTimes[scope.$index].pickup_type">
                        <el-option
                        v-for="(item, index) in pickup_list"
                        :key="index"
                        :value="index"
                        :label="item">
                        {{item}}
                        </el-option>
                </el-select>
                    
           </template>
       </el-table-column>

       <el-table-column prop="drop_off_type" label="Drop off" width="140">
           <template slot-scope="scope">
                <el-select 
                    v-model="stopTimes[scope.$index].drop_off_type">
                        <el-option
                        v-for="(item, index) in dropoff_list"
                        :key="index"
                        :value="index"
                        :label="item">
                        {{item}}
                        </el-option>
                </el-select>
           </template>
       </el-table-column>

        <el-table-column prop="stop_headsign" label="Headsign" width="200">
           <template slot-scope="scope">
            <el-input v-model="stopTimes[scope.$index].stop_headsign"></el-input>
           </template>
       </el-table-column>

        <el-table-column className="handle" width="50" align="center">  
            <template>  
                <i class="el-icon-d-caret"></i>  
            </template>  
        </el-table-column>  

        <el-table-column
        fixed="right"
        >
            <template slot-scope="scope">
                <el-button
                @click="deleteRow(scope.$index)"
                type="danger"
                circle
                icon="el-icon-close"
                >
                </el-button>
                
            </template>
        </el-table-column>

    </el-table>
    
    <hr>

    <!-- add a new Stop -->
    <el-form  :model="newStop" label-position="top" label-width="80px">
        <el-row  :gutter="10">
            <el-col :span="6">
                <el-form-item label="Stop" >
                    <stop-picker ref="stoppicker" :content="['',-1]" @setStopID='setID'></stop-picker>
                </el-form-item>
            </el-col>

            <el-col :span="3">
                <el-form-item label="Arrival" >
                    <el-input v-model="newStop.arrival_time" placeholder="00:00:00"></el-input>
                </el-form-item>
            </el-col>

            <el-col :span="3">
                <el-form-item label="Departure" >
                    <el-input v-model="newStop.departure_time" placeholder="00:00:00"></el-input>
                </el-form-item>
            </el-col>
            
            <el-col :span="3">
                <el-form-item label="Pickup" >
                    <el-select 
                    v-model="newStop.pickup_type">
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

            <el-col :span="3">
                <el-form-item label="Drop off" >
                    <el-select 
                    v-model="newStop.drop_off_type">
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

            <el-col :span="6">
                <el-form-item label="Headsign" >
                   <el-input v-model="newStop.stop_headsign"></el-input>
                </el-form-item>
            </el-col>

            
        </el-row>
        
    </el-form>

    <div align="right">
        <el-button type="danger" plain @click="addNewStop">Add this Stop</el-button>
    </div>
    <br>
    <br>
    <div align="right">
         <el-button type="success" round @click="OnSubmit">Submit</el-button>
    </div>
     
     

  </div>
</template>

<script>
import Sortable from "sortablejs";
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
import stopPicker from './stop-picker.vue';

export default {
    props:['tripform'],
    components:{
        stopPicker,
       
       
    },
    data() {
        return {
            form:this.tripform,
            indexMap:new Map(), //[['arrival_time',2],...]
            newrow:-1,
            lastchange:-1,
            toDeletRows:[],
            stopTimes: [],
            newStop:{
                row:"",
                stop_id:"",
                arrival_time:"",
                departure_time:"",
                pickup_type:1,
                drop_off_type:1,
                stop_headsign:"",
            },
            pickup_list:["Regular","No pickup","By Phone", "with driver"],
            dropoff_list:["Regular","No drop off","By Phone","with driver"],
        };
    },
    computed:{
        ...mapState(['GTFSmap','filenames','saved','trip_id_list','route_id_list','service_list']), //improt share variable from store
    },
    methods: {
        deleteRow(index){
            var row=this.stopTimes[index].row;
            if(row<0){
                return;
            }
            this.toDeletRows.push(row);          
            this.stopTimes.splice(index,1);
        },
        setID(arg){
            var id = arg[0];
            var index = arg[1];
            if(index>0){
                this.stopTimes[index].stop_id=id;
            }
            if(index<0){
                this.newStop.stop_id=id;
            }
            
        },
     

        //check whether the format is correct and add it to the table
        addNewStop(){
            this.newStop.row=this.newrow;
            this.newrow--;
        
            var newArrive=this.newStop.arrival_time.replace(":","");
            var newDeparture=this.newStop.departure_time.replace(":","");
            
            var added=false;
            for(var i in this.stopTimes){
                
                var arrive=this.stopTimes[i].arrival_time.replace(":","");
                var departure=this.stopTimes[i].departure_time.replace(":","");
                if(newArrive<=arrive){
                    if(newDeparture>=departure){
                        alert("wrong time!")
                        return;
                    }
                    else{
                        this.stopTimes.splice(i,0,this.newStop);
                        added=true;
                        break;
                    }
                }
            }
            if(!added){
                this.stopTimes.push(this.newStop);
            }
            this.newStop={
                row:"",
                stop_id:"",
                arrival_time:"",
                departure_time:"",
                pickup_type:1,
                drop_off_type:1,
                stop_headsign:"",
            };
            //this.sortStops();
        },
        
        sortStops(list){
            var stop_sequence_position;
            
            var stop_sequence_position=this.indexMap.get("stop_sequence");
            list.sort(function(a,b){
                var seqa=a[stop_sequence_position];
                var seqb=b[stop_sequence_position];
                return seqa-seqb;
            });
            return list;

        },

        refresh_stop(){
           this.newrow=-1;
           this.stopTimes=[];
           this.toDeletRows=[];
           var stops=this.$store.getters.getRows("stop_times.txt","trip_id",this.form.tripID);
           stops=this.sortStops(stops);
           var temp=this.GTFSmap.get("stop_times.txt");
           temp=temp[0].split(',');
           var indexMap=new Map();
           for(var j in temp){
               indexMap.set(temp[j],j);
           }
           
           this.indexMap=indexMap;
           for(var i in stops){
              
               var p=stops[i][this.indexMap.get("pickup_type")];
               if(p==""||typeof(p) == "undefined"){p=1;}
               var d=stops[i][this.indexMap.get("drop_off_type")];
               if(d==""||typeof(d) == "undefined"){d=1;}
               var h=stops[i][this.indexMap.get("stop_headsign")];
               if(h==""||typeof(h) == "undefined"){h="";}


               this.stopTimes.push({
                row:stops[i][temp.length],
                stop_id:stops[i][this.indexMap.get("stop_id")],
                arrival_time:stops[i][this.indexMap.get("arrival_time")],
                departure_time:stops[i][this.indexMap.get("departure_time")],
                pickup_type:parseInt(p),
                drop_off_type:parseInt(d),
                stop_headsign:h,
                });
               
           }
       },
       onSubmit(){
            var theLastrow=this.GTFSmap.get("stop_times.txt").length;
            for(var i in this.stopTimes){
                var temp=this.stopTimes[i]; 
                if(temp.row<0){
                    temp.row=theLastrow;
                    theLastrow++;
                }
                this.$store.commit("setRows",["stop_times.txt",temp.row,"trip_id",this.form.tripID]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"stop_id",temp.stop_id]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"arrival_time",temp.arrival_time]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"departure_time",temp.departure_time]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"pickup_type",temp.pickup_type]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"drop_off_type",temp.drop_off_type]);
                this.$store.commit("setRows",["stop_times.txt",temp.row,"stop_headsign",temp.stop_headsign]); 
                this.$store.commit("setRows",["stop_times.txt",temp.row,"stop_sequence",i]); 
            }
            this.$store.commit('deleteRows',["stop_times.txt",this.toDeletRows]);
            this.$message('already saved');
            this.refresh_stop();
        }
    },
    mounted() {
        const table = document.querySelector('.el-table__body-wrapper tbody')
        const self = this
        Sortable.create(table, {
            onEnd:function(evt) {
                self.stopTimes[evt.oldIndex].arrival_time="";
                self.stopTimes[evt.oldIndex].departure_time="";
                const targetRow = self.stopTimes.splice(evt.oldIndex, 1)[0]
                self.stopTimes.splice(evt.newIndex, 0, targetRow)
            },
            handle:'.handle', 
            animation:150,
            direction:'vertical',
            
            cancel: ''

        })

    },
    watch:{

    }
}
</script>

<style>
hr {
    margin-top:7px;
    *margin: 0;
    border: 0;
    color: rgba(105, 138, 143, 0.74);
    background-color:rgba(103, 126, 129, 0.651);
    height: 3px
}

.handle {

  cursor: move;
}
</style>