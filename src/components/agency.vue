<template>
    <div>

        <el-form ref="form" :model="form" label-width="130px">

            <el-form-item label="Agency ID">
                <el-input v-model="form.agency_id"></el-input>
            </el-form-item>

            <el-form-item label="Agency Name">
                <el-input v-model="form.agency_name"></el-input>
            </el-form-item>

            <el-form-item label="Website">
                <el-input v-model="form.agency_url"></el-input>
            </el-form-item>

            <el-form-item label="Time Zone">
                <el-select v-model="form.agency_timezone" placeholder="-"  filterable>
                    <el-option
                    v-for="item in timezones"
                    :key="item"
                    :value="item"
                    :label="item">
                    </el-option>
                </el-select>
            </el-form-item>
     
            <el-collapse >
                <el-collapse-item title="Optional Fields (open/close)" name="1">
                    <template slot="title">
                        <span style="float:left;font-weight:bold;font-size:16px;color:rgba(33, 130, 160, 0.774);"> Optional Fields (open/close)</span>
                    </template>
                    <el-form-item label="Language">
                        <el-select v-model="form.agency_lang" placeholder="-" filterable>
                            <el-option
                            v-for="item in languages"
                            :key="getCode(item)"
                            :value="getCode(item)"
                            :label="item">
                            </el-option>
                        </el-select>
                    </el-form-item>

                    <el-form-item label="Email">
                        <el-input v-model="form.agency_email"></el-input>
                    </el-form-item>
                    <el-form-item label="Phone">
                        <el-input v-model="form.agency_phone"></el-input>
                    </el-form-item>
                    <el-form-item label="Fare URL">
                        <el-input v-model="form.agency_fare_url"></el-input>
                    </el-form-item>
                </el-collapse-item>
            </el-collapse> 
        </el-form>
        
        <br>
        <div align="right">
            <el-button type="success" round  @click="OnSubmit">Submit</el-button>
        </div>
    </div>

</template>

