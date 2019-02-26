<template>
    <div class="searchContainer" :style="{marginBottom:tabItem.prop=='null'?'10px':'78px'}">
        <div class="elementsContainer">
              <span class="queryElement" :style="queryItem.style||{}" :class="{hidden:queryItem.type=='hidden',switchElementContainer:queryItem.switchElements,tabContainer1:queryItem.type=='tab',datetimerange:queryItem.type=='datetimerange',tipHtml:queryItem.type=='tipHtml'}" v-for="(queryItem,paramIndex) in $attrs.queryConfig.queryElements" :key="paramIndex+'_'+queryItem.prop+'_query'+queryItem.label">
                    <template v-if="queryItem.type=='input'">
                        <span class="form-group form-inline "   style="margin-top:10px;padding-right: 10px;">
                            <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                            <input type="text"   :placeholder="queryItem.placeholder" class="form-control queryParamInput" v-model="queryParam[queryItem.prop]"  @change="changeQueryParam(queryItem)" :input="changeQueryParam(queryItem)"/>
                            <span v-if="queryItem.rightBtn" @click="queryBtnClick(queryParam,queryItem.rightBtn)" class="rightBtnStyle" :style="queryItem.rightBtn.style">
                                {{queryItem.rightBtn.label||'搜索'}}
                            </span>
                        </span>
                    </template>
                    <template v-if="queryItem.type=='date'">
                        <span class="form-group form-inline "   style="margin-top:10px;padding-right: 10px;">
                            <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                            <input type="text"    :placeholder="queryItem.placeholder"  :id="queryItem.id"
                                   class="form-control" name="merchantName" v-model="queryParam[queryItem.prop]">
                        </span>
                    </template>
                    <template v-if="queryItem.type=='datetimerange'">
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
                    </template>
                    <template v-if="queryItem.type=='composite'">
                        <span class="form-group form-inline "   style="margin-top:10px;padding-right: 10px;">
                            <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                            <span  v-for="component in queryItem.components" :key="component.prop+'_query'+queryItem.label+'_'+paramIndex">
                                <input type="text" class="form-control width170" v-model="queryParam[component.prop]" :placeholder="component.placeholder"
                                       :id="component.id" :maxelementid="component.maxelementid" :minelementid="component.minelementid"
                                >
                                        <span v-if="$index==0">{{queryItem.link}}</span>
                             </span>
                        </span>
                    </template>
                    <template v-if="queryItem.type=='select'">
                        <span class="form-group form-inline " :class="{switchContainer:queryItem.switchElements}" style="margin-top:10px;padding-right: 10px;">
                                <span class="queryItemLabel" v-if="queryItem.label">{{queryItem.label}}</span>
                                <span v-if="!queryItem.dataUrl">
                                  <el-select    class="form-control width170" v-model="queryParam[queryItem.prop]" filterable  @change="changeQueryParam(queryItem)">
                                      <el-option value="">{{queryItem.placeholder||'请选择'}}</el-option>
                                      <el-option  v-for="component in queryItem.options" :value="component.value||component.code" :key="component.code+component.value+component.id+'_query'+component.label" :label="component.label||component.name">{{component.label||component.name}}</el-option>
                                  </el-select>
                                </span>
                                <span v-if="queryItem.dataUrl">
                                  <el-select  class="form-control width170" v-model="queryParam[queryItem.prop]" filterable  @change="changeQueryParam(queryItem)">
                                      <el-option value="">{{queryItem.placeholder||'请选择'}}</el-option>
                                      <el-option v-for="component in dataQuery.query[queryItem.propList]" :key="queryItem.prop+'_select_'+component.id+'_value_'+component.value+'_code_'+component.code" :value="component.code||component.id||component.value" :code="component.id||component.code||component.value" :label="component.label||component.name||component.desc">{{component.name||component.label||component.desc}}</el-option>
                                  </el-select>
                                </span>

                            <!--被开关元素控制的元素集合-->
                                <span v-if="queryItem.switchElements" :class="{switchElement:queryItem.switchElements}">
                                    <span v-for="queryItemInner in queryItem.switchElements" :key="queryItemInner.prop+'_query'+queryItemInner.label+'_'+paramIndex">
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
                                                <span  v-for="component in queryItemInner.components" :key="component.prop+'_query__'+component.label+'_'+paramIndex">
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
                                                      <select  class="form-control width170" filterable v-model="queryParam[queryItemInner.prop]" @change="changeQueryParam(queryItemInner)">
                                                          <option value="">{{queryItemInner.placeholder||'请选择'}}</option>
                                                          <option  v-for="component in dataQuery.query[queryItemInner.propList]" :value="component.id" :key="queryItem.code+queryItem.value+queryItem.id+'_query'+queryItem.label">{{component.name}}</option>
                                                      </select>
                                                    </span>
                                                    <span v-if="queryItemInner.initQuery">
                                                      自动查询
                                                      <select class="form-control width170" v-model="queryParam[queryItemInner.prop]" filterable  @change="changeQueryParam(queryItemInner)">
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
                    </template>

                    <template v-if="queryItem.type=='tipHtml'">
                        <span class="form-group form-inline "  style="margin-top:10px;padding-right: 10px;">
                                <div v-for="tip in queryItem.items" v-html="tip"></div>
                        </span>
                    </template>
              </span>
            <span v-for="(queryItem,paramIndex) in queryButtons" :style="queryItem.style||{}" v-bind:hidden="queryItem.hidden" :key="queryItem.prop+'_query'+queryItem.label+'_'+paramIndex"   @click="queryBtnClick(queryParam,queryItem)">
                  <template v-if="queryItem.viewHandler">
                      <template v-if="!queryItem.html">
                          <span v-if="queryItem.type!='search'" :class="['btn','btn-default','el-button el-button--default',queryItem.type=='search'?'el-button el-button--info':'',queryItem.btnClass]">
                                {{queryItem.viewHandler(queryItem,$route.params,queryParam)}}
                          </span>
                      </template>
                      <template v-else="!queryItem.html">
                          <span v-if="queryItem.type!='search'" v-html="queryItem.viewHandler(queryItem,$route.params,queryParam)"></span>
                      </template>
                  </template>
                  <template v-else="queryItem.viewHandler">
                      <span v-if="queryItem.type!='search'" :class="['btn','btn-default','el-button el-button--default',queryItem.type=='search'?'el-button el-button--info':'',queryItem.btnClass]">
                            {{queryItem.label}}
                      </span>
                      <el-button v-else="queryItem.type=='search'" type="primary" icon="search">搜索</el-button>
                  </template>
              </span>
            <span class="tabContainer" v-if="tabItem.prop!='null'">
                        <span class="form-group form-inline "   style="margin-top:0px;background: rgba(252,252,252,0);width: 100%;margin-bottom: 0px;margin-left: 0px">
                            <span class="label_checkbox" style="transform: translateX(-10px);">
                                <ul class="mytableTest" style="display: inline-block;border-bottom:1px solid #333">
                                    <li v-for="(component,labelIndex) in !(tabItem.dataUrl&&tabItem.initQuery)?tabItem.components:dataQuery.query[tabItem.propList]" :key="component.code+component.prop+component.id+'__query'+component.label">
                                        <input type="radio" :name="component.prop" :id="component.prop+'_'+labelIndex" :value="component.value||component.code"
                                               @change="queryBtnClick(queryParam,tabItem,component)"
                                               v-model="queryParam[tabItem.prop]">
                                        <label :for="component.prop+'_'+labelIndex" class="btn">{{component.label||component.desc||component.name}}</label>
                                    </li>
                                </ul>
                            </span>
                        </span>
                </span>
        </div>
    </div>
