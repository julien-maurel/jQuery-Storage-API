function getWindowStorage(name){
  if(testStorage(name)) return window[name];
  return window[name.replace('Storage','CookieStorage')];
}

function testStorage(name){
  if(!window[name]) return false;
  var foo='jsapi';
  try{
    window[name].setItem(foo,foo);
    window[name].removeItem(foo);
    return true;
  }catch(e){
    return false;
  }
}
  
function clearAll(){
  wl.clear();
  ws.clear();
  if($.cookie){
    for(var key in $.cookie()){
      if(key!='') {
        $.removeCookie(key);
      }
    }
  }
}

wl=getWindowStorage('localStorage');
ws=getWindowStorage('sessionStorage');
clearAll();

describe("Jquery.StorageApi", function() {
  /* Basic tests */
  describe('Basics',function(){
    if(testStorage('localStorage')){
      it("Storage are natively avalaible", function() {
        expect(window.localStorage).toEqual(jasmine.any(Object));
        expect(window.sessionStorage).toEqual(jasmine.any(Object));
      });
    }else{
      it("Storage are not natively avalaible but cookie fallback is enable", function() {
        expect(wl).toEqual(jasmine.any(Object));
        expect(ws).toEqual(jasmine.any(Object));
      });
    }
    it("'createNamespace' create a new namespace in all storages",function(){
      var ns=$.initNamespaceStorage('test_ns');
      expect($.namespaceStorages['test_ns']).toEqual(ns);
      expect(wl.getItem('test_ns')).toEqual("{}");
      expect(ws.getItem('test_ns')).toEqual("{}");
      if($.cookie) {
        expect(window.cookieStorage.getItem('test_ns')).toEqual("{}");
      }
    });
  });


  /* Tests on all storage */
  var storage_types=['localStorage','sessionStorage'];
  if($.cookie) {
    storage_types.push('cookieStorage');
  }else{
    console.log("Skipping $.cookieStorage specs. Could not load JQuery $.cookie.");
  }
  storage_types.push('ns.localStorage');
  storage_types.push('ns.sessionStorage');
  if($.cookie) {
    storage_types.push('ns.cookieStorage');
  }

  for(var s in storage_types){
    describe(storage_types[s], function() {
      if(storage_types[s].indexOf('ns.')===0){
        var substorage=storage_types[s].substr(3);
        var storage = $.initNamespaceStorage('test_ns')[substorage];
        var wstorage = {
          getItem:function(n){
            var ret=getWindowStorage(substorage).getItem('test_ns');
            ret=JSON.parse(ret);
            ret=ret[n];
            if(typeof ret=="object") return JSON.stringify(ret);
            else if(typeof ret=="undefined") return null;
            return ret;
          },
          setItem:function(n,v){
            var ret=JSON.parse(getWindowStorage(substorage).getItem('test_ns'));
            try{
              v=JSON.parse(v);
            }catch(e){
            }
            ret[n]=v;
            getWindowStorage(substorage).setItem('test_ns',JSON.stringify(ret));
          }
        };
      }else{
        var substorage=false;
        var storage = $[storage_types[s]];
        var wstorage = getWindowStorage(storage_types[s]);
      }

      beforeEach(function () {
        if(substorage) $.initNamespaceStorage('test_ns');
      });
      afterEach(function () {
        clearAll();
      });

      /* Remove tests */
      it("'removeAll' removes all items", function() {
        wstorage.setItem("itemToDelete1","value1");
        wstorage.setItem("itemToDelete2","value2");
        storage.removeAll();
        if(substorage) $.initNamespaceStorage('test_ns');
        expect(wstorage.getItem("itemToDelete1")).toEqual(null);
        expect(wstorage.getItem("itemToDelete2")).toEqual(null);
      });

      it("'remove' removes one item (by name)", function() {
        wstorage.setItem("itemToDelete","value");
        wstorage.setItem("itemToNotDelete","value");
        storage.remove("itemToDelete");
        expect(wstorage.getItem("itemToDelete")).toEqual(null);
        expect(wstorage.getItem("itemToNotDelete")).toEqual("value");
      });

      it("'remove' removes one item (by chain arguments)", function() {
        wstorage.setItem("itemToDelete",JSON.stringify({"item1":"value1", "item2":"value2"}));
        wstorage.setItem("itemToNotDelete","value");
        storage.remove("itemToDelete","item1");
        expect(JSON.parse(wstorage.getItem("itemToDelete"))).toEqual({"item2":"value2"});
        expect(wstorage.getItem("itemToNotDelete")).toEqual("value");
      });

      it("'remove' removes one item (by js syntax)", function() {
        wstorage.setItem("itemToDelete",JSON.stringify({"item1":"value1", "item2":"value2"}));
        wstorage.setItem("itemToNotDelete","value");
        storage.remove("itemToDelete.item1");
        expect(JSON.parse(wstorage.getItem("itemToDelete"))).toEqual({"item2":"value2"});
        expect(wstorage.getItem("itemToNotDelete")).toEqual("value");
      });

      it("'remove' removes multiple items (by name)", function() {
        wstorage.setItem("itemToDelete1","value1");
        wstorage.setItem("itemToDelete2","value2");
        wstorage.setItem("itemToNotDelete","value");
        storage.remove(["itemToDelete1", "itemToDelete2"]);
        expect(storage.get("itemToDelete1")).toEqual(null);
        expect(storage.get("itemToDelete2")).toEqual(null);
        expect(storage.get("itemToNotDelete")).toEqual("value");
      });

      it("'remove' removes multiple items (by chain arguments)", function() {
        wstorage.setItem("itemToDelete",JSON.stringify({"item1":"value1", "item2":"value2", "item3":"value3"}));
        wstorage.setItem("itemToNotDelete","value");
        storage.remove("itemToDelete",["item1","item2"]);
        expect(JSON.parse(wstorage.getItem("itemToDelete"))).toEqual({"item3":"value3"});
        expect(wstorage.getItem("itemToNotDelete")).toEqual("value");
      });

      it("'remove' removes multiple items (by js syntax)", function() {
        wstorage.setItem("itemToDelete",JSON.stringify({"prop1":{"item1":"value1", "item2":"value2", "item3":"value3"}}));
        wstorage.setItem("itemToNotDelete","value");
        storage.remove("itemToDelete.prop1",["item1","item2"]);
        expect(JSON.parse(wstorage.getItem("itemToDelete")).prop1).toEqual({"item3":"value3"});
        expect(wstorage.getItem("itemToNotDelete")).toEqual("value");
      });


      /* Set tests */
      it("'set' stores one item (by name)", function() {
        var ret=storage.set("item", "value");
        expect(ret).toEqual("value");
        expect(wstorage.getItem("item")).toEqual("value");
      });

      it("'set' stores one item (by chain arguments)", function() {
        var ret=storage.set("item", "itemprop", "value");
        expect(ret).toEqual({"itemprop":"value"});
        expect(JSON.parse(wstorage.getItem("item"))).toEqual({"itemprop":"value"});
      });

      it("'set' stores one item (by js syntax)", function() {
        var ret=storage.set("item.itemprop", "value");
        expect(ret).toEqual({"itemprop":"value"});
        expect(JSON.parse(wstorage.getItem("item"))).toEqual({"itemprop":"value"});
      });

      it("'set' stores multiple items (by name)", function() {
        var ret=storage.set({"item1":"value1","item2":"value2"});
        expect(ret).toEqual({"item1":"value1","item2":"value2"});
        expect(wstorage.getItem("item1")).toEqual("value1");
        expect(wstorage.getItem("item2")).toEqual("value2");
      });

      it("'set' stores multiple items (by chain arguments)", function() {
        var ret=storage.set("item","prop1",{"item1":"value1","item2":"value2"});
        expect(ret).toEqual({"prop1":{"item1":"value1","item2":"value2"}});
        expect(JSON.parse(wstorage.getItem("item")).prop1.item1).toEqual("value1");
        expect(JSON.parse(wstorage.getItem("item")).prop1.item2).toEqual("value2");
      });

      it("'set' stores multiple items (by js syntax)", function() {
        var ret=storage.set("item.prop1",{"item1":"value1","item2":"value2"});
        expect(ret).toEqual({"prop1":{"item1":"value1","item2":"value2"}});
        expect(JSON.parse(wstorage.getItem("item")).prop1.item1).toEqual("value1");
        expect(JSON.parse(wstorage.getItem("item")).prop1.item2).toEqual("value2");
      });

      /* Get tests */
      it("'get' retrieves one item (by name)", function() {
        storage.set("item", "value");
        expect(storage.get("item")).toEqual("value");
      });

      it("'get' retrieves one item (by chain arguments)", function() {
        storage.set("item", "itemprop", "value");
        expect(storage.get("item", "itemprop")).toEqual("value");
      });

      it("'get' retrieves one item (by js syntax)", function() {
        storage.set("item", "itemprop", "value");
        expect(storage.get("item.itemprop")).toEqual("value");
      });

      it("'get' retrieves multiple items (by name)", function() {
        storage.set("item1", "value1");
        storage.set("item2", "value2");
        storage.set("item3", "value3");
        expect(storage.get(["item1", "item3"])).toEqual({"item1":"value1", "item3":"value3"});
      });

      it("'get' retrieves multiple items (by chain arguments)", function() {
        storage.set("item", {"itemprop1":"value1","itemprop2":"value2","itemprop3":"value3"});
        expect(storage.get("item",["itemprop1","itemprop3"])).toEqual({"itemprop1":"value1", "itemprop3":"value3"});
      });

      it("'get' retrieves multiple items (by js syntax)", function() {
        storage.set("item", "item1", {"item1prop1":"value1","item1prop2":"value2","item1prop3":"value3"});
        expect(storage.get("item.item1",["item1prop1","item1prop3"])).toEqual({"item1prop1":"value1", "item1prop3":"value3"});
      });

      /* alwaysUseJson tests */
      it("'alwaysUseJson' activated", function() {
        $.alwaysUseJsonInStorage(true);

        var ret = storage.set("item", 1);
        expect(ret).toEqual(1);
        expect(storage.get("item")).toEqual(1);

        var ret = storage.set("item", "1");
        expect(ret).toEqual("1");
        expect(storage.get("item")).toEqual("1");

        $.alwaysUseJsonInStorage(false);
      });
      
      /* Keys tests */
      it("'keys' returns the keys associated with a storage", function() {
        storage.set("item1", "value1");
        storage.set("item2", "value2");
        expect(storage.keys()).toEqual(["item1", "item2"]);
      });

      it("'keys' returns the keys associated with an item in a storage (by name)", function() {
        storage.set("item", {"item1":"value1", "item2":"value2"});
        expect(storage.keys("item")).toEqual(["item1", "item2"]);
      });

      it("'keys' returns the keys associated with an item in a storage (by chain arguments)", function() {
        storage.set("item", "itemprop", {"item1":"value1", "item2":"value2"});
        expect(storage.keys("item","itemprop")).toEqual(["item1", "item2"]);
      });

      it("'keys' returns the keys associated with an item in a storage (by js syntax)", function() {
        storage.set("item.itemprop", {"item1":"value1", "item2":"value2"});
        expect(storage.keys("item","itemprop")).toEqual(["item1", "item2"]);
      });

      /* isEmpty tests */
      it("'isEmpty' returns true if there is no items in storage", function() {
        expect(storage.isEmpty()).toBeTruthy();
        storage.set("item", "value");
        expect(storage.isEmpty()).toBeFalsy();
      });

      it("'isEmpty' returns true if item in storage is empty (by name)", function() {
        storage.set("item1", "value");
        storage.set("item2", "");
        storage.set("item3", []);
        storage.set("item4", [1]);
        storage.set("item5", {});
        storage.set("item6", {"prop":"value"});
        expect(storage.isEmpty("item1")).toBeFalsy();
        expect(storage.isEmpty("item2")).toBeTruthy();
        expect(storage.isEmpty("item3")).toBeTruthy();
        expect(storage.isEmpty("item4")).toBeFalsy();
        expect(storage.isEmpty("item5")).toBeTruthy();
        expect(storage.isEmpty("item6")).toBeFalsy();
      });

      it("'isEmpty' returns true if item in storage is empty (by chain arguments)", function() {
        storage.set("item", "prop1", "value1");
        expect(storage.isEmpty("item","prop1")).toBeFalsy();
        expect(storage.isEmpty("item","prop2")).toBeTruthy();
      });

      it("'isEmpty' returns true if item in storage is empty (by js syntax)", function() {
        storage.set("item", "prop1", "value1");
        expect(storage.isEmpty("item.prop1")).toBeFalsy();
        expect(storage.isEmpty("item.prop2")).toBeTruthy();
      });

      it("'isEmpty' returns true if multiple items in storage are empty (by name)", function() {
        storage.set({"item1":"value1","item2":"value2","item3":"","item4":""});
        expect(storage.isEmpty(["item1","item2"])).toBeFalsy();
        expect(storage.isEmpty(["item3","item4"])).toBeTruthy();
        expect(storage.isEmpty(["item1","item3"])).toBeFalsy();
      });

      it("'isEmpty' returns true if multiple items in storage are empty (by chain arguments)", function() {
        storage.set("item1","prop1",{"item1":"value1","item2":"value2","item3":"","item4":""});
        expect(storage.isEmpty("item1","prop1",["item1","item2"])).toBeFalsy();
        expect(storage.isEmpty("item1","prop1",["item3","item4"])).toBeTruthy();
        expect(storage.isEmpty("item1","prop1",["item1","item3"])).toBeFalsy();
      });

      it("'isEmpty' returns true if multiple items in storage are empty (by js syntax)", function() {
        storage.set("item1","prop1",{"item1":"value1","item2":"value2","item3":"","item4":""});
        expect(storage.isEmpty("item1.prop1",["item1","item2"])).toBeFalsy();
        expect(storage.isEmpty("item1.prop1",["item3","item4"])).toBeTruthy();
        expect(storage.isEmpty("item1.prop1",["item1","item3"])).toBeFalsy();
      });


      /* isSet tests */
      it("'isSet' returns true if item in storage exists (by name)", function() {
        storage.set("item1", "value");
        storage.set("item2", null);
        storage.set("item3", "");
        expect(storage.isSet("item1")).toBeTruthy();
        expect(storage.isSet("item2")).toBeFalsy();
        expect(storage.isSet("item3")).toBeTruthy();
        expect(storage.isSet("item4")).toBeFalsy();
      });

      it("'isSet' returns true if item in storage exists (by chain arguments)", function() {
        storage.set("item", "prop1", "value1");
        expect(storage.isSet("item","prop1")).toBeTruthy();
        expect(storage.isSet("item","prop2")).toBeFalsy();
      });

      it("'isSet' returns true if item in storage exists (by js syntax)", function() {
        storage.set("item", "prop1", "value1");
        expect(storage.isSet("item.prop1")).toBeTruthy();
        expect(storage.isSet("item.prop2")).toBeFalsy();
      });

      it("'isSet' returns true if multiple items in storage exist (by name)", function() {
        storage.set({"item1":"value1","item2":"value2","item3":"","item4":null});
        expect(storage.isSet(["item1","item2"])).toBeTruthy();
        expect(storage.isSet(["item1","item3"])).toBeTruthy();
        expect(storage.isSet(["item1","item4"])).toBeFalsy();
      });

      it("'isSet' returns true if multiple items in storage exist (by chain arguments)", function() {
        storage.set("item1","prop1",{"item1":"value1","item2":"value2","item3":"","item4":null});
        expect(storage.isSet("item1","prop1",["item1","item2"])).toBeTruthy();
        expect(storage.isSet("item1","prop1",["item1","item3"])).toBeTruthy();
        expect(storage.isSet("item1","prop1",["item1","item4"])).toBeFalsy();
      });

      it("'isSet' returns true if multiple items in storage exist (by js syntax)", function() {
        storage.set("item1","prop1",{"item1":"value1","item2":"value2","item3":"","item4":null});
        expect(storage.isSet("item1.prop1",["item1","item2"])).toBeTruthy();
        expect(storage.isSet("item1.prop1",["item1","item3"])).toBeTruthy();
        expect(storage.isSet("item1.prop1",["item1","item4"])).toBeFalsy();
      });
    });
  }


  /* Specific tests */
  describe("Specific cases", function() {
    clearAll();
    it("'removeAll' reinitialize namespace if true is given in arguments",function(){
      $.localStorage.set("item","value");
      $.sessionStorage.set("item","value");
      var ns=$.initNamespaceStorage("test_ns");
      ns.localStorage.set("item","value");
      ns.sessionStorage.set("item","value");
      $.localStorage.removeAll(true);
      expect($.localStorage.get("item")).toEqual(null);
      expect($.sessionStorage.get("item")).toEqual("value");
      expect(ns.localStorage.get("item")).toEqual(null);
      expect(ns.sessionStorage.get("item")).toEqual("value");
    });

    it("'$.removeAllStorages' remove all items in all storages",function(){
      $.localStorage.set("item","value");
      $.sessionStorage.set("item","value");
      var ns=$.initNamespaceStorage("test_ns");
      $.removeAllStorages();
      expect($.localStorage.get("item")).toEqual(null);
      expect($.sessionStorage.get("item")).toEqual(null);
      expect($.localStorage.get("test_ns")).toEqual(null);
      expect($.sessionStorage.get("test_ns")).toEqual(null);
      if($.cookie){
        expect($.cookieStorage.get("item")).toEqual(null);
        expect($.cookieStorage.get("test_ns")).toEqual(null);
      }
      expect($.namespaceStorages).toEqual({});
    });

    it("'$.removeAllStorages' remove all items in all storages and reinitialize namespace if true is given in arguments",function(){
      $.localStorage.set("item","value");
      $.sessionStorage.set("item","value");
      var ns=$.initNamespaceStorage("test_ns");
      $.removeAllStorages(true);
      expect($.localStorage.get("item")).toEqual(null);
      expect($.sessionStorage.get("item")).toEqual(null);
      expect($.localStorage.get("test_ns")).toEqual({});
      expect($.sessionStorage.get("test_ns")).toEqual({});
      if($.cookie){
        expect($.cookieStorage.get("item")).toEqual(null);
        expect($.cookieStorage.get("test_ns")).toEqual({});
      }
      expect($.namespaceStorages["test_ns"]).toEqual(ns);
    });
  });
});
