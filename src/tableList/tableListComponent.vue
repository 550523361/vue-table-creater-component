<template>
    <div>
        <!--<div style="background: #00a;color:#fff;">
            {{queryParam}}
        </div>-->
        <el-table
                :data="tableDataSource.content"
                border
                tooltip-effect="dark"
                :stripe="tableListConfig.stripe||true"
                @selection-change="chooseAllClick"
                @header-click="headerClick"
                :row-class-name="tableRowClassName"
                :header-row-class-name="headerRowClassName"
                style="width: 100%">
            <el-table-column type="selection" v-if="tableListConfig.selection">

            </el-table-column>
            <el-table-column v-for="column in tableListConfig.colums"
                             :key="column.prop"
                    :width="column.width?(column.width=='auto'?'':column.width):80"
                    :prop="column.prop"
                    v-if="column.viewHandler?column.viewHandler(column,$parent.queryParam,$parent.readonly):true"
                    :label="column.label">
                    <template slot-scope="scope">
                                <span    v-if="column.type==null||column.type==''" @click="column['click']&&column['click'](scope.row)">{{column["columnHandler"]?column.columnHandler(scope.row[column.prop]):scope.row[column.prop]}}</span>
                                <input   v-if="column.type=='input'"        @keyup.enter="column['enter']&&column['enter']($event,scope.row,column)" @blur="column['blur']&&column['blur']($event,scope.row,column)" style="line-height: 30px;width: 100%;" v-model="scope.row[column.prop]"  @change="column['change']&&column['change']($event,scope.row,column)" />
                                <input   v-if="column.type=='checkbox'"     @click="column['click']&&column['click']($event,scope.row)"   @change="column['change']&&column['change']($event,scope.row)" v-model="scope.row.checked"  type="checkbox"/>
                                <a        v-if="column.type=='href'"           :href="scope.row[column.prop]" target="_blank" style="cursor: pointer;color: blue;" title="点击看看">{{scope.row[column.prop]}}</a>
                                <input   v-if="column.type=='sortOrder'"     type="number"  v-model="scope.row[column.prop]" @change="column['change']&&column['change']($event,scope.row)"  style="max-width: 40px;" alt=""/>
                                <label   v-if="column.type=='diy'"            @click="column['click']&&column['click']($event,scope.row)">{{column.diy&&column.diy(scope.row)}}</label>
                                <span    v-if="column.type=='image'||column.type=='img'" >
                                    <img           v-for="img in (scope.row[column.prop]+''||'').split(',')" :src="img" v-if="img" style="max-width: 80px;vertical-align: middle;margin: 5px;" alt=""/>
                                </span>
                    </template>
            </el-table-column>
            <el-table-column fixed="right" :width="tableListConfig.operator.width?(tableListConfig.operator.width=='auto'?'':tableListConfig.operator.width):80"  v-if="tableListConfig.operator.column&&tableListConfig.operator.column.length>0" label="操作" :render-header="tableListConfig.operator.renderHeader">
                   <template slot-scope="scope">
                       <div class="operateBtnContainer">
                           <label
                                   :for="'checkbox_'+scope.row.id+operate.prop"
                                   :style="scope.row[operate.prop+'Check']?operate.checkedStyle:operate.style"
                                   v-if="operate.map&&operate.map[scope.row[operate.prop]]||operate.map==null"
                                   v-for="(operate,operatIndex) in tableListConfig.operator.column"
                                   :key="operate.prop+'_'+operate.label+operatIndex+'_'+'_labelKey_'+(scope.row.id||scope.row.code)"
                                   :class="[{'operateBtn':true}]"
                                    @click="operate.type!='checkbox'?operateClick(scope.row,operate):''">
                                    <input type="checkbox" v-if="operate.type=='checkbox'" style="display: none;" :id="'checkbox_'+scope.row.id+operate.prop" v-model="scope.row[operate.prop+'Check']" @click="operate.type=='checkbox'?operateClick(scope.row,operate):''"/>
                                        {{(!scope.row[operate.prop+'Check'])?operate.label:(operate.cancleLabel||'取消')}}{{operate.map&&operate.map[scope.row[operate.prop]]}}
                           </label>
                       </div>
                   </template>
            </el-table-column>
        </el-table>
        <div class="block">
            <el-pagination v-if="tableDataSource.total"
                    layout="prev, pager, next"
                    :total="tableDataSource.total"
                    :page-size="tableDataSource.size"
                    :current-page="tableDataSource.number"
                    @current-change="queryListByPager">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import backendService from '../remoteService/backendService'

    export default {
        name: "mytable",
        props:{
        },
        data:function(){
            return {
                rowData:{},
                queryParam:{pageNum:1,pageSize:15},
                operator:{},
                tableListConfig:{colums:["id","name"],watchProp:''},
                hasCheckBox:[],
                tableDataSource:{
                    dataList:[]
                },
                readonly:{},
            }
        },
        methods:{
            batchChoose:function($event,param){
                for(key in this.tableData.data.dataList){
                    this.tableData.data.dataList[key].checked=$event.target.checked
                }
            },
            queryListByPager(pageNum){
                let that = this;
                let arrtsConfig=this.$attrs;
                that.queryParam.pageNum=pageNum;

                let baseParam={
                    pageNum:that.queryParam.pageNum,
                    pageSize:that.queryParam.pageSize,
                }

                let submitParam=JSON.parse(JSON.stringify(that.$parent.queryParam));
                    submitParam.pageSize=(arrtsConfig.tableListConfig.pager.pageSize||that.queryParam.pageSize);

                if(submitParam.timeRange){
                    submitParam["startTime"]=that.$parent.queryParam.timeRange[0]
                    submitParam["endTime"]=that.$parent.queryParam.timeRange[1]
                }

                if(that.$parent.queryParam.deleteProps){
                    //console.log(that.queryParam.deleteProps)
                    that.$parent.queryParam.deleteProps.forEach(item=>{
                        delete submitParam[item];
                    })
                    delete submitParam["deleteProps"];
                }

                baseParam=Object.assign(baseParam,submitParam);
                backendService.getData({
                    url:arrtsConfig.tableListConfig.url,
                    method:arrtsConfig.tableListConfig.method||"post",
                    data:baseParam
                }).then(function (result) {
                    if(!result){
                        that.$message({
                            message: "服务器错误!",
                            type: 'error'
                        });
                        return;
                    }
                    if(result.code=="1"){
                        if(typeof arrtsConfig.tableListConfig.pagerDataHelper =="function"){
                            let dealResult=arrtsConfig.tableListConfig.pagerDataHelper(result.data);
                            if(dealResult instanceof Promise){
                                dealResult.then(success=>{
                                    that.afterRequest(success.data)
                                    that.tableDataSource=success.data
                                },error=>{
                                    console.log("失败!!!!!!!",error)
                                })
                            }else{
                                that.afterRequest(dealResult)
                                that.tableDataSource=dealResult;
                            }
                        }else{
                            that.afterRequest(result.data)
                            that.tableDataSource=result.data;
                        }
                    }
                })
            },
            afterRequest(data){
                if(!data||!data.content) return;
                if(!data.content instanceof Array){
                    return;
                }
                let that=this;
                if(that.hasCheckBox.length){
                    data.content.map(item=>{
                        that.hasCheckBox.forEach(checkBoxOperatorItem=>{
                            item[checkBoxOperatorItem.prop+"Check"]=item[checkBoxOperatorItem.prop+"Check"]?item[checkBoxOperatorItem.prop+"Check"]:false;
                        })
                        return item;
                    })
                }
                return data;
            },
            chooseAllClick:function (data,operate) {
                //console.log(data,operate);
                if(this.tableListConfig.chooseAllClick&&typeof this.tableListConfig.chooseAllClick ==="function" ){
                    this.tableListConfig.chooseAllClick(data)
                }
            },
            operateClick:function (data,operate) {
                //console.log(data,operate);
                let that=this;//content.filter(item=>item[operate.prop+'Check'])
                this.$nextTick(function () {
                    let result=operate['click']&&operate['click'](data,operate,this.tableDataSource.content.filter(item=>item[operate.prop+'Check']));
                    if(result){
                        console.log("operateClick",result);
                        if(result instanceof Promise){
                            result.then(success=>{
                                that.queryListByPager();
                            },error=>{

                            })
                        }
                    }
                })

            },
            headerClick:function (column,param) {
                console.log("headerClick",column,param);
                //column.label=column.label=='取消'?'全选':'取消';
                column.checkedStyle={
                        width:'100%',
                        display:'inline-block',
                        height:'100%',
                        textAlign:'center',
                        backgroundColor:'rgba('+Math.ceil(Math.random()*255)+','+Math.ceil(Math.random()*255)+','+Math.ceil(Math.random()*255)+',1)',
                        color:'#fff'
                    };
                if(this.tableListConfig.headerClick&&typeof this.tableListConfig.headerClick == "function"){
                    this.tableListConfig.headerClick(column,param,this.tableDataSource)
                }
            },
            renderHeader(h,params){
                //console.log("renderHeaderh  ",h,params)
                return h('span',{
                    classs:[params.column.checkedStyle||''],
                    style:params.column.checkedStyle||{
                        backgroundColor:'#f00',
                        width:'100%',
                        display:'inline-block',
                         height:'100%',
                        textAlign:'center',
                        color:'#fff'
                    },
                    attrs:{
                        type:'checkbox',
                        checked:true
                    }
                },params.column.label);
                return h('input',{
                    classs:{'A':true,"B":true},
                    style:{
                        backgroundColor:'#f00',
                        //width:'100%',
                        display:'inline-block',
                       // height:'100%',
                        textAlign:'center',
                        color:'#fff'
                    },
                    attrs:{
                            type:'checkbox',
                            checked:true
                        }
                    },params.column.label)
            },
            tableRowClassName({row, rowIndex}){
                //console.log("row, rowIndex",row, rowIndex)
                /*if (rowIndex === 0) {
                    return 'warning-row';
                } else if (rowIndex === 3) {
                    return 'success-row';
                }*/
                return '';
            },
            headerRowClassName({row, rowIndex}){
                    return "defaultHeader";
            }
        },
        mounted:function () {
            let that=this;

        },
        created:function () {
            let that=this;
            this.tableListConfig=this.$attrs.tableListConfig;
            let readonly=this.$attrs.readData||{};
            that.readonly=readonly;
            if(!this.tableListConfig.url) return;
            if(this.tableListConfig.operator&&this.tableListConfig.operator.column){
                this.hasCheckBox=this.tableListConfig.operator.column.filter(item=>item.type=='checkbox');
            }
            /*if(this.tableListConfig&&this.tableListConfig.watchProp){
                let watchProp="readonly."+this.tableListConfig.watchProp;
                that.$watch(watchProp,function (newData,oldData) {
                    console.log("&&&&&&&&&&&&&***************",newData,"oldData",oldData,this.tableListConfig.operator.column[1])
                })
            }*/
            that.queryListByPager()
        }
    }
</script>

<style scoped>
    .operateBtnContainer{
        display: flex;
        width: 100%;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
    }
    .operateBtnContainer > label{

    }
    .checkedClass{
        background: #ff00ff!important;
        color: #000!important;
    }
    .el-table .warning-row {
        background: oldlace!important;
    }

    .el-table .success-row {
        background: #f0f9eb;
    }
    .defaultHeader  th, .defaultHeader tr{
        background: #eef1f6;
    }
</style>