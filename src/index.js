import TableList from "./tableList/listTable"
import TableListConfig from "./tableList/TabListConfig"
import BaseService from "./remoteService/backendService"
import elementUi from "element-ui"
import "element-ui/lib/theme-chalk/index.css"
const components=[TableList];

const install = function(Vue,options){
    Vue.use(elementUi);

    components.forEach(component=>{
        Vue.component(component.name,component)
    })
}


let exports={TableList,TableListConfig,BaseService,install};

export default exports;
