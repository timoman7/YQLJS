const YQLJS = {
  info:{
    author: 'Timothy C. (SSJ3 Bane / timoman6,7,8)',
    repo: 'https://timoman7.github.io/'
  }
};
function checkType(query){
  let types={
    html:[
      'htmlstring',
      'html'
    ],
    xml:[
      'xmlstring',
      'xml'
    ],
    json:[
      'json',
      'steam.user'
    ],
    text:[
      'string'
    ]
  };
  let thisType = 'text';
  Object.keys(types).forEach((kn)=>{
    let type = types[kn];
    type.forEach((dataType)=>{
      let regMatch = query.match(new RegExp(`from ${dataType} where`,'i'));
      if(regMatch != null){
        thisType = kn;
      }
    });
  })
  return thisType;
}
function bossify(str){
  let escapeValues = {
    '%': '25',
    '/': '2F',
    '?': '3F',
    '&': '26',
    ';': '3B',
    ':': '3A',
    '@': '40',
    ',': '2C',
    '$': '24',
    '=': '3D',
    ' ': '20',
    '"': '22',
    '+': '2B',
    '#': '23',
    '*': '2A',
    '<': '3C',
    '>': '3E',
    '{': '7B',
    '}': '7D',
    '|': '7C',
    '[': '5B',
    ']': '5D',
    '^': '5E',
    '\\': '5C',
    '`': '60',
    '(': '28',
    ')': '29'
  };
  let newStr="";
  newStr=str;
  for(let evKey in escapeValues){
    let ev = escapeValues[evKey];
    newStr=newStr.replace(new RegExp('\\'+evKey,'g'),'%'+ev);
  }
  return newStr;
}
let YQLAjax = (function(_ajax){
  var protocol = location.protocol,
    hostname = location.hostname,
    exRegex = RegExp(protocol + '//' + hostname),
    YQLURL = 'http' + (/^https/.test(protocol)?'s':'') + '://query.yahooapis.com/v1/public/yql?callback=?',
    query = `select * from html where url="{URL}" and xpath="*"`;

  function isExternal(url)
  {
    return !exRegex.test(url) && /:\/\//.test(url);
  }

  return function(query,options){
    let o = {};
    // Manipulate options so that JSONP-x request is made to YQL
    o.url = YQLURL;
    o.dataType = 'json';
    o.data = Object.assign({
      q: query,
      format: 'json',
      diagnostics: true,
      env:'store://datatables.org/alltableswithkeys'
    },options);

    // Since it's a JSONP request
    // complete === success
    if (!o.success && o.complete) {
      o.success = o.complete;
      delete o.complete;
    }

    o.success = (function(_success){
      return function(data){
        if (_success) {
          // Fake XHR callback.
          _success.call(this, {
            // YQL screws with <script>s, Get rid of them
            responseText: data
          }, 'success');
        }
      };
    })(o.success);
    return $.ajax(o); // not special, use base Jquery ajax
  };
})(jQuery.ajax);
function YQLQuery(query, params, options){
  let _YQLQuery = '';
  _YQLQuery = query;
  for(let kn in params){
    let kv = params[kn];
    _YQLQuery += ` ${kn}='${kv}'${(Object.keys(params)[Object.keys(params).length-1]!=kn?' AND':'')}`;
  }
  let returnAjax = YQLAjax(_YQLQuery, ((options!=undefined&&options instanceof Object&&!(options instanceof Array))?options:{}));
  return returnAjax;
}
async function YQL(query, params){
  console.log(query, params)
  let _query = query;
  if(!query.toLowerCase().includes(' where ')){
    _query += ' where';
  }
  let response = await YQLQuery(_query, params);
  let responseData = response.query;
  let responseType = checkType(_query);
  return [responseData, responseType];
}
