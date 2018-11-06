<template>
        <div class="searchContainer">
            <!--<div style="background: #f0a">
                {{queryParam}}
            </div>-->

            <!--{{dataQuery}}-->
            <div class="elementsContainer">
              <span class="queryElement" :class="{hidden:queryItem.type=='hidden',switchElementContainer:queryItem.switchElements,tabContainer:queryItem.type=='tab',datetimerange:queryItem.type=='datetimerange',tipHtml:queryItem.type=='tipHtml'}" v-for="queryItem in queryElements" :key="queryItem.prop+'_query'+queryItem.label">
                    <span class="form-group form-inline " v-if="queryItem.type=='input'"  style="margin-top:10px;padding-right: 10px;">
                        <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                        <input type="text"   :placeholder="queryItem.placeholder" class="form-control queryParamInput" v-model="queryParam[queryItem.prop]"  @change="changeQueryParam(queryItem)" :input="changeQueryParam(queryItem)">
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='date'"  style="margin-top:10px;padding-right: 10px;">
                        <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                        <input type="text"    :placeholder="queryItem.placeholder"  :id="queryItem.id"
                               class="form-control" name="merchantName" v-model="queryParam[queryItem.prop]">
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='datetimerange'"  style="margin-top:10px;padding-right: 10px;">
                                    <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                                    <el-date-picker
                                            v-model="queryParam[queryItem.prop]"
                                            type="datetimerange"
                                            :picker-options="queryItem.options"
                                            :range-separator="queryItem.centerLabel||'至'"
                                            :placeholder="queryItem.placeholder||'请选择时间范围'"
                                            format="yyyy-MM-dd hh:mm:ss"
                                            align="right"></el-date-picker>
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='composite'"  style="margin-top:10px;padding-right: 10px;">
                        <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                        <span  v-for="component in queryItem.components" :key="component.prop+'_query'+queryItem.label">
                            <input type="text" class="form-control width170" v-model="queryParam[component.prop]" :placeholder="component.placeholder"
                                    :id="component.id" :maxelementid="component.maxelementid" :minelementid="component.minelementid"
                                   >
                                    <span v-if="$index==0">{{queryItem.link}}</span>
                         </span>
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='select'" :class="{switchContainer:queryItem.switchElements}" style="margin-top:10px;padding-right: 10px;">
                        <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                        <span v-if="!queryItem.dataUrl">
                          <select    class="form-control width170" v-model="queryParam[queryItem.prop]"   @change="changeQueryParam(queryItem)">
                              <option value="">{{queryItem.placeholder||'请选择'}}</option>
                              <option  v-for="component in queryItem.options" :value="component.value" :key="component.code+component.value+component.id+'_query'+component.label">{{component.label}}</option>
                          </select>
                        </span>
                        <span v-if="queryItem.dataUrl">
                          <select  class="form-control width170" v-model="queryParam[queryItem.prop]"   @change="changeQueryParam(queryItem)">
                              <option value="">{{queryItem.placeholder||'请选择'}}</option>
                              <option v-for="component in dataQuery.query[queryItem.propList]" :key="queryItem.prop+'_select_'+component.id" :value="component.code" :code="component.id">{{component.name}}</option>
                          </select>
                        </span>

                        <!--被开关元素控制的元素集合-->
                        <span v-if="queryItem.switchElements" :class="{switchElement:queryItem.switchElements}">
                            <span v-for="queryItemInner in queryItem.switchElements" :key="queryItemInner.prop+'_query'+queryItemInner.label">
                                <span >
                                    <span class="form-group form-inline " v-if="queryItemInner.type=='input'"  style="margin-top:10px;padding-right: 10px;">
                                        <span class="queryItemLabel" v-if="queryItemInner.label">{{queryItemInner.label}}</span>
                                        <input type="text"  :placeholder="queryItemInner.placeholder" class="form-control" name="merchantName" v-model="queryParam[queryItemInner.prop]"  @change="changeQueryParam(queryItemInner)">
                                    </span>
                                    <span class="form-group form-inline " v-if="queryItemInner.type=='date'"  style="margin-top:10px;padding-right: 10px;">
                                        <span class="queryItemLabel" v-if="queryItemInner.label">{{queryItemInner.label}}</span>
                                        <input type="text"    :placeholder="queryItemInner.placeholder"  :id="queryItemInner.id"  :maxelementid="queryItemInner.maxelementid" minelementid=""  @change="changeQueryParam(queryItemInner)"
                                               class="form-control" name="merchantName" v-model="queryParam[queryItemInner.prop]">
                                    </span>
                                    <span class="form-group form-inline " v-if="queryItemInner.type=='composite'"  style="margin-top:10px;padding-right: 10px;">
                                        <span class="queryItemLabel" v-if="queryItemInner.label">{{queryItemInner.label}}</span>
                                        <span  v-for="component in queryItemInner.components" :key="component.prop+'_query__'+component.label">
                                                <input type="text" class="form-control width170" v-model="queryParam[component.prop]" :placeholder="component.placeholder"  @change="changeQueryParam(queryItemInner)"
                                                        :id="component.id" :maxelementid="component.maxelementid" :minelementid="component.minelementid"
                                                         >
                                                        <span v-if="$index==0">{{queryItem.link}}</span>
                                            </span>
                                    </span>
                                    <span class="form-group form-inline " v-if="queryItemInner.type=='select'"  style="margin-top:10px;padding-right: 10px;">
                                        <span v-if="queryParam[queryItem.prop]==queryItemInner.whenSwitchValue">
                                            <span class="queryItemLabel" v-if="queryItemInner.label">{{queryItemInner.label}}</span>
                                            <span v-if="!queryItemInner.initQuery">
                                              <select  class="form-control width170" v-model="queryParam[queryItemInner.prop]" @change="changeQueryParam(queryItemInner)">
                                                  <option value="">{{queryItemInner.placeholder||'请选择'}}</option>
                                                  <option  v-for="component in dataQuery.query[queryItemInner.propList]" :value="component.id" :key="queryItem.code+queryItem.value+queryItem.id+'_query'+queryItem.label">{{component.name}}</option>
                                              </select>
                                            </span>
                                            <span v-if="queryItemInner.initQuery">
                                              自动查询
                                              <select class="form-control width170" v-model="queryParam[queryItemInner.prop]"  @change="changeQueryParam(queryItemInner)">
                                                  <option value="">{{queryItemInner.placeholder||'请选择'}}</option>
                                                  <option v-for="component in  queryItemInner.options" :value="component.value" :key="component.code+component.value+component.id+'_query'+component.label">{{component.key}}</option>
                                              </select>
                                            </span>
                                        </span>
                                    </span>
                                </span>
                            </span>
                        </span>
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='tab'"  style="margin-top:0px;background: rgba(252,252,252,0);width: 100%;margin-bottom: 0px;margin-left: 0px">
                        <span class="label_checkbox" style="transform: translateX(-10px);">
                            <ul class="mytableTest" style="display: inline-block;">
                                <li v-for="(component,labelIndex) in !(queryItem.dataUrl&&queryItem.initQuery)?queryItem.components:dataQuery.query[queryItem.propList]" :key="component.code+component.prop+component.id+'__query'+component.label">
                                    <input type="radio" :name="component.prop" :id="component.prop+'_'+labelIndex" :value="component.value||component.code"
                                           @click="queryBtnClick(queryParam,queryItem,component)"
                                           v-model="queryParam[queryItem.prop]">
                                    <label :for="component.prop+'_'+labelIndex" class="btn">{{component.label}}</label>
                                </li>
                            </ul>
                        </span>
                    </span>
                    <span class="form-group form-inline " v-if="queryItem.type=='tipHtml'"  style="margin-top:10px;padding-right: 10px;">
                            <div v-for="tip in queryItem.items" v-html="tip"></div>
                    </span>
              </span>
            </div>
            <div class="btnContainer">
              <span v-for="queryItem in queryButtons" :key="queryItem.prop+'_query'+queryItem.label"   @click="queryBtnClick(queryParam,queryItem)">
                  <span v-if="queryItem.type!='search'" :class="['btn','btn-default','el-button el-button--default',queryItem.type=='search'?'el-button el-button--info':'',queryItem.btnClass]">
                        {{queryItem.label}}
                  </span>
                  <el-button v-else="queryItem.type!='search'" type="primary" icon="search">搜索</el-button>
              </span>
            </div>
        </div>
