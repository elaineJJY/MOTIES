<template>
    <div>
        <el-table
            :data="frequencies"
            style="width:100%"
            height="500px"
            row-key="row"
            ref="table"
            >
            
    
            
            <el-table-column prop="start_time" label="Start time" placeholder="00:00" width="200">
                <template slot-scope="scope">
                    <el-input v-model="frequencies[scope.$index].start_time"></el-input>
                </template>
            </el-table-column>

                <el-table-column prop="end_time" label="End time" placeholder="00:00" width="200">
                <template slot-scope="scope">
                    <el-input v-model="frequencies[scope.$index].end_time"></el-input>
                </template>
            </el-table-column>

            <el-table-column prop="headway_secs" label="Headway(secs)" width="300">
                <template slot-scope="scope">
                    <el-input v-model="frequencies[scope.$index].headway_secs"></el-input>   
                </template>
            </el-table-column>

            <el-table-column prop="exact_times" label="Exact times" width="200">
                <template slot-scope="scope">
                    <el-select 
                            v-model="frequencies[scope.$index].exact_times">
                                <el-option
                                v-for="(item, index) in exact_times_list"
                                :key="index"
                                :value="index"
                                :label="item">
                                {{item}}
                                </el-option>
                    </el-select> 
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
            <el-form  :model="newFrequency" label-position="top" label-width="80px">
                <el-row  :gutter="5">
                    <el-col :span="4">
                        <el-form-item label="Start time" >
                             <el-input v-model="newFrequency.start_time"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="4">
                        <el-form-item label="End time" >
                            <el-input v-model="newFrequency.end_time"></el-input>
                        </el-form-item>
                    </el-col>

                    <el-col :span="3">
                        <el-form-item label="Headway(secs)" >
                             <el-input v-model="newFrequency.headway_secs"></el-input>   
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="4">
                        <el-form-item label="Exact times" >
                            <el-select 
                                v-model="newFrequency.exact_times">
                                <el-option
                                v-for="(item, index) in exact_times_list"
                                :key="index"
                                :value="index"
                                :label="item">
                                {{item}}
                                </el-option>
                            </el-select> 
                        </el-form-item>
                    </el-col>
                    
                    <el-col :span="1" :offset="2" >
                        <el-button type="danger" plain @click="addnewFrequency">Add</el-button>
                    </el-col>
                </el-row>
            </el-form>
            <br>
            <el-row>
                <el-col :span="2" :offset="22">
                    <el-button type="success" round @click="onSubmit">Submit</el-button>
                </el-col>
            </el-row>
            
    </div>
</template>

<script>
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
    export default {
        props:['tripform'],
        data(){
            return{
                form:this.tripform,
                frequencies: [],
                indexmap:[],
                newrow:-1,
                exact_times_list:["Frequency-based","Schedule-based"],
                newFrequency: {
                    row:"",
                    start_time:"",
                    end_time:"",
                    headway_secs:"",
                    exact_times:0,},
            }
        },
        computed:{
        ...mapState(['GTFSmap','filenames','saved','trip_id_list','route_id_list','service_list']), //improt share variable from store
        },
        methods:{
            deleteRow(index){
                var row=this.frequencies[index].row;
                if(row<0){
                    return;
                }
                this.toDeletRows.push(row);          
                this.frequencies.splice(index,1);
            },

            //check whether the format is correct and add it to the table
            addnewFrequency(){
                this.newFrequency.row=this.newrow;
                this.newrow--;
                this.frequencies.push(this.newFrequency);
                this.newFrequency={
                    row:"",
                    start_time:"",
                    end_time:"",
                    headway_secs:"",
                    exact_times:0,
                };
            },
        

            refresh(){
                this.newrow=-1;
                this.frequencies=[];
                this.toDeletRows=[];
                var rows=this.$store.getters.getRows("frequencies.txt","trip_id",this.form.tripID);
                
                var temp=this.GTFSmap.get("frequencies.txt");
                temp=temp[0].split(',');
                var indexMap=new Map();
                for(var j in temp){
                    indexMap.set(temp[j],j);
                }
                
                this.indexMap=indexMap;
                for(var i in rows){
                    var et=rows[i][this.indexMap.get("exact_times")];
                    if(et==""||typeof(et) == "undefined"){et=0;}
                
                    this.frequencies.push({
                        row:rows[i][temp.length],
                        start_time:rows[i][this.indexMap.get("start_time")],
                        end_time:rows[i][this.indexMap.get("end_time")],
                        headway_secs:rows[i][this.indexMap.get("headway_secs")],
                        exact_times:parseInt(et),
                    });
                    
                }
                
            },

            onSubmit(){
                
                var theLastrow=this.GTFSmap.get("frequencies.txt").length;
                for(var i in this.frequencies){
                    var temp=this.frequencies[i]; 
                    if(temp.row<0){
                        temp.row=theLastrow;
                        theLastrow++;
                    }
                    this.$store.commit("setRows",["frequencies.txt",temp.row,"trip_id",this.form.tripID]);
                    this.$store.commit("setRows",["frequencies.txt",temp.row,"start_time",temp.start_time]);
                    this.$store.commit("setRows",["frequencies.txt",temp.row,"end_time",temp.end_time]);
                    this.$store.commit("setRows",["frequencies.txt",temp.row,"headway_secs",temp.headway_secs]);
                    this.$store.commit("setRows",["frequencies.txt",temp.row,"exact_times",temp.exact_times]);
                }
                this.$store.commit('deleteRows',["frequencies.txt",this.toDeletRows]);
                this.$message('already saved');
                this.refresh();
            }



        }
    }
</script>

<style lang="scss" scoped>

</style>