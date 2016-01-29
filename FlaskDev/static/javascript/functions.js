var iWebkit;if(!iWebkit){iWebkit=window.onload=function(){function fullscreen(){var a=document.getElementsByTagName("a");for(var i=0;i<a.length;i++){if(a[i].className.match("noeffect")){}else{a[i].onclick=function(){window.location=this.getAttribute("href");return false}}}}function hideURLbar(){window.scrollTo(0,0.9)}iWebkit.init=function(){fullscreen();hideURLbar()};iWebkit.init()}}

/* URL du serveur contenant les services web*/
var URL = "http://127.0.0.1:5000/"

/*XHR*/
var getJSON = function(url, successHandler, errorHandler) {
    var xhr = typeof XMLHttpRequest != 'undefined'
    ? new XMLHttpRequest()
    : new ActiveXObject('Microsoft.XMLHTTP');
    /*Le 3eme paramètre de la méthode open permet de définir que les requêtes seront asynchrone*/
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function() {
        var status;
        var data;
        if (xhr.readyState == 4) {
          status = xhr.status;
          if (status == 200) {
            successHandler && successHandler(xhr.response);
          } else {
            errorHandler && errorHandler(status);
          }
        }
    };
    xhr.send();
};