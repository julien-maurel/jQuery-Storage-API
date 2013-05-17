describe("Jquery.StorageApi", function() {

  describe("local storage", function() {   
    var storage = $.localStorage;

    it("'get' retrieves a value by key", function() {
      window.localStorage.setItem("key", "value");
      expect(storage.get("key")).toEqual("value");
    });

    it("'set' stores a value", function() {
      storage.set("key", "value"); 
      expect(window.localStorage.getItem("key")).toEqual("value");
    });

    it("'delete' removes a stored item by key", function() {
      window.localStorage.setItem("keyToDelete", "value");
      expect(storage.get("keyToDelete")).toEqual("value");
      storage.delete("keyToDelete");
      expect(storage.get("keyToDelete")).toEqual(null);
    });

    it("'deleteAll' removes all stored items", function() {
      window.localStorage.setItem("keyToDelete1", "value1");
      window.localStorage.setItem("keyToDelete2", "value2");
      expect(storage.get("keyToDelete1")).toEqual("value1");
      expect(storage.get("keyToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("keyToDelete1")).toEqual(null);
      expect(storage.get("keyToDelete1")).toEqual(null);
    });

    it("'isEmpty' returns true if there are no items in storage", function() {
      window.localStorage.clear();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in storage", function() {
      window.localStorage.setItem("key", "value");
      expect(storage.isEmpty()).toBeFalsy();
    });
  });

  describe("local storage using namespaces", function() {   
    var storage = $.initNamespaceStorage("test_ns").localStorage;

    it("'get' retrieves a value by key", function() {
      hash = {'key':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.get("key")).toEqual("value");
    });

    it("'set' stores a value", function() {
      storage.set("key", "value"); 
      expect(window.localStorage.getItem("key")).toEqual("value");
    });

    it("'delete' removes a stored item by key", function() {
      hash = {'keyToDelete':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.get("keyToDelete")).toEqual("value");
      storage.delete("keyToDelete");
      expect(storage.get("keyToDelete")).toEqual(null);
    });

    it("'deleteAll' removes all stored items only in namespace", function() {
      window.localStorage.setItem("key", "shouldNotBeDeleted");
      hash = {'keyToDelete1':'value1', 'keyToDelete2':'value2'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
     
      expect(storage.get("keyToDelete1")).toEqual("value1");
      expect(storage.get("keyToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("keyToDelete1")).toEqual(null);
      expect(storage.get("keyToDelete1")).toEqual(null);
      expect(window.localStorage.getItem("key")).toEqual("shouldNotBeDeleted");
    });

    it("'isEmpty' returns true if there are no items in namespace", function() {
      window.localStorage.setItem("key", "notInNamespace");
      storage.deleteAll();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in namespace", function() {
      window.localStorage.clear();
      hash = {'keyToDelete':'value'};
      window.localStorage.setItem("test_ns", JSON.stringify(hash));
      expect(storage.isEmpty()).toBeFalsy();
    });
  });

  describe("session storage", function() {   
    var storage = $.sessionStorage;

    it("'get' retrieves a value by key", function() {
      window.sessionStorage.setItem("key", "value");
      expect(storage.get("key")).toEqual("value");
    });

    it("'set' stores a value", function() {
      storage.set("key", "value"); 
      expect(window.sessionStorage.getItem("key")).toEqual("value");
    });

    it("'delete' removes a stored item by key", function() {
      window.sessionStorage.setItem("keyToDelete", "value");
      expect(storage.get("keyToDelete")).toEqual("value");
      storage.delete("keyToDelete");
      expect(storage.get("keyToDelete")).toEqual(null);
    });

    it("'deleteAll' removes all stored items", function() {
      window.sessionStorage.setItem("keyToDelete1", "value1");
      window.sessionStorage.setItem("keyToDelete2", "value2");
      expect(storage.get("keyToDelete1")).toEqual("value1");
      expect(storage.get("keyToDelete2")).toEqual("value2");
      storage.deleteAll();
      expect(storage.get("keyToDelete1")).toEqual(null);
      expect(storage.get("keyToDelete1")).toEqual(null);
    });

    it("'isEmpty' returns true if there are no items in storage", function() {
      window.sessionStorage.clear();
      expect(storage.isEmpty()).toBeTruthy();
    });

    it("'isEmpty' returns false if there are items in storage", function() {
      window.sessionStorage.setItem("key", "value");
      expect(storage.isEmpty()).toBeFalsy();
    });
  });
});
