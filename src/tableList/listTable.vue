<template>
  <div class="list">
    <query-param :queryConfig="queryConfig" :readData="readonly" :clickConfig="clickConfig" ref="queryParam"></query-param>
    <my-table :tableListConfig="tableListConfig" :readData="readonly" ref="tableList"></my-table>
  </div>
</template>
<script>
  import tableListComponent from './tableListComponent'
  import tableQueryParamComponent from './tableQueryParamComponent'

  let listenerId="listenerId"+Math.ceil(Math.random()*10000);

  export default {
      name: 'listTable',
      components:{
          'my-table':tableListComponent,
          'query-param':tableQueryParamComponent
      },
      data(){
          return{
              readonly:{},
              tableListConfig:{listenerId:listenerId,watchProp:''},
              queryConfig:{listenerId:listenerId},
              queryParam:{},
          }
      },
      methods:{
          clickHandler(param){
              //console.log("clickHandler",param)
              let config=that.$attrs.config;
              if(config.clickHandler&& typeof config.clickHandler == "function"){
                  config.clickHandler(param)
              }
          },
          pagerDataHelper(param){
              //console.log("pagerDataHelper********",param);
              let config=that.$attrs.config;
              if(config.pagerDataHelper&& typeof config.pagerDataHelper == "function"){
                  return config.pagerDataHelper(param);
              }
              param.content.map(item=>{return item;})
              return param;
          },
          clickConfig(param,btn){
              let that=this;
              let config=this.$attrs.config;
              if(config.clickHandler&& typeof config.clickHandler == "function"){
                  config.clickHandler(param,btn);
              }
              if(btn.type=="search"||btn.type=="tab"){
                  that.$nextTick(function () {
                      if(config.tableListConfig.beforeQuery&& typeof config.tableListConfig.beforeQuery == "function"){
                          console.log("******search*****9999900000",param)
                          let result=config.tableListConfig.beforeQuery(param,btn);
                          if(result instanceof Promise){
                              result.then(success=>{
                                  this.$nextTick(function () {
                                      this.$refs.tableList.queryListByPager(1);
                                  })

                              },error=>{
                                  that.$message({
                                      content:error.msg,
                                      type:"error"
                                  })
                              })
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
              this.$refs.tableList.queryListByPager(1);
          }
      },
      created(){
          let that = this;
          let config=that.$attrs.config;
          let readonly=this.$attrs.readData||{};
          that.readonly=readonly;
          that.$watch("readonly",function (newData,oldData) {
              //console.log("listTable newData,oldData",newData,oldData)
          },{
              deep:true
          })
          that.tableListConfig=Object.assign(that.tableListConfig,config.tableListConfig);
          if(this.tableListConfig&&this.tableListConfig.watchProp){
              let watchProp="readonly."+this.tableListConfig.watchProp;
              that.$watch(watchProp,function (newData,oldData) {
                  that.tableListConfig=Object.assign(that.tableListConfig,config.tableListConfig);
              })
          }
          that.queryConfig=Object.assign(that.queryConfig,config.queryConfig);
          that.$on("readonlyDataChanged",function (newValue) {
              that.readonly=newValue;
          })
          that.$on(this.tableListConfig.listenerId,function (newValue) {
              that.queryParam=newValue;
          })
      },
      computed:{

      },
      mounted(){

      }
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
