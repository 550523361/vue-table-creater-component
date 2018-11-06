/**
 * Created by xkfeng on 2017/7/11.
 */

import backendService from "./../remoteService/backendService";

/**
 * 复杂校验 完成 非空、字符(长度，maxlength,minlength)、数字(大小，位数 如 12.31  maxvalue,minvalue)、mobile、email、url、remote(异步远程校验。。可以携带参数)
 * 异步校验会发生在最后
 * @param value 表单元素值
 *  *
 * 一个完整的配置说明
 *  rulues:{
 *      required:true,
 *      mobile:true,//手机号码
 *      number:"##.###",//数字校验 占位符 整数位不大于2位 小数位最多3位 如99.999 9.99 9.9 9 0.9
 *      email:true,//邮箱
 *      url:true,//网址
 *      maxlength:19,//最大长度19个字符
 *      minlength:4,//最小长度4个字符
 *      maxvalue:11.12, //最大值为11.12 大一点都不行
 *      minvalue:11.11, //最小值为11.11 小一点都不行
 *      remote:true,//需要远程校验 服务参通过另外一个参数配置
 *
 *  }
 *
 * @param rulues //校验规则
 *
 *
 * param={
 *      remoteValidateRequiredParam:{
 *              provinceId:"",//自动取当前表单对应属性值用于请求参数
 *              id:"",//取当前表单的id域值作为查询参数
 *              name:"",//取当前表单name域值作为查询参数
 *
 *      },//依赖属性 用于请求时候携带的相干参数  比如 需要店铺全省不同名 此时需要依赖 provinceId id name 三个属性
 *      alias:{
 *                  provinceCode:"provinceId" //将参数参数名称 provinceCode以provinceId 名称查询 给查询参数取别名
 *              },//查询参数别名
 *      form:{},//当前表单引用 用于依赖请求校验或冲突校验
 *
 * }
 *
 *
 * @param param 异步校验参数配置 如商品名称全商家不重名，此时商户id可以配置上就可以自动携带作为查询条件

 * @param remoteService 远程异步校验服务地址配置对象 {httpMethod:"post",url:"wwww.baidu.com"}
 * @returns {{}} 返回验证结果 Promise实例(异步校验)
 */