<script>
import ISO6391 from 'iso-639-1';
import {mapState,mapMutations,mapActions,mapGetters} from 'vuex'
export default {
    data(){
        return{
            form:{
                agency_id:"",
                agency_name:"",
                agency_url:"",
                agency_timezone:"",
                agency_lang:"",
                agency_email:"",
                agency_phone:"",
                agency_fare_url:"",
            },
            old_agency_id:"",
        }
    },
    computed:{
        languages(){
            return ISO6391.getAllNames();
        },
        timezones(){
            return ['Europe/Andorra',
                        'Asia/Dubai',
                        'Asia/Kabul',
                        'Europe/Tirane',
                        'Asia/Yerevan',
                        'Antarctica/Casey',
                        'Antarctica/Davis',
                        'Antarctica/DumontDUrville',
                        'Antarctica/Mawson',
                        'Antarctica/Palmer',
                        'Antarctica/Rothera',
                        'Antarctica/Syowa',
                        'Antarctica/Troll',
                        'Antarctica/Vostok',
                        'America/Argentina/Buenos_Aires',
                        'America/Argentina/Cordoba',
                        'America/Argentina/Salta',
                        'America/Argentina/Jujuy',
                        'America/Argentina/Tucuman',
                        'America/Argentina/Catamarca',
                        'America/Argentina/La_Rioja',
                        'America/Argentina/San_Juan',
                        'America/Argentina/Mendoza',
                        'America/Argentina/San_Luis',
                        'America/Argentina/Rio_Gallegos',
                        'America/Argentina/Ushuaia',
                        'Pacific/Pago_Pago',
                        'Europe/Vienna',
                        'Australia/Lord_Howe',
                        'Antarctica/Macquarie',
                        'Australia/Hobart',
                        'Australia/Currie',
                        'Australia/Melbourne',
                        'Australia/Sydney',
                        'Australia/Broken_Hill',
                        'Australia/Brisbane',
                        'Australia/Lindeman',
                        'Australia/Adelaide',
                        'Australia/Darwin',
                        'Australia/Perth',
                        'Australia/Eucla',
                        'Asia/Baku',
                        'America/Barbados',
                        'Asia/Dhaka',
                        'Europe/Brussels',
                        'Europe/Sofia',
                        'Atlantic/Bermuda',
                        'Asia/Brunei',
                        'America/La_Paz',
                        'America/Noronha',
                        'America/Belem',
                        'America/Fortaleza',
                        'America/Recife',
                        'America/Araguaina',
                        'America/Maceio',
                        'America/Bahia',
                        'America/Sao_Paulo',
                        'America/Campo_Grande',
                        'America/Cuiaba',
                        'America/Santarem',
                        'America/Porto_Velho',
                        'America/Boa_Vista',
                        'America/Manaus',
                        'America/Eirunepe',
                        'America/Rio_Branco',
                        'America/Nassau',
                        'Asia/Thimphu',
                        'Europe/Minsk',
                        'America/Belize',
                        'America/St_Johns',
                        'America/Halifax',
                        'America/Glace_Bay',
                        'America/Moncton',
                        'America/Goose_Bay',
                        'America/Blanc-Sablon',
                        'America/Toronto',
                        'America/Nipigon',
                        'America/Thunder_Bay',
                        'America/Iqaluit',
                        'America/Pangnirtung',
                        'America/Atikokan',
                        'America/Winnipeg',
                        'America/Rainy_River',
                        'America/Resolute',
                        'America/Rankin_Inlet',
                        'America/Regina',
                        'America/Swift_Current',
                        'America/Edmonton',
                        'America/Cambridge_Bay',
                        'America/Yellowknife',
                        'America/Inuvik',
                        'America/Creston',
                        'America/Dawson_Creek',
                        'America/Fort_Nelson',
                        'America/Vancouver',
                        'America/Whitehorse',
                        'America/Dawson',
                        'Indian/Cocos',
                        'Europe/Zurich',
                        'Africa/Abidjan',
                        'Pacific/Rarotonga',
                        'America/Santiago',
                        'America/Punta_Arenas',
                        'Pacific/Easter',
                        'Asia/Shanghai',
                        'Asia/Urumqi',
                        'America/Bogota',
                        'America/Costa_Rica',
                        'America/Havana',
                        'Atlantic/Cape_Verde',
                        'America/Curacao',
                        'Indian/Christmas',
                        'Asia/Nicosia',
                        'Asia/Famagusta',
                        'Europe/Prague',
                        'Europe/Berlin',
                        'Europe/Copenhagen',
                        'America/Santo_Domingo',
                        'Africa/Algiers',
                        'America/Guayaquil',
                        'Pacific/Galapagos',
                        'Europe/Tallinn',
                        'Africa/Cairo',
                        'Africa/El_Aaiun',
                        'Europe/Madrid',
                        'Africa/Ceuta',
                        'Atlantic/Canary',
                        'Europe/Helsinki',
                        'Pacific/Fiji',
                        'Atlantic/Stanley',
                        'Pacific/Chuuk',
                        'Pacific/Pohnpei',
                        'Pacific/Kosrae',
                        'Atlantic/Faroe',
                        'Europe/Paris',
                        'Europe/London',
                        'Asia/Tbilisi',
                        'America/Cayenne',
                        'Africa/Accra',
                        'Europe/Gibraltar',
                        'America/Godthab',
                        'America/Danmarkshavn',
                        'America/Scoresbysund',
                        'America/Thule',
                        'Europe/Athens',
                        'Atlantic/South_Georgia',
                        'America/Guatemala',
                        'Pacific/Guam',
                        'Africa/Bissau',
                        'America/Guyana',
                        'Asia/Hong_Kong',
                        'America/Tegucigalpa',
                        'America/Port-au-Prince',
                        'Europe/Budapest',
                        'Asia/Jakarta',
                        'Asia/Pontianak',
                        'Asia/Makassar',
                        'Asia/Jayapura',
                        'Europe/Dublin',
                        'Asia/Jerusalem',
                        'Asia/Kolkata',
                        'Indian/Chagos',
                        'Asia/Baghdad',
                        'Asia/Tehran',
                        'Atlantic/Reykjavik',
                        'Europe/Rome',
                        'America/Jamaica',
                        'Asia/Amman',
                        'Asia/Tokyo',
                        'Africa/Nairobi',
                        'Asia/Bishkek',
                        'Pacific/Tarawa',
                        'Pacific/Enderbury',
                        'Pacific/Kiritimati',
                        'Asia/Pyongyang',
                        'Asia/Seoul',
                        'Asia/Almaty',
                        'Asia/Qyzylorda',
                        'Asia/Qostanay', 
                        'Asia/Aqtobe',
                        'Asia/Aqtau',
                        'Asia/Atyrau',
                        'Asia/Oral',
                        'Asia/Beirut',
                        'Asia/Colombo',
                        'Africa/Monrovia',
                        'Europe/Vilnius',
                        'Europe/Luxembourg',
                        'Europe/Riga',
                        'Africa/agencyoli',
                        'Africa/Casablanca',
                        'Europe/Monaco',
                        'Europe/Chisinau',
                        'Pacific/Majuro',
                        'Pacific/Kwajalein',
                        'Asia/Yangon',
                        'Asia/Ulaanbaatar',
                        'Asia/Hovd',
                        'Asia/Choibalsan',
                        'Asia/Macau',
                        'America/Martinique',
                        'Europe/Malta',
                        'Indian/Mauritius',
                        'Indian/Maldives',
                        'America/Mexico_City',
                        'America/Cancun',
                        'America/Merida',
                        'America/Monterrey',
                        'America/Matamoros',
                        'America/Mazatlan',
                        'America/Chihuahua',
                        'America/Ojinaga',
                        'America/Hermosillo',
                        'America/Tijuana',
                        'America/Bahia_Banderas',
                        'Asia/Kuala_Lumpur',
                        'Asia/Kuching',
                        'Africa/Maputo',
                        'Africa/Windhoek',
                        'Pacific/Noumea',
                        'Pacific/Norfolk',
                        'Africa/Lagos',
                        'America/Managua',
                        'Europe/Amsterdam',
                        'Europe/Oslo',
                        'Asia/Kathmandu',
                        'Pacific/Nauru',
                        'Pacific/Niue',
                        'Pacific/Auckland',
                        'Pacific/Chatham',
                        'America/Panama',
                        'America/Lima',
                        'Pacific/Tahiti',
                        'Pacific/Marquesas',
                        'Pacific/Gambier',
                        'Pacific/Port_Moresby',
                        'Pacific/Bougainville',
                        'Asia/Manila',
                        'Asia/Karachi',
                        'Europe/Warsaw',
                        'America/Miquelon',
                        'Pacific/Pitcairn',
                        'America/Puerto_Rico',
                        'Asia/Gaza',
                        'Asia/Hebron',
                        'Europe/Lisbon',
                        'Atlantic/Madeira',
                        'Atlantic/Azores',
                        'Pacific/Palau',
                        'America/Asuncion',
                        'Asia/Qatar',
                        'Indian/Reunion',
                        'Europe/Bucharest',
                        'Europe/Belgrade',
                        'Europe/Kaliningrad',
                        'Europe/Moscow',
                        'Europe/Simferopol',
                        'Europe/Kirov',
                        'Europe/Astrakhan',
                        'Europe/Volgograd',
                        'Europe/Saratov',
                        'Europe/Ulyanovsk',
                        'Europe/Samara',
                        'Asia/Yekaterinburg',
                        'Asia/Omsk',
                        'Asia/Novosibirsk',
                        'Asia/Barnaul',
                        'Asia/Tomsk',
                        'Asia/Novokuznetsk',
                        'Asia/Krasnoyarsk',
                        'Asia/Irkutsk',
                        'Asia/Chita',
                        'Asia/Yakutsk',
                        'Asia/Khandyga',
                        'Asia/Vladivostok',
                        'Asia/Ust-Nera',
                        'Asia/Magadan',
                        'Asia/Sakhalin',
                        'Asia/Srednekolymsk',
                        'Asia/Kamchatka',
                        'Asia/Anadyr',
                        'Asia/Riyadh',
                        'Pacific/Guadalcanal',
                        'Indian/Mahe',
                        'Africa/Khartoum',
                        'Europe/Stockholm',
                        'Asia/Singapore',
                        'America/Paramaribo',
                        'Africa/Juba',
                        'Africa/Sao_Tome',
                        'America/El_Salvador',
                        'Asia/Damascus',
                        'America/Grand_Turk',
                        'Africa/Ndjamena',
                        'Indian/Kerguelen',
                        'Asia/Bangkok',
                        'Asia/Dushanbe',
                        'Pacific/Fakaofo',
                        'Asia/Dili',
                        'Asia/Ashgabat',
                        'Africa/Tunis',
                        'Pacific/Tongatapu',
                        'Europe/Istanbul',
                        'America/Port_of_Spain',
                        'Pacific/Funafuti',
                        'Asia/Taipei',
                        'Europe/Kiev',
                        'Europe/Uzhgorod',
                        'Europe/Zaporozhye',
                        'Pacific/Wake',
                        'America/New_York',
                        'America/Detroit',
                        'America/Kentucky/Louisville',
                        'America/Kentucky/Monticello',
                        'America/Indiana/Indianapolis',
                        'America/Indiana/Vincennes',
                        'America/Indiana/Winamac',
                        'America/Indiana/Marengo',
                        'America/Indiana/Petersburg',
                        'America/Indiana/Vevay',
                        'America/Chicago',
                        'America/Indiana/Tell_City',
                        'America/Indiana/Knox',
                        'America/Menominee',
                        'America/North_Dakota/Center',
                        'America/North_Dakota/New_Salem',
                        'America/North_Dakota/Beulah',
                        'America/Denver',
                        'America/Boise',
                        'America/Phoenix',
                        'America/Los_Angeles',
                        'America/Anchorage',
                        'America/Juneau',
                        'America/Sitka',
                        'America/Metlakatla',
                        'America/Yakutat',
                        'America/Nome',
                        'America/Adak',
                        'Pacific/Honolulu',
                        'America/Montevideo',
                        'Asia/Samarkand',
                        'Asia/Tashkent',
                        'America/Caracas',
                        'Asia/Ho_Chi_Minh',
                        'Pacific/Efate',
                        'Pacific/Wallis',
                        'Pacific/Apia',
                        'Africa/Johannesburg'
                        ];
        }
    },
    methods:{
        getCode(item){
            return ISO6391.getCode(item);
        },
        refresh(){
            this.form.agency_id=this.$store.getters.getallAttribut("agency.txt","agency_id").pop();
            this.old_agency_id=this.form.agency_id;
            this.form.agency_name=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_name",this.form.agency_name);   
            this.form.agency_url=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_url",this.form.agency_url);   
            this.form.agency_timezone=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_timezone",this.form.agency_timezone);   
            this.form.agency_lang=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_lang",this.form.agency_lang);   
            this.form.agency_email=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_email",this.form.agency_email);       
            this.form.agency_phone=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_phone",this.form.agency_phone);
            this.form.agency_fare_url=this.$store.getters.getAttributeValue("agency.txt","agency_id",this.form.agency_id,"agency_fare_url",this.form.agency_fare_url);   
        },
        OnSubmit(){
            if(this.old_agency_id!=this.form.agency_id){
                this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.old_agency_id,"agency_id",this.form.agency_id]);
            }
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_name",this.form.agency_name]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_url",this.form.agency_url]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_timezone",this.form.agency_timezone]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_lang",this.form.agency_lang]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_email",this.form.agency_email]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_phone",this.form.agency_phone]);
            this.$store.commit('setAttributeValue',["agency.txt","agency_id",this.form.agency_id,"agency_fare_url",this.form.agency_fare_url]);
            this.refresh();
        },
     
        

    },

}
</script>

<style>
.el-collapse-item__arrow{
	float : left;
	margin-left:5px;
	margin-right:15px;
}

.el-collapse-item__header {
	border-bottom: 2px solid rgba(29, 97, 170, 0.219);
}

.el-collapse-item__wrap{
	border-bottom:0px;
}


</style>