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
Get a variable from a storage

    storage.get('foo') // Get storage.foo
    storage.get('foo','foo2','foo3'...) // Get storage.foo.foo2.foo3...
    storage.get(['foo','foo2']) // Get storage.foo and storage.foo2 in an object ({foo:storage.foo,foo2:storage.foo2})

### `set()`
Set a variable in a storage

    storage.set('foo','value') // Set storage.foo to "value"
    storage.set('foo','foo2','foo3'...,'value') // Set storage.foo.foo2.foo3... to "value"
    storage.set({'foo':'value,'foo2':'value2'}) // Set storage.foo to "value" and storage.foo2 to "value2"

### `remove()`
Delete a variable in a storage

    storage.remove('foo') // Delete storage.foo
    storage.remove('foo','foo2','foo3'...) // Delete storage.foo.foo2.foo3...
    storage.remove(['foo','foo2']) // Delete storage.foo and storage.foo2

### `removeAll()`
Truncate the storage

    storage.removeAll() // Delete all variables from the storage

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



Migration
---------

### 1.2.x => 1.3.0
To resolve an issue on IE8 that doesn't like function named "delete", we had to change name of delete functions.  
So public methods "delete" and "deleteAll" become "remove" and "removeAll".  
Sorry for inconvenience...
