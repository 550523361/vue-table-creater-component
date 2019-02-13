/**
 * Created by Administrator on 2017/7/11.
 */
import axios from "axios";

function getData(config) {
    let defaultConfig={
        // `url` is the server URL that will be used for the request
        url: '',
        // `method` is the request method to be used when making the request
        method: 'get', // default
        // `baseURL` will be prepended to `url` unless `url` is absolute.
        // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
        // to methods of that instance.
        baseURL: '',
        // `transformRequest` allows changes to the request data before it is sent to the server
        // This is only applicable for request methods 'PUT', 'POST', and 'PATCH'
        // The last function in the array must return a string or an ArrayBuffer
        transformRequest: [function (data) {
            // Do whatever you want to transform the data
            return data;
        }],
        // `transformResponse` allows changes to the response data to be made before
        // it is passed to then/catch
        transformResponse: [function (data) {
            // Do whatever you want to transform the data
            return data;
        }],
        // `headers` are custom headers to be sent
        headers: {'X-Requested-With': 'XMLHttpRequest'},
        // `params` are the URL parameters to be sent with the request
        params: {
        },
        // `paramsSerializer` is an optional function in charge of serializing `params`
        // (e.g. https://www.npmjs.com/package/qs, http://api.jquery.com/jquery.param/)
        paramsSerializer: function(params) {
            return Qs.stringify(params, {arrayFormat: 'brackets'})
        },
        // `data` is the data to be sent as the request body
        // Only applicable for request methods 'PUT', 'POST', and 'PATCH'
        // When no `transformRequest` is set, must be a string, an ArrayBuffer or a hash
        data: {
            firstName: 'Fred'
        },
        // `timeout` specifies the number of milliseconds before the request times out.
        // If the request takes longer than `timeout`, the request will be aborted.
        timeout: 1000,
        // `withCredentials` indicates whether or not cross-site Access-Control requests
        // should be made using credentials
        withCredentials: false, // default
        // `adapter` allows custom handling of requests which makes testing easier.
        // Call `resolve` or `reject` and supply a valid response (see [response docs](#response-api)).
        adapter: function (resolve, reject, config) {
            /* ... */
        },
        // `auth` indicates that HTTP Basic auth should be used, and supplies credentials.
        // This will set an `Authorization` header, overwriting any existing
        // `Authorization` custom headers you have set using `headers`.
        auth: {
            /*username: 'janedoe',
            password: 's00pers3cret'*/
        },
        // `responseType` indicates the type of data that the server will respond with
        // options are 'arraybuffer', 'blob', 'document', 'json', 'text'
        responseType: 'json', // default
        // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
        xsrfCookieName: 'XSRF-TOKEN', // default
        // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
        xsrfHeaderName: 'X-XSRF-TOKEN', // default
        // `progress` allows handling of progress events for 'POST' and 'PUT uploads'
        // as well as 'GET' downloads
        progress: function(progressEvent) {
            // Do whatever you want with the native progress event
        }
    };
    config = Object.assign(config,{
        //baseURL:'http://101.200.80.219:8012'
        //baseURL:'http://10.200.0.52:8200'
        //baseURL:'/api-backend'
    });
    //config=Object.create(config,defaultConfig);
    /*if(config.url.indexOf("?")>=0){
        config.url+="&hostName="+window.location.hostname
    }else{
        config.url+="?hostName="+window.location.hostname
    }*/
    return axios(config).then(function (data) {
        return data.data;
    },function (error) {
        console.log(error)
    });
}

export default {getData};