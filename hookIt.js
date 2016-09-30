"use strict";

function hookIt(subject, preName, postName) {
    preName = preName || "pre";
    postName = postName || "after";
    
    function Hook(subject) {
        this._subj = subject;
        this._pre = {};
        this._after = {};
    }
    
    Hook.prototype = Object.create(Object.getPrototypeOf(subject));
    
    Hook.prototype[preName] = function(fName, fn) {
        if(this._pre[fName]) {
            this._pre[fName].push(fn);
        } else {
            this._pre[fName] = [fn];
        }
    }
    
    Hook.prototype[postName] = function(fName, fn) {
        if(this._after[fName]) {
            this._after[fName].push(fn);
        } else {
            this._after[fName] = [fn];
        }
    }
    
    for(let prop in subject) {
        if(typeof subject[prop] !== "function") continue;

        Hook.prototype[prop] = function() {
            var args = arguments || [];
            var curHookIndex = 0;

            // Iterate through all hooks and subject's function
            var next = function() {
                var curHookFn = this._pre[prop] ? this._pre[prop][curHookIndex++] : null;
                if(!curHookFn) {
                    Array.prototype.pop.call(args); // Remove next callback from argument array 
                    curHookFn = this._subj[prop];
                }
                return curHookFn.apply(subject, args);
            }.bind(this); // Has to be bound because we cannot know the call site of this function

            Array.prototype.push.call(args, next);
            return next(); // Initiate iteration
        }
  
     }
   
    return new Hook(subject);
}