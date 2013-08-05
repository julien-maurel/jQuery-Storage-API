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
 * Version: 1.5.0
 *
 */
(function($){
  // Prefix to use with cookie fallback
  var cookie_local_prefix="ls_";
  var cookie_session_prefix="ss_";

  // Get items from a storage
  function _get(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],vi,ret,tmp;
    if(l<2) throw new Error('Minimum 2 arguments must be given');
    else if($.isArray(a1)){
      // If second argument is an array, return an object with value of storage for each item in this array
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
      // If only 2 arguments, return value directly
      try{
        return JSON.parse(s.getItem(a1));
      }catch(e){
        return s.getItem(a1);
      }
    }else{
      // If more than 2 arguments, parse storage to retrieve final value to return it
      // Get first level
      try{
        ret=JSON.parse(s.getItem(a1));
      }catch(e){
        throw new ReferenceError(a1+' is not defined in this storage');
      }
      // Parse next levels
      for(var i=2;i<l-1;i++){
        ret=ret[a[i]];
        if(ret===undefined) throw new ReferenceError([].slice.call(a,1,i+1).join('.')+' is not defined in this storage');
      }
      // If last argument is an array, return an object with value for each item in this array
      // Else return value
      if($.isArray(a[i])){
        tmp=ret;
        ret={};
        for(var j in a[i]){
          ret[a[i][j]]=tmp[a[i][j]];
        }
        return ret;
      }else{
        return ret[a[i]];
      }
    }
  }

  // Set items of a storage
  function _set(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],a2=a[2],vi,to_store={},tmp;
    if(l<2 || !$.isPlainObject(a1) && l<3) throw new Error('Minimum 3 arguments must be given or second parameter must be an object');
    else if($.isPlainObject(a1)){
      // If first argument is an object, set values of storage for each property of this object
      for(var i in a1){
        vi=a1[i];
        if(!$.isPlainObject(vi)) s.setItem(i,vi);
        else s.setItem(i,JSON.stringify(vi));
      }
      return a1;
    }else if(l==3){
      // If only 3 arguments, set value of storage directly
      if(typeof a2==='object') s.setItem(a1,JSON.stringify(a2));
      else s.setItem(a1,a2);
      return a2;
    }else{
      // If more than 3 arguments, parse storage to retrieve final node and set value
      // Get first level
      try{
        tmp=s.getItem(a1);
        if(tmp!=null) {
          to_store=JSON.parse(tmp);
        }
      }catch(e){
      }
      tmp=to_store;
      // Parse next levels and set value
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

  // Remove items from a storage
  function _remove(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],to_store,tmp;
    if(l<2) throw new Error('Minimum 2 arguments must be given');
    else if($.isArray(a1)){
      // If first argument is an array, remove values from storage for each item of this array
      for(var i in a1){
        s.removeItem(a1[i]);
      }
      return true;
    }else if(l==2){
      // If only 2 arguments, remove value from storage directly
      s.removeItem(a1);
      return true;
    }else{
      // If more than 2 arguments, parse storage to retrieve final node and remove value
      // Get first level
      try{
        to_store=tmp=JSON.parse(s.getItem(a1));
      }catch(e){
        throw new ReferenceError(a1+' is not defined in this storage');
      }
      // Parse next levels and remove value
      for(var i=2;i<l-1;i++){
        tmp=tmp[a[i]];
        if(tmp===undefined) throw new ReferenceError([].slice.call(a,1,i).join('.')+' is not defined in this storage');
      }
      delete tmp[a[i]];
      s.setItem(a1,JSON.stringify(to_store));
      return true;
    }
  }

  // Remove all items from a storage
  function _removeAll(storage, reinit_ns){
    var keys=_keys(storage);
    for(var i in keys){
      _remove(storage,keys[i]);
    }
    // Reinitialize all namespace storages
    if(reinit_ns){
      for(var i in $.namespaceStorages){
        _createNamespace(i);
      }
    }
  }

  // Check if items of a storage are empty
  function _isEmpty(storage){
    var l=arguments.length,a=arguments,s=window[storage],a1=a[1];
    if(l==1){
      // If only one argument, test if storage is empty
      return (_keys(storage).length==0);
    }else if($.isArray(a1)){
      // If first argument is an array, test each item of this array and return true only if all items are empty
      for(var i=0; i<a1.length;i++){
        if(!_isEmpty(storage,a1[i])) return false;
      }
      return true;
    }else{
      // If more than 1 argument, try to get value and test it
      try{
        var v=_get.apply(this, arguments);
        return(
          ($.isPlainObject(v) && $.isEmptyObject(v)) ||
          ($.isArray(v) && !v.length) ||
          (!v)
        );
      }catch(e){
        return ((l==1 && $.isEmptyObject(s)) || l>1);
      }
    }
  }

  // Check if items of a storage exist
  function _isSet(storage){
    var l=arguments.length,a=arguments,s=window[storage],a1=a[1];
    if(l<2) throw new Error('Minimum 2 arguments must be given');
    if($.isArray(a1)){
      // If first argument is an array, test each item of this array and return true only if all items exist
      for(var i=0; i<a1.length;i++){
        if(!_isSet(storage,a1[i])) return false;
      }
      return true;
    }else{
      // For other case, try to get value and test it
      try{
        var v=_get.apply(this, arguments);
        return (v!==undefined && v!==null);
      }catch(e){
        return false;
      }
    }
  }

  // Get keys of a storage or of an item of the storage
  function _keys(storage){
    var l=arguments.length,s=window[storage],a=arguments,a1=a[1],keys=[],o={};
    // If more than 1 argument, get value from storage to retrieve keys
    // Else, use storage to retrieve keys
    if(l>1){
      o=_get.apply(this,a);
    }else{
      o=s;
    }
    if(o._cookie){
      // If storage is a cookie, use $.cookie to retrieve keys
      for(var key in $.cookie()){
        if(key!='') {
          keys.push(key.replace(o._prefix,''));
        }
      }
    }else{
      for(var i in o){
        keys.push(i);
      }
    }
    return keys;
  }
  
  // Create new namespace storage
  function _createNamespace(name){
    if(!name || typeof name!="string") throw new Error('First parameter must be a string');
    if(!window.localStorage.getItem(name)) window.localStorage.setItem(name,'{}');
    if(!window.sessionStorage.getItem(name)) window.sessionStorage.setItem(name,'{}');
    var ns={
      localStorage:$.extend({},$.localStorage,{_ns:name}),
      sessionStorage:$.extend({},$.sessionStorage,{_ns:name})
    };
    if($.cookie){
      if(!window.cookieStorage.getItem(name)) window.cookieStorage.setItem(name,'{}');
      ns.cookieStorage=$.extend({},$.cookieStorage,{_ns:name});
    }
    $.namespaceStorages[name]=ns;
    return ns;
  }

  // Namespace object
  var storage={
    _type:'',
    _ns:'',
    // Get a variable. If no parameters and storage have a namespace, return all namespace
    get:function(){
      var l=arguments.length,a=arguments,a0=a[0],vi;
      if(l<1) throw new Error('Minimum 1 argument must be given or first parameter must be an object');
      var p = [this._type];
      if(this._ns) p.push(this._ns);
      [].unshift.apply(a,p);
      return _get.apply(this, a); 
    },
    // Set a variable
    set:function(){
      var l=arguments.length,a=arguments,a0=a[0];
      if(l<1 || !$.isPlainObject(a0) && l<2) throw new Error('Minimum 2 arguments must be given or first parameter must be an object');
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
    remove:function(){
      var l=arguments.length,a=arguments,a0=a[0];
      if(l<1) throw new Error('Minimum 1 argument must be given');
      if(!$.isArray(a0)){
        var p=[this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        return _remove.apply(this,a);
      }else if(this._ns){
        for(var i in a0){
          _remove(this._type,this._ns,a0[i]);
        }
        return true;
      }else{
        return _remove(this._type,a0);
      }
    },
    // Delete all variable
    removeAll:function(reinit_ns){
      if(this._ns){
        _set(this._type,this._ns,{});
        return true;
      }else{
        return _removeAll(this._type, reinit_ns);
      }
    },
    // Variable is empty
    isEmpty:function(){
      var l=arguments.length,a=arguments,a0=a[0];
      if(!$.isArray(a0)){
        var p=[this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        return _isEmpty.apply(this, a);
      }else if(this._ns){
        for(var i in a0){
          if(!_isEmpty(this._type,this._ns,a0[i])) return false;
        }
        return true;
      }else{
        return _isEmpty(this._type,a0);
      }
    },
    // Variable exists
    isSet:function(){
      var l=arguments.length,a=arguments,a0=a[0];
      if(l<1) throw new Error('Minimum 1 argument must be given');
      if(!$.isArray(a0)){
        var p=[this._type];
        if(this._ns) p.push(this._ns);
        [].unshift.apply(a,p);
        return _isSet.apply(this, a);
      }else if(this._ns){
        for(var i in a0){
          if(!_isSet(this._type,this._ns,a0[i])) return false;
        }
        return true;
      }else{
        return _isSet(this._type,a0);
      }
    },
    // Get keys
    keys:function(){
      var l=arguments.length,a=arguments;
      var p=[this._type];
      if(this._ns) p.push(this._ns);
      [].unshift.apply(a,p);
      return _keys.apply(this,a);
    }
  };

  // Use jquery.cookie for compatibility with old browsers and give access to cookieStorage
  if($.cookie){
    // sessionStorage is valid for one window/tab. To simulate that with cookie, we set a name for the window and use it for the name of the cookie
    if(!window.name) window.name=Math.floor(Math.random()*100000000);
    var cookie_storage={
      _cookie:true,
      _prefix:'',
      _expires:null,
      setItem:function(n,v){
	$.cookie(this._prefix+n,v,{expires:this._expires});
      },
      getItem:function(n){
	return $.cookie(this._prefix+n);
      },
      removeItem:function(n){
	return $.removeCookie(this._prefix+n);
      },
      clear:function(){
        for(var key in $.cookie()){
          if(key!=''){
            if(!this._prefix && key.indexOf(cookie_local_prefix)===-1 && key.indexOf(cookie_session_prefix)===-1 || this._prefix && key.indexOf(this._prefix)===0) {
              $.removeCookie(key);
            }
          }
        }
      },
      setExpires:function(e){
	this._expires=e;
	return this;
      }
    };
    if(!window.localStorage){
      window.localStorage=$.extend({},cookie_storage,{_prefix:cookie_local_prefix,_expires:365*10});
      window.sessionStorage=$.extend({},cookie_storage,{_prefix:cookie_session_prefix+window.name+'_'});
    }
    window.cookieStorage=$.extend({},cookie_storage);
    // cookieStorage API
    $.cookieStorage=$.extend({},storage,{_type:'cookieStorage',setExpires:function(e){window.cookieStorage.setExpires(e); return this;}});
  }
  
  // Get a new API on a namespace
  $.initNamespaceStorage=function(ns){ return _createNamespace(ns); };
  // localStorage API
  $.localStorage=$.extend({},storage,{_type:'localStorage'});
  // sessionStorage API
  $.sessionStorage=$.extend({},storage,{_type:'sessionStorage'});
  // List of all namespace storage
  $.namespaceStorages={};
  // Remove all items in all storages
  $.removeAllStorages=function(reinit_ns){
    $.localStorage.removeAll(reinit_ns);
    $.sessionStorage.removeAll(reinit_ns);
    if($.cookieStorage) $.cookieStorage.removeAll(reinit_ns);
    if(!reinit_ns){
      $.namespaceStorages={};
    }
  }
})(jQuery);
