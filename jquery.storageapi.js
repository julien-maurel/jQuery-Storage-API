/*
 * jQuery Storage API Plugin
 *
 * Copyright (c) 2013 Julien Maurel
 *
 * Licensed under the MIT license:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 * https://github.com/julien-maurel/jQuery-Storage-API
 *
 * Version: 1.2.1
 *
 */
(function($){
  // Get a variable in a storage. Infinite arguments to be able to get property in objects
  // If second argument is an array, return an object with each property
  function _get(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],vi,ret;
    if(l<2) throw new Error('Minimum 2 parameters must be given');
    else if($.isArray(a1)){
      ret={};
      for(var i in a1){
        vi=a1[i];
        try{
          ret[vi]=JSON.parse(s.getItem(vi));
        }catch(e){
          ret[vi]=s.getItem(vi);
        }
      }
      return ret;
    }else if(l==2){
      try{
        return JSON.parse(s.getItem(a1));
      }catch(e){
        return s.getItem(a1);
      }
    }else{
      try{
        ret=JSON.parse(s.getItem(a1));
      }catch(e){
        throw new ReferenceError(a1+' is not defined in this storage');
      }
      for(var i=2;i<l-1;i++){
        ret=ret[a[i]];
        if(ret===undefined) throw new ReferenceError([].slice.call(a,1,i+1).join('.')+' is not defined in this storage');
      }
      return ret[a[i]];
    }
  }

  // Set a variable in a storage. Infinite arguments to be able to set property in objects.
  // If second argument is an object, each property is set
  function _set(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],a2=a[2],vi,to_store={},tmp;
    if(l<2 || !$.isPlainObject(a1) && l<3) throw new Error('Minimum 3 parameters must be given or second parameter must be an object');
    else if($.isPlainObject(a1)){
      for(var i in a1){
        vi=a1[i];
        if(!$.isPlainObject(vi)) s.setItem(i,vi);
        else s.setItem(i,JSON.stringify(vi));
      }
      return a1;
    }else if(l==3 && !$.isPlainObject(a2)){
      s.setItem(a1,a2);
      return a2;
    }else if(l==3){
      s.setItem(a1,JSON.stringify(a2));
      return a2;
    }else{
      try{
        var tmpStore = s.getItem(a1);
        if(tmpStore != null) {
          to_store=JSON.parse(tmpStore);
        }
      }catch(e){
        //Already set to {}
      }

      tmp=to_store;
      for(var i=2;i<l-2;i++){
        vi=a[i];
        if(!tmp[vi] || !$.isPlainObject(tmp[vi])) tmp[vi]={};
        tmp=tmp[vi];
      }

      tmp[a[i]]=a[i+1];

      s.setItem(a1,JSON.stringify(to_store));
      return to_store;
    }
  }

  // Delete a variable in a storage. Infinite arguments to be able to delete property in objects
  // If second argument is an array, each property is deleted
  function _delete(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],to_store,tmp;
    if(l<2) throw new Error('Minimum 2 parameters must be given');
    else if($.isArray(a1)){
      for(var i in a1){
        s.removeItem(a1[i]);
      }
      return true;
    }else if(l==2){
      s.removeItem(a1);
      return true;
    }else{
      try{
        to_store=tmp=JSON.parse(s.getItem(a1));
      }catch(e){
        throw new ReferenceError(a1+' is not defined in this storage');
      }
      for(var i=2;i<l-1;i++){
        tmp=tmp[a[i]];
        if(tmp===undefined) throw new ReferenceError([].slice.call(a,1,i).join('.')+' is not defined in this storage');
      }
      delete tmp[a[i]];
      s.setItem(a1,JSON.stringify(to_store));
      return true;
    }
  }

  // Delete all variables in a storage
  function _deleteAll(storage){
    var keys = Object.keys(window[storage]);

    for(var i=0; i < keys.length; i++){
      _delete(storage, keys[i]);
    }
  }

  // Check if storage is empty
  function _isEmpty(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],to_store={}
    if(s.length == 0){
      return true
    } else if(l > 1){
      return _keys(storage, a1).length == 0
    }
    return false;
  }

  //Return the keys in storage
  function _keys(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],to_store={};
    if(l > 1) {
      try{
        var item = s.getItem(a1);
        if(item != null) {
          to_store=JSON.parse(s.getItem(a1));
        }
      }catch(e) {
        //to_store already set to {}
      }
      return Object.keys(to_store);
    }else{
      return Object.keys(s);
    }
  }

  // Create new namespace storage
  function _createNamespace(name){
    if(!name || typeof name!="string") throw new Error('First parameter must be a string');
    if(!window.localStorage.getItem(name)) window.localStorage.setItem(name,'{}');
    if(!window.sessionStorage.getItem(name)) window.sessionStorage.setItem(name,'{}');
    var ns={
      localStorage:$.extend({},$.localStorage,{_ns:name}),
      sessionStorage:$.extend({},$.localStorage,{_ns:name})
    };
    if($.cookie){
      if(!window.cookieStorage.getItem(name)) window.cookieStorage.setItem(name,'{}');
      ns.cookieStorage=$.extend({},$.cookieStorage,{_ns:name});
    }
    return ns;
  }

  // Namespace object
  var storage={
    _type:'',
    _ns:'',
    // Get a variable. If no parameters and storage have a namespace, return all namespace
    get:function(){
      var l=arguments.length,a=arguments,a0=a[0],vi;
      if(!$.isArray(a0)){
        var p = [this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        return _get.apply(this, a);
      }else if(this._ns){
        var ret={};
        for(var i in a0){
          vi=a0[i];
          ret[vi]=_get(this._type,this._ns,vi);
        }
        return ret;
      }else{
        return _get(this._type,a0);
      }
    },
    // Set a variable
    set:function(){
      var l=arguments.length,a=arguments,a0=a[0],vi;
      if(l<1 || !$.isPlainObject(a0) && l<2) throw new Error('Minimum 2 parameters must be given or first parameter must be an object');
      if(!$.isPlainObject(a0)){
        var p=[this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        var r=_set.apply(this,a);
        if(this._ns) return r[a0];
        else return r;
      }else if(this._ns){
        for(var i in a0){
          _set(this._type,this._ns,i,a0[i]);
        }
        return a0;
      }else{
        return _set(this._type,a0);
      }
    },
    // Delete a variable. 
    delete:function(){
      var l=arguments.length,a=arguments,a0=a[0],vi;
      if(l<1) throw new Error('Minimum 1 parameter must be given');
      if(!$.isArray(a0)){
        var p=[this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        return _delete.apply(this,a);
      }else if(this._ns){
        for(var i in a0){
          _delete(this._type,this._ns,a0[i]);
        }
        return true;
      }else{
        return _delete(this._type,a0);
      }
    },
    // Delete everything in storage. When using namespaces, deleteAll will only delete everything in the
    // namespace unless true it passed to deleteAll.
    deleteAll:function(all){
      if(all == undefined){
        all = false;   
      }
      if(this._ns){
        if(all){
          _deleteAll(this._type);
        }
        _set(this._type,this._ns,{});
        return true;
      }else{
        return _deleteAll(this._type);
      }
    },
    isEmpty:function(){
      if(this._ns){
        return _isEmpty(this._type, this._ns);
      }else{
        return _isEmpty(this._type);
      }
    },
    keys:function(){
      if(this._ns){
        return _keys(this._type, this._ns);    
      }else{
        return _keys(this._type);
      }
    }
  };

  // Use jquery.cookie for compatibility with old browsers and give access to cookieStorage
  if($.cookie){
    // sessionStorage is valid for one window/tab. To simulate that with cookie, we set a name for the window and use it for the name of the cookie
    if(!window.name) window.name=Math.floor(Math.random()*100000000);
 
    //Define window.cookieStorage using defineProperty. Allows us to override the objects default 'get' function 
    //to make window.cookieStorage work the same as window.localStorage.
    Object.defineProperty(window, "cookieStorage", new (function() {
      var cookie_storage = {};

      Object.defineProperty(cookie_storage, "_prefix", {
        value: '',
        enumerable: false
      });
      Object.defineProperty(cookie_storage, "_expires", {
        value: null,
        enumerable: false
      });
      Object.defineProperty(cookie_storage, "getItem", {
        value: function (key) { return key ? $.cookie(this._prefix+key) : null; }
      });
      Object.defineProperty(cookie_storage, "key", {
        value: function (index) { 
          var keys = Object.keys($.cookie());
          return keys[index];
        }
      });
      Object.defineProperty(cookie_storage, "setItem", {
        value: function (key, value) {
          if(!key) { return; }
          cookie_storage[key] = value;
          $.cookie(this._prefix+key, value,{expires:this._expires})
        }
      });
      Object.defineProperty(cookie_storage, "length", {
        get: function () { 
          var keys = Object.keys($.cookie());
          //$.cookie always contains at least an empty key/value reference so don't count it
          if((keys.length == 1) && (keys[0] == '')){ 
            return 0;
          }
          return keys.length
        }
      });
      Object.defineProperty(cookie_storage, "removeItem", {
        value: function (key) {
          if(!key) { return; }
          delete cookie_storage[key];
          return $.removeCookie(this._prefix+key)
        }
      });
      Object.defineProperty(cookie_storage, "setExpires", {
        value: function (expires) {
          this._expires=expires;
          return this;
        }
      });
      this.get = function() {
        //Remove cookie properties on cookie_storage 
        var keys = Object.keys(cookie_storage);
        for (var i=1;i < keys.length;i++){
          delete cookie_storage[key];
        }

        //Add cookies as properties on cookie_storage
        for(var key in $.cookie()){
          if(key != '') {
            cookie_storage[key] = $.cookie(key);
          }
        }
        return cookie_storage;
      };
    })());

    if(!window.localStorage){
      window.localStorage=$.extend({},window.cookieStorage,{_prefix:'ls_', _expires:365*10});
      window.sessionStorage=$.extend({},window.cookieStorage,{_prefix:'ss_' + window.name + '_'});
    }
    
    // cookieStorage API
    $.cookieStorage=$.extend({},storage,{_type:'cookieStorage',setExpires:function(e){window.cookieStorage.setExpires(e); return this;}});
  }
  
  // Get a new API on a namespace
  $.initNamespaceStorage=function(ns){ return _createNamespace(ns); };
  // localStorage API
  $.localStorage=$.extend({},storage,{_type:'localStorage'});
  // sessionStorage API
  $.sessionStorage=$.extend({},storage,{_type:'sessionStorage'});
})(jQuery);
