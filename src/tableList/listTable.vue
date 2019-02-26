<template>
  <div class="list">
    <slot name="beforeQuery"></slot>
    <query-param :queryConfig="queryConfig" :readData="readonly" :clickConfig="clickConfig" ref="queryParam"></query-param>
    <slot name="beforeTable"></slot>
    <my-table :tableListConfig="tableListConfig" :readData="readonly" ref="tableList"></my-table>
    <slot name="afterTable"></slot>
  </div>
</template>
<script>
    import tableListComponent from './tableListComponent'
    import tableQueryParamComponent from './tableQueryParamComponent'
    import Vue from 'vue'

    let listenerId="listenerId"+Math.ceil(Math.random()*10000);

    Vue.component('async-element', function (resolve, reject) {
        resolve({
            template: `<div style=''>
                            <div style="padding: 5px 10px;color: #0056aa;font-weight: bolder;font-size: 14px;">
                                 {{$attrs.config.rowData.name}}
                            </div>
                            <div style="padding-left: 40px;padding-top: 10px;padding-bottom: 10px;">
                                <label style="padding: 3px 10px;margin-right: 10px;margin-bottom: 10px;cursor: pointer;"  :key="item.id+'_'+index" v-for="(item,index) in $attrs.config.rowData.tagList">
                                  <input v-model="item.checked" :id="'tag'+item.id" type="checkbox" @click="$attrs.config.column.click(item,$attrs.config.rowData,$event)"><span style="padding-left: 5px;">{{item.name}}</span>
                                </label>
                            </div>

                        </div>`
        })
    })


    export default {
        name: 'listTable',
        components:{
            'my-table':tableListComponent,
            'query-param':tableQueryParamComponent
        },
        data(){
            return{
                readonly:{},
                tableListConfig:{listenerId:listenerId,watchProp:'',colums:[],operator:{width:200,colums:[]},url:'',splitTables:1,showHeader:true,stripe:true},
                queryConfig:{listenerId:listenerId,queryElements:[]},
                queryParam:{queryElements:[]},
            }
        },
        methods:{
            clickHandler(param,...params){
                //console.log("clickHandler",param)
                let config=that.$attrs.config;
                if(config.clickHandler&& typeof config.clickHandler == "function"){
                    config.clickHandler(param,...params)
                }
            },
            pagerDataHelper(param,...params){
                //console.log("pagerDataHelper********",param);
                let config=that.$attrs.config;
                if(config.pagerDataHelper&& typeof config.pagerDataHelper == "function"){
                    return config.pagerDataHelper(param,...params);
                }
                param.content.map(item=>{return item;})
                return param;
            },
            clickConfig(param,btn,...params){
                let that=this;
                let config=this.$attrs.config;
                if(config.clickHandler&& typeof config.clickHandler == "function"){
                    config.clickHandler(param,btn,...params);
                }
                if(btn.type=="search"||btn.type=="tab"){
                    that.$nextTick(function () {
                        if(config.tableListConfig.beforeQuery&& typeof config.tableListConfig.beforeQuery == "function"){
                            //console.log("******search*****9999900000",param)
                            let result=config.tableListConfig.beforeQuery(param,btn,...params);
                            if(result instanceof Promise){
                                result.then(success=>{
                                    this.$nextTick(function () {
                                        this.$refs.tableList.queryListByPager(1);
                                    })

                                },error=>{
                                    that.$message({
                                        message:error.msg,
                                        type:"error"
                                    })
                                })
                            }else{
                                if(result){
                                    if(result.code==1){
                                        this.$nextTick(function () {
                                            this.$refs.tableList.queryListByPager(1);
                                        })
                                    }else{
                                        console.log("result",result)
                                        that.$message({
                                            message:result.msg||'检查不通过但是没有返回错误信息',
                                            type:"error"
                                        })
                                    }
                                }else{
                                    /*检查没有阻止 继续请求*/
                                    this.$nextTick(function () {
                                        this.$refs.tableList.queryListByPager(1);
                                    })
                                }
                            }
                        }else{
                            this.$refs.tableList.queryListByPager(1);
                        }
                    })
                }
            },
            syncData(){
                this.$refs.queryParam.syncParam();
            },
            fresh(){
                this.$nextTick(function () {
                    this.$refs.tableList.queryListByPager(1);
                })

            },
            syncQueryParam(data){
                this.queryParam=data;
            }
        },
        created(){
            let that = this;
            let config=that.$attrs.config;
            let readonly=this.$attrs.readData||{};
            that.readonly=readonly;
            /*that.$watch("readonly",function (newData,oldData) {
                //console.log("listTable newData,oldData",newData,oldData)
            },{
                deep:true
            })*/
            that.tableListConfig=Object.assign(that.tableListConfig,config.tableListConfig);
            if(this.tableListConfig&&this.tableListConfig.watchProp){
                let watchProp="readonly."+this.tableListConfig.watchProp;
                that.$watch(watchProp,function (newData,oldData) {
                    that.tableListConfig=Object.assign(that.tableListConfig,that.$attrs.config.tableListConfig);
                    that.readonly=Object.assign(that.readonly,that.$attrs.config.readonly);
                })
            }
            that.queryConfig=Object.assign(that.queryConfig,config.queryConfig);
            that.$on("readonlyDataChanged",function (newValue) {
                that.readonly=newValue;
            })
            this.$watch("$attrs.config",function (newData,oldData) {
                that.tableListConfig=Object.assign(that.tableListConfig,newData.tableListConfig);
                that.readonly=Object.assign(that.readonly,that.$attrs.config.readonly);
                that.queryConfig.queryElements=newData.queryConfig.queryElements;
            },{
                deep:true
            })
        },
    }
</script>

<style>
  .myBtn{
    background: #333 !important;
    text-align: center;
    color: #fff!important;
    cursor: pointer;
  }
</style>
