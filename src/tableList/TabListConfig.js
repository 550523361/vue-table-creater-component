var config={
     url:"",
     colums:{},
     operator:{},
     query:{},
     httpMethod:'post',
     pagerDataHelper:null,
     listAdapter:{},
     pager:{
            pageSizeProp:"rowsPerPage",
            pageSizeQueryProp:"pageSize",
            pageNumProp:"currentPage",
            pageNumQueryProp:"pageNum",
            totalRowsProp:"totalRows",
            pageSize:10
    },
    baseBtnStyle:{backgroundColor:'#f00',padding:'3px 15px',color:'#fff',cursor:'pointer',borderRadius:"5px",marginRight:'5px',fontSize:'13px'},
    headerClick:null
}

module.exports=config;