</template>

<script>
    let tableListConfig=require("./TabListConfig");
    import backendService from '../remoteService/backendService'




    export default {
        name: "mytablequery",
        props:{
            //tableListConfig
        },
        data:function(){
            return {
                queryElements:[],
                dataQuery:{
                    query:{}
                },
                readonly:{},
                queryParam:{},
                queryButtons:[]
            }
        },
        methods:{
            pagerDataHelper:function(dataType, data) {
                var pagerData={};
                if (!data) {
                    pagerData[dataType + "List"] = [];
                    pagerData[dataType + "Pages"] = {
                        totalRows: 0,
                        totalPages: 0,
                        rowsPerPage: 0,
                        currentPage: 0
                    };
                    return;
                }
                pagerData[dataType + "List"] = data.dataPerPage;
                /*pagerData[dataType + "Pages"] = {
                    totalRows:data[this.tableListConfig.pager.totalRowsProp],
                    rowsPerPage: data[this.tableListConfig.pager.pageSizeProp],
                    currentPage: data[this.tableListConfig.pager.pageNumProp]
                };*/

                /*if(this.tableListConfig.colums!=null&&this.tableListConfig.colums.length>0){
                    return pagerData;
                }
                this.tableListConfig.defaultColums=null;
                dataTemplate=pagerData["dataList"][0];
                for(prop in dataTemplate){
                    columsType=null;
                    if(prop=="picUrl"){
                        columsType="image";
                    }else if(prop=="jumpParam"){
                        columsType="href";
                    }
                    if(!this.tableListConfig.defaultColums){
                        if(this.tableListConfig.defaultColumsHeaderMap){
                            if(this.tableListConfig.defaultColumsHeaderMap[prop]){
                                this.tableListConfig.defaultColums=[{label:this.tableListConfig.defaultColumsHeaderMap[prop],prop:prop,type:columsType}];
                            }
                        }else{
                            this.tableListConfig.defaultColums=[{label:prop,prop:prop,type:columsType}];
                        }
                    }else{
                        if(this.tableListConfig.defaultColumsHeaderMap){
                            if(this.tableListConfig.defaultColumsHeaderMap[prop]){
                                this.tableListConfig.defaultColums.push({label:this.tableListConfig.defaultColumsHeaderMap[prop],prop:prop,type:columsType});
                            }
                        }else{
                            this.tableListConfig.defaultColums.push({label:prop,prop:prop,type:columsType});
                        }
                    }
                }*/
                return pagerData;
            },
            batchChoose:function($event,param){
                for(key in this.tableData.data.dataList){
                    this.tableData.data.dataList[key].checked=$event.target.checked
                }
            },
            queryListData(params){
                return backendService.getData({
                    url:params.url,
                    method:params.method||"post",
                    data:params.queryParam
                }).then(function (result) {
                    return Promise.resolve(result)
                })
            },
            operateClick:function (data,operate) {
                operate['click']&&operate['click'](data)
            },
            changeQueryParam:function (data,operate) {
                this.changeHelp(data,operate);
            },
            changeHelp(prop){
                let that=this;
                if(prop.type=="select"){
                    let currentSwitchValue=this.queryParam[prop.prop];
                    if(prop.switchElements){
                        let needInitSelected=[].filter.call(prop.switchElements,(item)=>{if(item.whenSwitchValue==currentSwitchValue){ return true;}})[0];
                        //console.log("needInitSelected",needInitSelected)
                        if(needInitSelected){
                            let queryParam=needInitSelected.noNeedAllParams?{}:this.queryParam;
                            if(needInitSelected.otherParam){
                                queryParam=Object.assign(queryParam,needInitSelected.otherParam)
                            }
                            for(let key in needInitSelected.dropProps){
                                delete queryParam[needInitSelected.dropProps[key]];
                            }
                            console.log("item",item)

                            if(needInitSelected.watchParams){
                                Object.keys(needInitSelected.watchParams).forEach(key=>{
                                    queryParam[key]=that.readonly[key]||1;
                                })
                            }

                            let item=needInitSelected;
                            this.queryListData({url:item.dataUrl,queryParam:queryParam,method:item.httpMethod||"get"}).then((listData)=>{
                                if(!listData) return;
                                this.$set(this.dataQuery.query,item.propList,item.dataHandler?item.dataHandler(listData):listData[item.propValueList])
                                this.queryParam[item.prop]=item.defaultValue;
                            },(error)=>{
                                console.log(error);
                            });
                        }
                    }else if(prop.casecadeChild){
                        let queryParam=prop.noNeedAllParams?{}:this.queryParam;
                        if(prop.casecadeChild.otherParam){
                            queryParam=Object.assign(queryParam,prop.otherParam)
                        }
                        let casecadeChild=this.findCasecadeChild(prop.casecadeChild);
                        if(casecadeChild.extendsProp){
                            for(let seq in casecadeChild.extendsProp){
                                queryParam[casecadeChild.extendsProp[seq]]=currentSwitchValue;
                            }
                        }

                        console.log("item",casecadeChild)

                        if(casecadeChild.watchParams){
                            Object.keys(casecadeChild.watchParams).forEach(key=>{
                                queryParam[key]=that.readonly[key]||1;
                            })
                        }

                        //console.log("casecadeChild",casecadeChild,queryParam)
                        let item=casecadeChild;
                        this.queryListData({url:item.dataUrl,queryParam:queryParam,method:item.httpMethod||"get"}).then((listData)=>{
                            if(!listData) return;
                            this.$set(this.dataQuery.query,item.propList,item.dataHandler?item.dataHandler(listData):listData[item.propValueList])
                            this.queryParam[item.prop]=item.defaultValue;
                            //console.log("****",this.dataQuery.query)
                        },(error)=>{
                            console.log(error);
                        });
                    }
                }else if(prop.type="input"){

                }
            },
            findCasecadeChild(elementKey){
                let result={};
                for(let j=0;j<this.queryElements.length;j++){
                    let item=this.queryElements[j];
                    if(item.prop==elementKey){
                        result=item;
                        break;
                    }

                    if(item.switchElements){
                        for(let i=0;i<item.switchElements.length;i++){
                            let innerItem=item.switchElements[i];
                            if(innerItem.prop == elementKey){
                                result=innerItem;
                            }
                        }
                    }
                }
                return result;
            },
            restoreQueryParam(){
                let that=this;
                this.queryParam={};
                this.queryElements.forEach(item=>{
                    if(item.type=='button'||item.type=='search'){

                    }else{
                        //console.log(item.prop);
                        let defaultValue=item.default==undefined?"":item.default;
                        that.$set(that.queryParam,item.prop,defaultValue)
                        if(item.extendsProp){
                            item.extendsProp.forEach(extItem=>{
                                that.$set(that.queryParam,extItem,"99999999999999")
                            })
                        }
                        if(item.switchElements&& item.switchElements instanceof  Array){
                            item.switchElements.forEach(i=>{
                                let defaultValue=i.default==undefined?"":i.default;
                                that.$set(that.queryParam,i.prop,defaultValue)
                            })
                        }
                    }
                });
                this.initQueryElement();
            },
            initQueryElement(){
                let that=this;
                /*n 级 级联查询开始*/
                var queryParam=this.queryParam;
                if(this.queryElements==null||this.queryElements.length==0) return;
                var requestUrlParam= [].filter.call(this.queryElements, function (item) {
                    if(item.dataUrl&&item.initQuery){
                        return item;
                    }
                });

                for(let seq in requestUrlParam){
                    let item=requestUrlParam[seq];
                    if(item.casecadeParen==null||item.casecadeParen==""){
                        let submitParam=JSON.parse(JSON.stringify(that.queryParam));
                        if(submitParam.timeRange){
                            submitParam["startTime"]=that.queryParam.timeRange[0]
                            submitParam["endTime"]=that.queryParam.timeRange[1]
                        }

                        if(that.queryParam.deleteProps){
                            console.log(that.queryParam.deleteProps)
                            that.queryParam.deleteProps.forEach(item=>{
                                delete submitParam[item];
                            })
                            delete submitParam["deleteProps"];
                        }
                        if(item.watchParams){
                            Object.keys(item.watchParams).forEach(key=>{
                                submitParam[key]=that.readonly[key]||that.queryParam[key]||1;
                            })
                        }

                        if(item.otherParams){
                            Object.keys(item.otherParams).forEach(key=>{
                                submitParam[key]=item.otherParams[key]||'';
                            })
                        }

                        /*顶级元素优先查询完成一级数据初始化*/
                        this.queryListData({url:item.dataUrl,queryParam:submitParam,method:item.httpMethod||"get"}).then((listData)=>{
                            if(!listData) return;
                            this.$set(this.dataQuery.query,item.propList,item.dataHandler?item.dataHandler(listData):listData[item.propValueList])
                            this.queryParam[item.prop]=item.defaultValue;
                            //console.log("****",this.dataQuery.query)
                        },(error)=>{
                            console.log(error);
                        });
                    }
                }
                /*n 级 级联查询结束*/
                this.queryButtons=this.queryElements.filter(item=>{return item.type=='button'||item.type=='search'});
               /* setTimeout(data=>{
                    this.syncParam();
                },500)*/
            },
            syncParam(){
                this.$parent.$emit(this.$attrs.queryConfig.listenerId,this.queryParam)
            },
            queryBtnClick(params,btn){
                console.log("queryBtnClick",params,btn);
                if(btn.click&& typeof btn.click=="function"){
                    if(btn.check&& typeof btn.check=="function"){
                        let checkResult=btn.check(params,btn);
                        if(checkResult instanceof Promise){
                            checkResult.then(success=>{
                                btn.click(success.params,btn);
                            },error=>{
                                btn.errorTip&&typeof btn.errorTip === "function"&&btn.errorTip()
                                console.log("验证失败 不搜索!调用错误提示方法")
                                //btn.click(params,btn);
                            })
                        }else if(checkResult){
                            btn.click(checkResult.params,btn);
                        }else{
                            console.error("验证没有返回")
                        }
                    }else{
                        btn.click(params,btn);
                    }

                }else{
                    if(this.$attrs.clickConfig&& typeof this.$attrs.clickConfig=="function"){
                        if(btn.check&& typeof btn.check=="function"){
                            let checkResult=btn.check(params,btn);
                            if(checkResult instanceof Promise){
                                checkResult.then(success=>{
                                    this.$parent.$emit(this.$attrs.queryConfig.listenerId,success.params)
                                    this.$attrs.clickConfig(success.params,btn);
                                },error=>{
                                    if(btn.errorTip&&typeof btn.errorTip === "function"){
                                        btn.errorTip()
                                    }else{
                                        this.$message({type:'error',message:error.msg})
                                    }
                                    console.log("验证失败 不搜索!调用错误提示方法")
                                    //btn.click(params,btn);
                                })
                            }else if(checkResult){
                                console.log("checkResult***************",checkResult.params)
                                this.$parent.$emit(this.$attrs.queryConfig.listenerId,checkResult.params)
                                this.$attrs.clickConfig(checkResult.params,btn);
                            }else{
                                console.error("验证没有返回")
                            }
                        }else{
                            //this.$parent.$emit(this.$attrs.queryConfig.listenerId,params)
                            this.$attrs.clickConfig(params,btn)
                        }
                    }
                }
            }
        },
        mounted:function () {
            //console.log("mounted",this.$attrs)
        },
        created:function () {
            let that=this;
            let readonly=this.$attrs.readData||{};
            that.readonly=readonly;
            let queryConfig=this.$attrs.queryConfig;
            if(queryConfig&&queryConfig.watchProp){
                let watchProp="readonly."+queryConfig.watchProp;
                that.$watch(watchProp,function (newData,oldData) {
                    //console.log("tableQueryComponent newData",newData,"oldData",oldData)
                    that.dataQuery.query={};
                    that.restoreQueryParam();
                    that.$nextTick(function () {
                        that.$parent.fresh();
                    })
                })
            }

            this.queryElements=queryConfig.queryElements;
            this.queryElements.forEach(item=>{
                if(item.type=='button'||item.type=='search'){

                }else{
                    //console.log(item.prop);
                    let defaultValue=item.default==undefined?"":item.default;
                    that.$set(that.queryParam,item.prop,defaultValue)
                    if(item.switchElements&& item.switchElements instanceof  Array){
                        item.switchElements.forEach(i=>{
                            let defaultValue=i.default==undefined?"":i.default;
                            that.$set(that.queryParam,i.prop,defaultValue)
                        })
                    }
                }
            });
            that.syncParam();
            that.initQueryElement();
            that.$watch('queryParam',function (newValue,oldValue) {
                that.syncParam();
            },{deep:true})
        }
    }
