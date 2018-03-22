function removeParam(e){
  e.parentNode.parentNode.parentNode.removeChild(e.parentNode.parentNode);
}
//function main(){
  let paramTemplate = document.getElementById('param');
  let inputHolder = document.getElementById('inputHolder');
  let queryInput = document.getElementById('query');
  let paramsHolder = document.getElementById('params');
  let addParamBtn = document.getElementById('addParamBtn');
  let submitBtn = document.getElementById('submitBtn');
  let debugBtn = document.getElementById('debugBtn');
  let output = document.getElementById('output');

  function addParam(){
    let newParam = document.importNode(paramTemplate.content, true);
    paramsHolder.appendChild(newParam);
  }
  function parseParams(el){
    let allParams = {};
    let paramsDOM = el.getElementsByClassName('param');
    for(let ind = 0; ind < paramsDOM.length; ind++){
      let kvSet = paramsDOM.item(ind);
      let key = kvSet.getElementsByClassName('key')[0].value;
      let val = kvSet.getElementsByClassName('value')[0].value;
      allParams[key] = val;
    }
    console.log(allParams)
    return allParams;
  }
  function responseStringify(data, mode){
    if(mode == 'normal'){
      return JSON.stringify(data.results, undefined, 2);
    }else if(mode == 'debug'){
      return JSON.stringify(data.diagnostics, undefined, 2);
    }else{
      return JSON.stringify({
        'Error':`No mode specified. Contact ${YQLJS.info.author} at ${YQLJS.info.repo}`
      }, undefined, 2);
    }
  }
  function displayOutput(mode, _header, data, format, _footer){
    console.log(data,format)
    if(mode == "normal"){
      if(format == 'json'){
        output.innerHTML = `${_header}<br><pre>${responseStringify(data, mode)}<br>${format}</pre>${_footer!=undefined?'<br>'+_footer:''}`;
      }else if(format == 'html'){
        output.innerHTML = `${_header}<br>${data.results.result}<br>${format}${_footer!=undefined?'<br>'+_footer:''}`;
      }
    }else if(mode == 'debug'){
      output.innerHTML = `${_header}<br>${responseStringify(data, mode)}<br>${format}${_footer!=undefined?'<br>'+_footer:''}`;
    }
  }
  addParamBtn.addEventListener('click', function(){
    addParam();
  });
  submitBtn.addEventListener('click', async function(){
    displayOutput('normal', '<h1>Output</h1>', ... await YQL(queryInput.value, parseParams(paramsHolder)));
  });
  debugBtn.addEventListener('click', async function(){
    displayOutput('debug', '<h1>Diagnostics</h1><pre>', ... await YQL(queryInput.value, parseParams(paramsHolder)),'</pre>');
  });
//}
//document.addEventListener('load',main);
