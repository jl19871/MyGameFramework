/*
 * @Author: JL
 * @Date: 2021-10-09 15:27:38
 */
export interface HttpParams {
  type?: string,
  dataType?: string,
  url: string,
  data?: Object,
  success?: Function,
  error?: Function
}

export class MyHttpUtil {
  //辅助函数，格式化参数
  static formatParams(data: Object) {
    let arr = [];
    for (let name in data) {
      arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    //设置随机数，防止缓存
    arr.push("t=" + Math.random());
    return arr.join("&");
  }

  static send(obj: HttpParams) {
    obj.type = (obj.type || 'GET').toUpperCase();
    obj.dataType = obj.dataType || 'json';
    var params = "";

    //step1:兼容性创建对象
    var xhr = new XMLHttpRequest();
    xhr.timeout = 5000;
    var self = this;
    var timeoutID = setTimeout(function () {
      console.log("网络请求超时");
      xhr.abort();
      obj.error && obj.error('timeout');
    }, 5000);

    //step4: 接收
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        clearTimeout(timeoutID);
        if (xhr.status >= 200 && xhr.status < 300) {
          obj.success && obj.success(xhr.responseText, xhr.responseXML);
        } else {
          obj.error && obj.error(xhr.status);
        }
      }
    };

    //step2 step3:连接 和 发送
    if (obj.type == 'GET') {
      params = this.formatParams(obj.data); //参数格式化
      xhr.open('GET', obj.url + '?' + params);
      xhr.send("");
    } else if (obj.type == 'POST') {
      params = JSON.stringify(obj.data);
      xhr.open('POST', obj.url, true);
      //设置请求头，以表单形式提交数据
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send(params);
    }
  }

}