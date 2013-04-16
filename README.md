JQuery Storage API
==================

JQuery Storage API is a plugin to simplify access to local and session storage in HTML5.
This plugin encode and decode objects automaticly on JSON format, can be used with namespace...


Storages
--------

$.localStorage : API to the local storage
$.sessionStorage : API to the session storage
ns=$.initNamespaceStorage : return a namespace
ns.localStorage : API to the namespace on local storage
ns.sessionStorage : API to the namespace on session storage


Methods on a storage
--------------------

get(a,b,c...) : get a variable from the storage
set(a,b,c...,value) : set a variable in the storage
delete(a,b,c...) : delete a variable from the storage
deleteAll() : delete all variables from the storage


Examples
--------

    $.localStorage.set('foo','value'); // Set variable foo to value in localStorage
    $.localStorage.set('foo','bar',...,'value'); // Set variable foo.bar... to value in localStorage
    $.localStorage.set('foo','bar',...); // Get variable foo.bar... from localStorage
    
    var ns=$.initNamespaceStorage('namespace_name');
    ns.localStorage.set('foo','bar',...,'value'); // Set variable foo.bar... to value in ns namespace of localStorage
    ns.localStorage.get('foo','bar'...); // Get variable foo.bar... from ns namespace in localStorage
