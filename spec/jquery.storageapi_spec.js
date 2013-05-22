describe("Jquery.StorageApi", function() {

  describe("local storage", function() {   
    var storage = $.localStorage;

    beforeEach(function () {
      storage.deleteAll();
    });

    it("'keys' returns the keys associated with stored items", function() {
      storage.set("item1", "value1");
      storage.set("item2", "value2");
      expect(storage.keys()).toEqual(["item1", "item2"]);
    });
    
    it("'get' retrieves a value by key", function() {
      storage.set("item", "value");
      expect(storage.get("item")).toEqual("value");
    });

    it("'get' retrieves values for multiple keys", function() {
      storage.set("item1", "value1");
      storage.set("item2", "value2");
      storage.set("item3", "value3");
      expect(storage.get(["item1", "item3"])).toEqual({"item1":"value1", "item3":"value3"});
    });

    it("'set' stores a value", function() {
      storage.set("item", "value"); 
      expect(storage.get("item")).toEqual("value");
    });

    it("'set' stores multiple values", function() {
      storage.set({"item1":"value1","item2":"value2"});
      expect(storage.get("item1")).toEqual("value1");
      expect(storage.get("item2")).toEqual("value2");
    });

    it("'delete' removes a stored item by key", function() {
      storage.set("itemToDelete", "value");
      expect(storage.get("itemToDelete")).toEqual("value");
      storage.delete("itemToDelete");
      expect(storage.get("itemToDelete")).toEqual(null);
    });

    it("'delete' removes multiple stored items by key", function() {
      storage.set("itemToDelete1", "value1");
      storage.set("itemToDelete2", "value2");
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.delete(["itemToDelete1", "itemToDelete2"]);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete2")).toEqual(null);
    });
  
    it("'deleteAll' removes all stored items", function() {
      expect(storage.isEmpty()).toBeTruthy();
      storage.set("itemToDelete1", "value1");
      storage.set("itemToDelete2", "value2");
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete1")).toEqual(null);
    });

    it("'isEmpty' returns true if there are no items in storage", function() {
      window.localStorage.clear();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in storage", function() {
      storage.set("item", "value");
      expect(storage.isEmpty()).toBeFalsy();
    });
  });

  describe("local storage using namespaces", function() {   
    var storage = $.initNamespaceStorage("test_ns").localStorage;
    
    beforeEach(function () {
      storage.deleteAll(true);
    });

    it("'keys' returns the keys associated with stored items in the namespace", function() {
      window.localStorage.setItem("item", "shouldNotBeReturned");
      storage.set("item1", "value1");
      storage.set("item2", "value2");
      expect(storage.keys()).toEqual(["item1", "item2"]);
    });

    it("'get' retrieves a value by item", function() {
      hash = {'item':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.get("item")).toEqual("value");
    });

    it("'get' retrieves values for multiple keys", function() {
      hash = {'item1':'value1', 'item2':'value2', 'item3':'value3'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.get(["item1", "item3"])).toEqual({"item1":"value1", "item3":"value3"});
    });
    
    it("'set' stores a value", function() {
      hash = {'item':'value'};
      storage.set("item", "value"); 
      expect(window.localStorage.getItem("test_ns")).toEqual(JSON.stringify(hash));
    });

    it("'set' stores multiple values", function() {
      storage.set({"item1":"value1","item2":"value2"});
      expect(storage.get("item1")).toEqual("value1");
      expect(storage.get("item2")).toEqual("value2");
    });

    it("'delete' removes a stored item by key", function() {
      hash = {'itemToDelete':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.get("itemToDelete")).toEqual("value");
      storage.delete("itemToDelete");
      expect(storage.get("itemToDelete")).toEqual(null);
    });

    it("'delete' removes multiple stored items by key", function() {
      storage.set("itemToDelete1", "value1");
      storage.set("itemToDelete2", "value2");
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.delete(["itemToDelete1", "itemToDelete2"]);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete2")).toEqual(null);
    });

    it("'deleteAll' removes all stored items only in namespace", function() {
      expect(storage.isEmpty()).toBeTruthy();
      window.localStorage.setItem("item", "shouldNotBeDeleted");
      hash = {'itemToDelete1':'value1', 'itemToDelete2':'value2'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
     
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(window.localStorage.getItem("item")).toEqual("shouldNotBeDeleted");
    });

    it("'deleteAll' removes all stored items inside and outside of namespace", function() {
      expect(storage.isEmpty()).toBeTruthy();
      window.localStorage.setItem("nonNsItemToDelete", "shouldBeDeleted");
      hash = {'itemToDelete1':'value1', 'itemToDelete2':'value2'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
     
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.deleteAll(true);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(window.localStorage.getItem("nonNsItemToDelete")).toEqual(null);
    });

    it("'isEmpty' returns true if there are no items in namespace", function() {
      window.localStorage.setItem("item", "notInNamespace");
      storage.deleteAll();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in namespace", function() {
      window.localStorage.clear();
      hash = {'itemToDelete':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.isEmpty()).toBeFalsy();
    });
  });

  describe("session storage", function() {   
    var storage = $.sessionStorage;

    beforeEach(function () {
      storage.deleteAll();
    });

    it("'keys' returns the keys associated with stored items", function() {
      storage.set("item1", "value1");
      storage.set("item2", "value2");
      expect(storage.keys()).toEqual(["item1", "item2"]);
    });

    it("'get' retrieves a value by key", function() {
      window.sessionStorage.setItem("item", "value");
      expect(storage.get("item")).toEqual("value");
    });

    it("'get' retrieves values for multiple keys", function() {
      storage.set("item1", "value1");
      storage.set("item2", "value2");
      storage.set("item3", "value3");
      expect(storage.get(["item1", "item3"])).toEqual({"item1":"value1", "item3":"value3"});
    });

    it("'set' stores a value", function() {
      storage.set("item", "value"); 
      expect(window.sessionStorage.getItem("item")).toEqual("value");
    });

    it("'set' stores multiple values", function() {
      storage.set({"item1":"value1","item2":"value2"});
      expect(storage.get("item1")).toEqual("value1");
      expect(storage.get("item2")).toEqual("value2");
    });

    it("'delete' removes a stored item by key", function() {
      window.sessionStorage.setItem("itemToDelete", "value");
      expect(storage.get("itemToDelete")).toEqual("value");
      storage.delete("itemToDelete");
      expect(storage.get("itemToDelete")).toEqual(null);
    });

    it("'delete' removes multiple stored items by key", function() {
      storage.set("itemToDelete1", "value1");
      storage.set("itemToDelete2", "value2");
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.delete(["itemToDelete1", "itemToDelete2"]);
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete2")).toEqual(null);
    });

    it("'deleteAll' removes all stored items", function() {
      expect(storage.isEmpty()).toBeTruthy();
      window.sessionStorage.setItem("itemToDelete1", "value1");
      window.sessionStorage.setItem("itemToDelete2", "value2");
      expect(storage.get("itemToDelete1")).toEqual("value1");
      expect(storage.get("itemToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("itemToDelete1")).toEqual(null);
      expect(storage.get("itemToDelete1")).toEqual(null);
    });

    it("'isEmpty' returns true if there are no items in storage", function() {
      window.sessionStorage.clear();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in storage", function() {
      window.sessionStorage.setItem("item", "value");
      expect(storage.isEmpty()).toBeFalsy();
    });
  });
 
  if($.cookie) {
    describe("cookie storage", function() {   
      var storage = $.cookieStorage;

      beforeEach(function () {
        storage.deleteAll();
      });

      it("'keys' returns the keys associated with stored items", function() {
        storage.set("item1", "value1");
        storage.set("item2", "value2");
        expect(storage.keys()).toEqual(["item1", "item2"]);
      });

      it("'get' retrieves a value by key", function() {
        storage.set("item", "value");
        expect(storage.get("item")).toEqual("value");
      });

      it("'get' retrieves values for multiple keys", function() {
        storage.set("item1", "value1");
        storage.set("item2", "value2");
        storage.set("item3", "value3");
        expect(storage.get(["item1", "item3"])).toEqual({"item1":"value1", "item3":"value3"});
      });
      it("'set' stores a value", function() {
        storage.set("item", "value"); 
        expect(storage.get("item")).toEqual("value");
      });

      it("'set' stores multiple values", function() {
        storage.set({"item1":"value1","item2":"value2"});
        expect(storage.get("item1")).toEqual("value1");
        expect(storage.get("item2")).toEqual("value2");
      });

      it("'delete' removes a stored item by key", function() {
        storage.set("itemToDelete", "value");
        expect(storage.get("itemToDelete")).toEqual("value");
        storage.delete("itemToDelete");
        expect(storage.get("itemToDelete")).toEqual(null);
      });

      it("'delete' removes multiple stored items by key", function() {
        storage.set("itemToDelete1", "value1");
        storage.set("itemToDelete2", "value2");
        expect(storage.get("itemToDelete1")).toEqual("value1");
        expect(storage.get("itemToDelete2")).toEqual("value2");
        storage.delete(["itemToDelete1", "itemToDelete2"]);
        expect(storage.get("itemToDelete1")).toEqual(null);
        expect(storage.get("itemToDelete2")).toEqual(null);
      });

      it("'deleteAll' removes all stored items", function() {
        expect(storage.isEmpty()).toBeTruthy();
        storage.set("itemToDelete1", "value1");
        storage.set("itemToDelete2", "value2");
        expect(storage.get("itemToDelete1")).toEqual("value1");
        expect(storage.get("itemToDelete2")).toEqual("value2");
        storage.deleteAll();
        expect(storage.get("itemToDelete1")).toEqual(null);
        expect(storage.get("itemToDelete1")).toEqual(null);
      });

      it("'isEmpty' returns true if there are no items in storage", function() {
        storage.deleteAll();
        expect(storage.isEmpty()).toBeTruthy();
      });

      it("'isEmpty' returns false if there are items in storage", function() {
        storage.set("item", "value");
        expect(storage.isEmpty()).toBeFalsy();
      });
    });
  } else {
    console.log("Skipping $.cookieStorage specs. Could not load JQuery $.cookie.");
  }
});
