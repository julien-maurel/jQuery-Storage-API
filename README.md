jQuery Storage API
==================

jQuery Storage API is a plugin that simplify access to storages (HTML5) & cookies, add namespace storage functionality and provide compatiblity for old browsers with cookies!

Functionalities:
* To store object easily, encode/decode it with JSON automatically
* Ability to define namespace and use it as a specific storage
* Magic getter and setter to have access at an infinite object level with one call
* Add jquery.cookie and manage your cookies with this API
* You want use storage on old browsers? Add jquery.cookie & JSON and JQuery Storage API use cookies to simulate storage!


Storages
--------
#### Local storage
    $.localStorage

#### Session storage
    $.sessionStorage

#### Cookie storage (only if jquery.cookie added)
    $.cookieStorage

#### Namespace storage
    ns=$.initNamespaceStorage('ns_name');
    ns.localStorage // Namespace in localStorage
    ns.sessionStorage // Namespace in sessionStorage


Public methods on storage
-------------------------

Public methods are usable on all storage objects ($.localStorage, $.sessionStorage or object return by $.initNamespaceStorage)

    storage=$.localStorage

### `get()`
Get a variable from a storage.

    storage.get('foo') // Get storage.foo
    storage.get(['foo','foo2']) // Get storage.foo and storage.foo2 in an object ({foo:storage.foo,foo2:storage.foo2})

### `set()`
Set a variable in a storage.

    storage.set('foo','value') // Set storage.foo to "value"
    storage.set({'foo':'value,'foo2':'value2'}) // Set storage.foo to "value" and storage.foo2 to "value2"

### `delete()`
Delete a variable in a storage.

    storage.delete('foo') // Delete storage.foo
    storage.delete(['foo','foo2']) // Delete storage.foo and storage.foo2

### `deleteAll()`
Truncate the storage. When using Namespace storage, delete only the variables in the namespace unless true is passed in.

    storage.deleteAll() // Delete all variables from the storage
    storage.deleteAll(false) //Delete only the variables inside the namespace storage
    storage.deleteAll(true) // Delete all variables inside and outside of the namespace storage

### `isEmpty()`
Returns true if there are no variables in storage. When using Namespace storage, return true if there are no variables in the namespace. 

    storage.isEmpty() // Returns true if items in storage

### `keys()`
Returns all the keys of the variables in storage. When using Namespace storage, return only the keys for the variables in the namespace. 

    storage.keys() // Returns all the keys of the variables in the storage

### `setExpires()`
Only on cookieStorage. Set expires date in days (default value is null, cookie is valid for session only; only values setted after setExpires() call be affected) 

    storage.setExpires(10) // Set expiry date to today + 10 days

This method return the storage object, so you can do :

    storage.setExpires(10).set('foo','value') // Set expiry date to today + 10 days and set a new cookie with this expiration



Compatibility
-------------

JQuery Storage API is compatible with all browsers that support storage and JSON natively.

If you want more compatibility :
* Add jquery.cookie (https://github.com/carhartl/jquery-cookie) before this plugin and storage will work on every browsers that support JSON natively!
* You want more? Add json2.js (https://github.com/douglascrockford/JSON-js) too and storage will be enable on every browsers!