function baseValidate(value,rulues,param,remoteService){
    let error={};
    let promise=null;
         value=value||"";

    for(let key in rulues){
        ////console.log("prop",param.prop,"keykeykey",key)
        let ruleValue=rulues[key];
        if(key=="required"&&value==""&&ruleValue){
            error[key]="不能为空";
            break;
        }else if(key=="maxlength"&&value.length>ruleValue){
            error[key]="不能超过"+ruleValue+"字符";
            break;
        }else if(key=="password"&&value.length>ruleValue){
            let passwordReg=/(?=.*\d)(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9]).{8,30}/;
            if(passwordReg.test(value)){
                error[key]="密码中必须包含字母、数字、特称字符，至少8个字符，最多30个字符。";
                break;
            }
        }else if(key=="minlength"&&value.length<ruleValue){
            error[key]="不能少于"+ruleValue+"字符";
            break;
        }else if(key=="number"&&value!=""){
            value+="";
            let numberCheckResult=/^\d+(\.\d+)?$/.test(value);
            //console.log("numberCheckResult",numberCheckResult)
            if(!numberCheckResult){
                error[key]="请输入数字！";
                break;
            }
            //console.log("ruleValue",ruleValue)
            let pattenStr=ruleValue;
            let splitArr=pattenStr.split(".");
            let aboveZero=null;
            let bellowZero="";
            if(splitArr.length==2){
                aboveZero=pattenStr.split(".")[0];
                bellowZero=pattenStr.split(".")[1];
            }else if(splitArr.length==1){
                aboveZero=pattenStr.split(".")[0];
            }
            let valueArr=value.split(".");
            let valueAboveZero=null;
            let valueBellowZero="";
            if(valueArr.length==2){
                valueAboveZero=value.split(".")[0];
                valueBellowZero=value.split(".")[1];
            }else if(valueArr.length==1){
                valueAboveZero=value.split(".")[0];
            }

            if(/^0\d+/.test(valueAboveZero)){
                error[key]="请输入合法数字,整数不能以两个0开头";
            }else if(valueAboveZero.length>aboveZero.length){
                error[key]="请输入合法数字,只允许"+aboveZero.length+"位整数";
            }else if(valueBellowZero.length>bellowZero.length){
                error[key]="请输入合法数字,只允许"+bellowZero.length+"位小数";
                if(bellowZero.length==0){
                    error[key]="请输入整数";
                }
            }else if(valueBellowZero.length==0&&valueArr.length==2){
                error[key]="请输入合法数字,小数位不能为空！";
            }
            if(rulues["maxvalue"]||rulues["minvalue"]){

            }else{
                break;
            }
        }else if(key=="email"&&!/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/.test(value)){
            error[key]="请输入合法邮箱！";
            break;
        }else if(key=="url"&&!/(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/.test(value)){
            error[key]="请输入合法地址";
            break;
        }else if(key=="mobile"&&!/^\d{11}$/.test(value)){
            error[key]="请输入11位手机号码！";
            break;
        }else if(key=="maxvalue"&&value*1>ruleValue*1){
            error[key]="不能大于"+ruleValue;
            break;
        }else if(key=="minvalue"&&value*1<ruleValue*1){
            error[key]="不能小于"+ruleValue;
            break;
        }else if(key=="gt"){
            let targetValue=param[ruleValue]?param[ruleValue]*1:0;
            if(targetValue>=value*1){
                error[key]="不能小于"+targetValue;
                break;
            }
        }else if(key=="lt"){
            let targetValue=param[ruleValue]?param[ruleValue]*1:0;
            if(targetValue<=value*1){
                error[key]="不能大于"+targetValue;
                break;
            }
        }else if(key=="eq"){
            let targetValue=param[ruleValue];
            if(targetValue!=value){
                error[key]="值不相等同";
                break;
            }
        }else if(key=="checkboxRequired"){
            let grandfather=param["grandfather"];
            let formGroup=param["formGroup"];
            if(!formGroup){
                continue;
            }
            let grandfatherControl=formGroup.get(grandfather);
            let lazyTimerId=setTimeout(function () {
                let checkedNum=grandfatherControl.controls.filter((optionControl)=>{
                    return optionControl.value.checked;
                }).length;
                if(checkedNum==0){
                    grandfatherControl.setErrors({"required":"至少得选择一个吧！"});
                }
                clearTimeout(lazyTimerId);
            },10);
        }else if(key=="arrayUploadRequired"){
            error= {};
            let grandfather=param["grandfather"]+"LinkValidate";
            let formGroup=param["formGroup"];
            if(!formGroup){
                continue;
            }
            let grandfatherControl=formGroup.get(grandfather);
            //console.log("grandfatherControl",grandfatherControl)
            if(prop.parent){
                let lazyTimerId=setTimeout(function () {
                    let checkedNum=prop.parent.parent.controls.filter((optionControl)=>{
                        if(optionControl instanceof FormGroup ){
                            return optionControl["value"].value.imgId;
                        }else{
                            return optionControl.value.value.imgId;
                        }
                    }).length;
                    if(checkedNum<rulues["arrayUploadRequired"]*1){
                        grandfatherControl.setErrors({"required":"得至少上传！"+rulues["arrayUploadRequired"]+"个图吧！"});
                        grandfatherControl.setValue("得至少上传！"+rulues["arrayUploadRequired"]+"个图吧！");
                        grandfatherControl.updateValueAndValidity(true,true);
                    }else{
                        grandfatherControl.setErrors({});
                        grandfatherControl.setValue("");
                    }
                    clearTimeout(lazyTimerId);
                },10);
            }
        }else if(key=="checkboxWatchers"){
            error= {};
            let propName=param["prop"];
            let formModel=param["formModel"];
            let formGroup=param["formGroup"];
            if(formGroup){
                let queryParam={};
                let grandfather=param["grandfather"];
                if(!formGroup){
                    continue;
                }
                let grandfatherControl=formGroup.get(grandfather);
                let lazyTimerId=setTimeout(function () {
                    grandfatherControl.controls.forEach((optionControl)=>{
                        let isChecked=optionControl.value.checked;
                        let optionValue=optionControl.value.value;
                        for(let queryProp in formModel.elements){
                            let item=formModel.elements[queryProp];
                            let innerProp=item.prop;
                            if(propName!=innerProp&&item.switcher&&item.switcher[0].prop==propName){
                                let watchersControl=formGroup.get(innerProp);
                                let watcherValue=item.switcher[0].showValue;
                                if(watcherValue==optionValue){
                                    if(isChecked){
                                        watchersControl.enable({onlySelf:false,emitEvent:false});
                                        item.hidden=false;
                                    }else{
                                        watchersControl.disable({onlySelf:false,emitEvent:false});
                                        item.hidden=true;
                                    }
                                }
                            }
                        }
                    });
                    clearTimeout(lazyTimerId);
                },10);
            }
            break;
        }else if(key=="arrayWatchers"){
            error= {};
            if(!prop.parent) return;
            let propName=prop.parent.controls["prop"].value;// who am i
            let formModel=param["formModel"];
            let formGroup=param["formGroup"];
            if(formGroup){
                let queryParam={};
                let grandfather=param["grandfather"];
                if(!formGroup){
                    continue;
                }
                let formValues={};
                formGroup.value[grandfather].forEach((item)=>{
                    formValues[item.prop]=item.value;
                });
                let grandfatherControl=formGroup.get(grandfather);
                formModel.elements.forEach((element)=>{
                    if(element.type=="array"&&element.keyPropMap&&grandfather==element.prop){
                        element.options.forEach((option)=>{
                            if(option.switchers&&option.switchers.length>0&&option.switchers[0].prop==propName){
                                if(option.remoteInfo!=null){
                                    option.remoteInfo.param[option.remoteInfo.param["extend"]]=value;
                                    if(option.remoteInfo.propMap){
                                        for(let propKey in option.remoteInfo.propMap){
                                            option.remoteInfo.param[option.remoteInfo.propMap[propKey]]=propKey==propName?value:formValues[propKey];
                                        }
                                    }
                                    if(value==""||value==null){
                                        option["options"]=option.remoteInfo.convert({});
                                    }else{
                                        ////console.log("element",element.prop)
                                        this.listData({url:option.remoteInfo.url,param:option.remoteInfo.param,httpMethod:option.remoteInfo.httpMethod}).subscribe((data)=>{
                                            option["options"]=option.remoteInfo.convert(data.json())||data.json();
                                        });
                                    }
                                }
                            }
                        })
                    }
                })
                grandfatherControl.controls.forEach((optionControl)=>{
                    if(optionControl.controls["switchers"]&&optionControl.controls["switchers"].value["prop"]==propName&&optionControl.controls["value"].value!=""){
                        optionControl.controls["value"].setValue("");
                    }
                });
                //formGroup.get(grandfather+"LinkValidate").setErrors({});
            }
            break;
        }else if(key=="watchers"){
            error= {};
            let propName=param["prop"];
            let formModel=param["formModel"];
            let formGroup=prop.parent;
            if(formGroup){
                let queryParam={};
                for(let queryProp in formModel.elements){
                    let item=formModel.elements[queryProp];
                    let innerProp=item.prop;
                    if(propName!=innerProp&&item.switcher&&item.switcher[0].prop==propName){
                        let watchersControl=formGroup.get(innerProp);
                        let watcherValue=item.switcher[0].showValue;
                        if(watcherValue==prop.value){
                            watchersControl.enable({onlySelf:false,emitEvent:false});
                            item.hidden=false;
                        }else{
                            watchersControl.disable({onlySelf:false,emitEvent:false});
                            item.hidden=true;
                        }
                    }
                }
            }
            break;
        }else if(key=="remote"){
            //http 远程验证。。。
            ////console.log("paramparamparam",param)
            let formGroup=param.form;
            if(formGroup){
                let queryParam={};
                let alias=param.alias||{};//别名请求比如省id为provinceId 实际请求参数名称为pId 属性名称与请求参数不一致的时候使用尽管不常用但是有可能用得到
                for(let queryProp in param.remoteValidateRequiredParam){
                    if(!formGroup.hasOwnProperty(queryProp)){
                        continue;
                    }
                    queryParam[queryProp]=formGroup[queryProp];
                    if(alias[queryProp]){
                        queryParam[alias[queryProp]]=queryParam[queryProp];
                    }
                }
                promise=remoteValidate({body:queryParam,value:value},remoteService);
            }
        }else if(key=="promise"){
            error= {};
            //异步校验 返回promise。
            ////console.log("paramparamparam",param)
                promise=new Promise(function (resolve,reject) {
                    ruleValue({value:value}).then(success=>{
                        //console.log("success",success)
                        resolve(success);
                    },errorData=>{
                        reject({errorData});
                    });
                })
        }
    }
    let errorMessage="";
    let errorCode="";
    for(let message in error){
        errorMessage+=error[message];
        errorCode+=message;
    }
    return promise?promise:new Promise((resolve)=>resolve({msg:errorMessage,errorCode:errorCode,code:errorMessage==""?1:0}));
}

/**
 * 远程异步校验 放在这里是为了这个校验比较复杂 需要单独处理
 * @param param 校验参数
 */
function remoteValidate(param,remoteService){
    let queryParam={
        url:remoteService.url,
        baseUrl:remoteService.baseUrl,
        data:param.body,
        method:remoteService.httpMethod
    };
    return  backendService.getData(queryParam);
}

/*
* 错误提示信息
*
* */
const errorMessageMap={
    required:(param)=>param.label+'不能为空',
    maxlength:(param)=>param.label+"最多允许输入"+param.length+"字符",
    minlength:(param)=>param.label+"至少输入"+param.length+"字符",
    number:(param)=>param.label+"必须为数字",
    integer:(param)=>param.label+"必须为数字",
    email:(param)=>param.label+"应该是合法的邮箱地址",
    mobile:(param)=>param.label+"必须为11位手机号码",
    password:(param)=>param.label+"复杂度不够",
}
const validator={validator:baseValidate,errorMessageMap:errorMessageMap}
export  default validator;