</template>

<script>
    import backendService from '../remoteService/backendService'

    export default {
        name: "mytablequery",
        props:{
        },
        data:function(){
            return {
                queryElements:[],
                dataQuery:{
                    query:{}
                },
                readonly:{},
                queryParam:{},
                queryButtons:[],
                initState:{},
                queryConfig:{
                    queryElements:[]
                },
                tabItem:{prop:'null'},
            }
        },
        methods:{
            queryListData(params){
                let that=this;
                that.$set(that.initState,"initUrl_"+params.url+"_initParam_","1");
                let requestParam=JSON.parse(JSON.stringify(params.queryParam))||{};
                delete requestParam["timeRange"];
                return backendService.getData({
                    url:params.url,
                    method:params.method||"post",
                    data:requestParam
                }).then(function (result) {

                    that.$set(that.initState,"initUrl_"+params.url+"_initParam_","");
                    //console.log("****init****queryParam",params.url,that.initState);
                    return Promise.resolve(result)
                })
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
                                    queryParam[key]=that.readonly[key]||queryParam[key]||'';
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
                                queryParam[key]=that.readonly[key]||queryParam[key]||'';
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
                }else if(prop.type=="input"){

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
                let tabItem={prop:'null'};

                this.queryElements.forEach((item,index)=>{
                    if(item.type=='button'||item.type=='search'){

                    }else{
                        if(item.type=='tab'){
                            console.log("tab--->>>>>item,index",item,index);
                            that.tabItem=item;
                            tabItem=item;
                        }
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

                if(tabItem.prop=="null"){
                    that.tabItem=tabItem;
                    that.tabItem=JSON.parse(JSON.stringify(that.tabItem));
                }

                this.initQueryElement();
            },
            initQueryElement(){
                let that=this;
                /*n 级 级联查询开始*/
                if(this.queryElements==null||this.queryElements.length==0) return;
                var requestUrlParam= [].filter.call(this.queryElements, function (item) {
                    if(item.dataUrl&&item.initQuery){
                        return item;
                    }else{
                        //console.log("item------=>",item)
                        if(!(item.type=='search'||item.type=='button'||item.prop=='deleteProps')){
                            that.$set(that.queryParam,item.prop,item.defaultValue||item.value)
                        }
                    }
                });

                for(let seq in requestUrlParam){
                    let item=requestUrlParam[seq];
                    if(item.casecadeParen==null||item.casecadeParen==""||item.includeInit==true){
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
                                submitParam[key]=that.readonly[key]||that.queryParam[key]||'';
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
            },
            reInitQueryElement(){
                let that=this;
                /*n 级 级联查询开始*/
                if(this.queryElements==null||this.queryElements.length==0) return;

                /*找出关联的下拉选项 重新拉去数据 排除自己*/
                var requestUrlParam= [].filter.call(this.queryElements, function (item) {
                    if(item.dataUrl&&item.initQuery&&item.type!='tab'){
                        return item;
                    }
                });

                for(let seq in requestUrlParam){
                    let item=requestUrlParam[seq];
                    /*级联的顶级元素或者非顶级元素需要强制初始化的元素*/
                    if(item.casecadeParen==null||item.casecadeParen==""||item.includeInit==true){
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
                                submitParam[key]=that.readonly[key]||that.queryParam[key]||'';
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
            },
            syncParam(){
                this.$parent.syncQueryParam(this.queryParam);
            },
            queryBtnClick(params,btn){
                let that=this;
                console.log("queryBtnClick",params,btn);
                if(!params.timeRange){
                    params.timeRange=['',''];
                }

                if(btn.type=='tab'&&btn.needReinit){
                    //this.initQueryElement();
                    this.$nextTick(data=>{
                        console.log("queryBtnClick",params,btn);
                        this.reInitQueryElement();
                    })
                }

                if(btn.click&& typeof btn.click=="function"){
                    if(btn.check&& typeof btn.check=="function"){
                        let checkResult=btn.check(params,btn,this.dataQuery.query);
                        if(checkResult instanceof Promise){
                            checkResult.then(success=>{
                                btn.click(success.params,btn);
                            },error=>{
                                btn.errorTip&&typeof btn.errorTip === "function"&&btn.errorTip()
                                console.log("验证失败 不搜索!调用错误提示方法")
                                //btn.click(params,btn);
                            })
                        }else if(checkResult){
                            //console.log("checkResult",checkResult)
                            btn.click(checkResult.params,btn,this.dataQuery.query);
                        }else{
                            console.error("验证没有返回,请返回 {params:参数对象} 或 Promise对象")
                            that.$message({
                                type:'error',
                                message:"验证没有返回 不请求 请查看控制台帮助.."
                            })
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
                                    this.$attrs.clickConfig(success.params,btn,that.queryParam);
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
                                this.$attrs.clickConfig(checkResult.params,btn,that.queryParam);
                            }else{
                                console.error("验证没有返回,请返回 {params:参数对象} 或 Promise对象")
                                that.$message({
                                    type:'error',
                                    message:"验证没有返回 不请求 请查看控制台帮助.."
                                })
                            }
                        }else{
                            //this.$parent.$emit(this.$attrs.queryConfig.listenerId,params,btn)
                            this.$attrs.clickConfig(params,btn,that.queryParam)
                        }
                    }
                }
            },
            initPage(){
                let that=this;

                that.$watch("initState",function (newData,oldData){
                    if(Object.values(newData).filter(item=>item!="").length==0){
                        console.log(" **** init ready",newData,oldData)
                    }
                },{
                    deep:true
                })

                let readonly=this.$attrs.readData||{};
                that.readonly=readonly;
                let queryConfig=this.$attrs.queryConfig;
                this.queryConfig=Object.assign(that.queryConfig,queryConfig);
                if(queryConfig&&queryConfig.watchProp){
                    let watchProp="readonly."+queryConfig.watchProp;
                    that.$watch(watchProp,function (newData,oldData) {
                        //console.log("tableQueryComponent newData",newData,"oldData",oldData)
                        that.dataQuery.query={};
                        that.restoreQueryParam();
                        that.$nextTick(function () {
                            that.$parent.fresh();
                        })
                    },{
                        deep:true
                    })
                }

                this.queryElements=Object.assign(this.queryElements,queryConfig.queryElements);

                let tabItem={prop:'null'};

                this.queryElements.forEach((item,index)=>{
                    if(item.type=='button'||item.type=='search'){

                    }else{
                        if(item.type=='tab'){
                            //console.log("tab--->>>>>item,index",item,index);
                            that.tabItem=item;
                            tabItem=item;
                        }
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

                if(tabItem.prop=="null"){
                    that.tabItem=tabItem;
                    that.tabItem=JSON.parse(JSON.stringify(that.tabItem));
                }

                // console.log(" this.queryElements", this.queryElements)
                that.syncParam();
                that.initQueryElement();
                that.$watch('queryParam',function (newValue,oldValue) {
                    that.syncParam();
                },{deep:true})

                that.$watch('queryElements',function (newValue,oldValue) {
                    that.queryElements=newValue;
                    that.initQueryElement();
                },{deep:true})


                that.$watch('$attrs.queryConfig',function (newValue,oldValue) {
                    that.queryConfig=newValue;
                    that.queryElements=newValue.queryElements;
                    //console.log(">>>>>>>>>>queryConfig>>>>>",newValue)
                    that.$nextTick(function () {
                        that.dataQuery.query={};
                        that.restoreQueryParam();
                        //that.$parent.fresh();
                    })
                },{deep:true})
            }
        },
        mounted:function () {
            //console.log("mounted",this.$attrs)
        },
        created:function () {
            this.initPage();
        },
        watch:{
            '$route'(to,from){
                //console.log("this.$route.params",this.$route.params)
                //this.initPage();
            }
        },
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

        width: 220px;
    }

    input ,select,.queryParamInput,.el-select,.datetimerange{
        margin-bottom: 15px;
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
        margin-bottom: 15px;
        margin-right: 10px;
    }
    label.btn{
        margin-right: 0px;
        border: 0px solid #fff;
        color: #48576a;
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
        background: rgba(0,0,0,.00);
        padding: 10px;
        margin-bottom: 10px;
    }
    .elementsContainer{
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: row;
        flex-wrap: wrap;
        flex-grow: 1;
        flex-shrink: 1;
        position: relative;
    }
    .queryElement{
        display: inline-block;
        flex-grow: 0;
        flex-shrink: 0;
        width: auto;
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
        position: absolute;
        bottom: 0px;
        transform: translateY(52px);
    }
    .tabContainer ul{
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: flex-start;
        transform: translateY(21px);
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
        border-left: 1px solid #1f2d3d;
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
        background: #ffffff!important;
        color: #20a0ff;
        border-radius: 0px!important;
        border-top-left-radius: 5px!important;
        border-top-right-radius: 5px!important;
        border: 1px solid #1f2d3d;
        border-bottom: 1px solid #fff;
        transform: translateY(1px);
    }
    .datetimerange,.tipHtml{
        /* width: 100%;*/
        display: inline-block;
    }
    .tabContainer ul li label{
        border-radius: 0px;
        border-top-left-radius: 6px;
        border-top-right-radius: 6px;
        border-right: 1px solid #1f2d3d;
        border-top: 1px solid #1f2d3d;
        transform: translateY(1px);
    }
    .queryItemLabel{
        display: inline-block;
        min-width: 100px;
        text-align: right;
    }

    .rightBtnStyle{
        background: #00a0e9;display: inline-block;padding: 5px 10px;color: #fff;cursor: pointer;border-radius: 5px;
    }
</style>