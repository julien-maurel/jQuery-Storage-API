JQuery Storage API
==================

JQuery Storage API is a plugin to simplify access to local and session storage in HTML5.

Functionalities:
* To store object easily, encod/decode it with JSON automatically
* Ability to define namespace and use it as a specific storage
* Magic getter and setter to have access at an infinite object level with one line


Storages
--------
#### Local storage
    $.localStorage

#### Session storage
    $.sessionStorage
    
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

### `delete()`
Delete a variable in a storage

    storage.delete('foo') // Delete storage.foo
    storage.delete('foo','foo2','foo3'...) // Delete storage.foo.foo2.foo3...
    storage.delete(['foo','foo2']) // Delete storage.foo and storage.foo2
    
### `deleteAll()`
Truncate the storage

    storage.deleteAll() // Delete all variables from the storage
