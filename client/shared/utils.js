var $ = require('jquery')

   function getParameterByName(name, url) {
       if (!url) {
           url = window.location.href;
       }
       name = name.replace(/[\[\]]/g, "\\$&");
       var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
           results = regex.exec(url);
       if (!results) return null;
       if (!results[2]) return '';
       return decodeURIComponent(results[2].replace(/\+/g, " "));
   }

   var getCookie = function(cname) {
       var name = cname + "=";
       var ca = document.cookie.split(';');
       for (var i = 0; i < ca.length; i++) {
           var c = ca[i];
           while (c.charAt(0) == ' ') c = c.substring(1);
           if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
       }
       return "";
   }


   var getLocalStorage = function(lname) {
       if (!lname) return "";
       if (window.localStorage)
           return window.localStorage.getItem(lname)
       else
           return "";
   }

   var getSessionStorage = function(lname) {
       if (!lname) return "";
       if (window.sessionStorage)
           return window.sessionStorage.getItem(lname)
       else
           return "";
   }

   var getStoredValue = function(val) {
       return getLocalStorage(val) || getCookie(val);
   }

   var setCookie = function(cname, cvalue, exdays) {
       var d = new Date();
       d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
       var expires = "expires=" + d.toUTCString();
       document.cookie = cname + "=" + cvalue
   }
   var setLocalStorage = function(lname, lvalue) {
       if (!lname) return "";
       if (window.localStorage)
           return window.localStorage.setItem(lname, lvalue);

   }
   var setSessionStorage = function(lname, lvalue) {
       if (!lname) return "";
       if (window.sessionStorage)
           return window.sessionStorage.setItem(lname, lvalue);
   }

   var setStorageValue = function(key, val) {
       setLocalStorage(key, val);
       setCookie(key, val);
   }

   var getUTCDate = function(d) {
       return new Date(d.getTime() + (d.getTimezoneOffset() * 60 * 1000))
   }

   var getResourceUrl = function(resources, attribute, index, defaultValue, callback) {
       var url = "/" + resources.join('/') + '/'
       console.log(url)
       $.ajax({
               url: url
           })
           .done(function(resp) {
               if (resp['data'] && resp['status'] == 'success') {
                   var requiredResource = resp['data'][index]
                   console.log(requiredResource)
                   if (attribute in requiredResource) {
                       console.log(requiredResource[attribute])
                       callback(requiredResource[attribute])
                   } else {
                       callback(defaultValue)
                   }
               } else {
                   callback(defaultValue)
               }
           })
           .fail(function() {
               callback(defaultValue)
           })

   }

   var getDynamicImage = function(contentString, callback) {
       console.log(contentString)
       var resources = []
       var index = null
       var contentRegex = /([\w]*)[\.|\||\}]}?/g
       var match = contentRegex.exec(contentString)
       while (match != null) {
           if (isNaN(match[1]) && match[1] != 'safe') {
               console.log(match[1])
               resources.push(match[1])
           } else if (!isNaN(match[1])) {
               index = Number(match[1])
           }
           match = contentRegex.exec(contentString)
       }
       var attribute = resources.pop()
       getResourceUrl(resources, attribute, index, "/static/img/default.png", callback)

   }

   var getHashParameterByName = function(sParam) {
       var sPageURL = window.location.hash.split("?")[1];
       var sURLVariables = (sPageURL) ? sPageURL.split('&') : [];
       for (var i = 0; i < sURLVariables.length; i++) {
           var sParameterName = sURLVariables[i].split('=');
           if (sParameterName[0] == sParam) {
               return sParameterName[1];
           }
       }
       return "";
   }


   module.exports = {
       getParameterByName: getParameterByName,
       setStorageValue: setStorageValue,
       setLocalStorage: setLocalStorage,
       setSessionStorage: setSessionStorage,
       setCookie: setCookie,
       getCookie: getCookie,
       getUTCDate: getUTCDate,
       getStoredValue: getStoredValue,
       getLocalStorage: getLocalStorage,
       getSessionStorage: getSessionStorage,
       getDynamicImage: getDynamicImage,
       getHashParameterByName: getHashParameterByName
   }
