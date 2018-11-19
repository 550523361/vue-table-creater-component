var config={
    url:"",//列表的请求地址
    colums:[
        /*
        * {
        * "prop":"accumulativeAmount",//列属性
        * label:"累计需结金额",//列显示名称
        * width:140||'auto',//列宽度
        * html:false|true,//是否显示html内容
        * type:'img'||'input',//显示成图片 显示成输入框
        * addEventListener:["enter"],//给当前属性添加键盘事件 如排序记录输入顺序回车即可
        * viewHandler:(column,params,watchData)=>{//依据查询参数或其它数据处理本列的显示与隐藏 常用于选项卡的情况
              return watchData.reinit==1;
          },
          columnHandler(item,rowData){//显示属性的内容 比如做翻译 state==1 => 显示正常等  如果html属性设置为true 还可以返回html文本供个性化展示
           // console.log(item,rowData)
              return rowData.settlementAmount;//item.map(item=>item.merchantProductName).join(",");
          }},
        * */
    ],//列表属性
    operator:[
        /*
        * {
        * prop:"status",//操作按钮关联属性
        * label:"",//按钮名称
        * map:{1:'违规下架'},//状态按钮名称映射配置 配置为空即为该状态不显示按钮
        * style:Object.assign(JSON.parse(JSON.stringify(baseBtnStyle)),{backgroundColor:'#000',color:'#fff'}),//按钮样式 正常的css对象
        * click:that.popDownForm,//按钮点击事件处理方法
        *
        * },
        * viewHandler:(btnInfo,rowData,querrParam,otherParam)=>{//按钮显示回调函数 比如根据当前的查询条件显示按钮不同样式或显示隐藏按钮
                            //console.log("btnInfo,rowData,querrParam,otherParam",btnInfo,rowData,querrParam,otherParam);
                            return rowData.exchangePhone==querrParam.exchangePhone?btnInfo.map[rowData.type]:''
          }
        * */
    ],//每列的操作项
    query:[
        /*
        * {
              label:'删除多余查询条件',
              type:'input',//组件类型
                                1.hidden-隐藏查询条件;
                                2.datetimerange-时间范围 开始-结束;
                                3:input-输入型查询条件;
                                4.tab-选项卡类型条件;
                                5.select-下拉选项查询条件;
                                6:search-显示一个放大镜的查找按钮;
                                7:button-显示一个按钮比如批量导入,新建等
              placeholder:'',//占位提示 请输入姓名
              prop:'userMobile',//查询参数名称 如用户电话 userMobile
              default:["timeRange"]//默认值 如果值为 deleteProps 查询参数将去除指定的属性
           },
        *
        * */
    ],//列表的查询条件,包含隐藏字段
    httpMethod:'post',//接口http方法
    pagerDataHelper:null,//接口数据处理函数 返回数组供列表组件展示数据
    listAdapter:{},
    pager:{
        pageSizeProp:"rowsPerPage",//分页大小的属性
        pageSizeQueryProp:"pageSize",//分页大小查询属性 有时候返回和查询不一致
        pageNumProp:"currentPage",//当前页属性
        pageNumQueryProp:"pageNum",//当前页查询属性 用于获取第几页数据
        totalRowsProp:"totalRows",//总页数
        pageSize:10,//默认分页大小
    },
    baseBtnStyle:{//操作按钮的默认样式 多个按钮请继承并修改不同样式
        backgroundColor:'#f00',
        padding:'3px 15px',
        color:'#fff',
        cursor:'pointer',
        borderRadius:"5px",
        marginRight:'5px',
        fontSize:'13px'
    },
    headerClick:null,//table header点击回调函数
}

    /*一个配置实例*/
    /*{
          label:'删除多余查询条件',
          type:'hidden',
          placeholder:'请输入订单号',
          prop:'deleteProps',
          default:["timeRange"]
      },{
          label:'结算单号',
          type:'input',
          placeholder:'请输入结算单号',
          prop:'settlementNum'
      },{
          label:'结算账号',
          type:'hidden',
          placeholder:'请输入结算账号',
          prop:'type',
          defaultValue:2,
          default:2,
      },{
        label:'商户',
        type:'input',
        placeholder:'模糊搜索',
        prop:'merchantName'
    },
    {
        label:'起止日期',
        type:'datetimerange',
        placeholder:'请选择下单时间范围',
        prop:'timeRange',
        startLabel:'开始时间',
        endLabel:'结束时间',
        options:{
            shortcuts: [{
                text: '最近一周',
                onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', [start, end]);
                }
                }, {
                    text: '最近一个月',
                    onClick(picker) {
                    const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
                }
                }, {
                    text: '最近三个月',
                    onClick(picker) {
                    const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
                }
                }]
        },

    },
    {
        label:'',
        placeholder:'全部',
        defaultValue:"0",
        default:"0",
        type:'tab',
        prop:'status',
        httpMethod:'post',
        dataUrl:'/mall/settlement/getSettlementStatusList.json',
        propList:'orderStateList',
        propKeyList:'orderStateList',
        initQuery:true,
        otherParams:{
            type:2
        },
        click:function(){
            console.log("orderStateList")
        },
        dataHandler(data){
            console.log("dataHandler",data);
            data.data.map(item=>{
                item.id=item.code;
                item.label=item.desc;
            })

            return data.data.reverse();
        },
        components:[
            {
                label:'信息待补充',
                value:1
            },
            {
                label:'开店中',
                value:2
            },
            {
                label:'已关闭',
                value:3
            },
        ]
        },
        {
            label:'搜索',
                type:'search',
            check: function (queryParam) {
            console.log("queryParamqueryParamqueryParam",queryParam);
            if(queryParam){
                return {params:queryParam};

            }
            return true;
        }
        }   ,
        {
            label:'批量导出',
                type:'button',
                param:true,
                click: function (data,list) {
                  console.log("createMerchant",data,this);
                }
        }*/

module.exports=config;