</script>

<style scoped>
    input ,select,.queryParamInput{
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        background-color: #fff;
        background-image: none;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        color: #1f2d3d;
        font-size: inherit;
        height: 36px;
        line-height: 1;
        outline: 0;
        padding: 3px 10px;
        transition: border-color .2s cubic-bezier(.645,.045,.355,1);
        margin-bottom: 15px;
        width: 220px;
    }

    label.btn,.btn,.el-button {
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        cursor: pointer;
        /*border: 1px solid #c4c4c4;*/
        /*color: #fff;*/
        margin: 0;
        padding: 10px 15px;
        border-radius: 4px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    label.btn{
        margin-right: 0px;
        background: #48576a;
        border: 1px solid #fff;
        color: #fff;
    }

    .btnContainer{
        padding: 10px;
        width: 220px;
        flex-shrink: 0;
        flex-grow: 0;
    }
    .searchContainer{
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        background: rgba(0,0,0,.04);
        padding: 10px;
    }
    .elementsContainer{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        flex-grow: 1;
        flex-shrink: 1;
    }
    .queryElement{
        display: inline-block;
        width: 50%;
        flex-grow: 0;
        flex-shrink: 0;
    }
    .queryElement  span[flagkey="hidden"],.hidden{
        display: none!important;
        background: #f00;
    }
    .switchElementContainer{
        width: 100%!important;
    }
    .tabContainer{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
    }
    .tabContainer ul{
         width: 100%;
         display: flex;
         flex-direction: row;
         justify-content: flex-start;
         align-items: flex-start;
         transform: translateY(11px);
     }
    .tabContainer ul li{
        display: inline-block;
        padding: 0px;
        margin: 0px;
        border-radius: 0px;
    }
    .tabContainer ul li label{
         display: inline-block;
         padding: 10px 35px;
         border-radius: 0px;
         margin-bottom: 0px;
        border-left: none;
     }
    .tabContainer ul li:nth-child(1) label{
        display: inline-block;
        padding: 10px 35px;
        border-left:1px solid #c4c4c4;
    }
    .tabContainer > span{
        display: inline-block;
        width: 100%;
    }
    .tabContainer input{
        display: none;
    }
    .tabContainer .label_checkbox{
        display: inline-block;
        width: 100%;
    }
    .tabContainer .form-inline{
        width: 100%;
    }
    .label_checkbox input:checked+label{
        background: #97a8be!important;
        color: #fff;
        border-radius: 0px!important;
        border-top-left-radius: 6px!important;
        border-top-right-radius: 6px!important;
    }
    .datetimerange,.tipHtml{
        width: 100%;
        display: inline-block;
    }
    .tabContainer ul li label{
        border-radius: 0px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
    }
    .queryItemLabel{
        display: inline-block;
        min-width: 100px;
        text-align: right;
    }
</style>