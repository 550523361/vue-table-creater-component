import TableList from "./tableList/listTable"
import TableListConfig from "./tableList/TabListConfig"
import BaseService from "./remoteService/backendService"
import AnyComponent from "./tableList/componentContainer"
import elementUi from "element-ui"
import "element-ui/lib/theme-default/index.css"
const components=[TableList,AnyComponent];

const install = function(Vue,options){
    Vue.use(elementUi);
    components.forEach(component=>{
        Vue.component(component.name,(component.render||component.template)?component:component.component)
    })
}


let exports={TableList,TableListConfig,BaseService,install};

export default exports;
