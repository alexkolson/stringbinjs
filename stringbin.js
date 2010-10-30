/*
 * This is a JS interface for the awesome simple key-value string storage made by Michael Grace. www.stringbin.com 
 * This version is for including as an external resource in KRL apps. I wish I could make the KRL app version wrapped in a closure, ie the 
 * standard way of doing plugins, but our runtime (including external resources) doesnt treat it properly then. 
 *
 * I plan to continue to improve this, if you would like to as well, feel free!! I will soon have this up as a github repository, so that will
 * make that easier. 
 *
 * Author: Alex Olson
 * Last Updated: 10/29/10
 *
 * How to use:
 *
 * To use this plugin, simply include this file in your krl apps as an external resource, and create a new StringBin javascript object, like so:
 * var stringBinObj = new StringBin("yourpersonalstringbinpin"); 
 * now to write to that pin's stringbin, you use:
 * stringBinObj.write("nameofkey", "valueforkey", callbackfunction);
 * this will write "valueforkey" to "nameofkey" and call the callbackfunction. At this time, you MUST pass all StringBin functions a callback
 * as the third parameter. In the case of write and destroy, your callback function is passesd an error parameter, it is false if there are 
 * no errors and contains the error(s) as a string or an array of strings if there are any. 
 *
 * In the case of the read function, your callback function is passed the same error parameter as its first parameter, but it also gets passes a 
 * second parameter, the value that was retrieved from stringbin if the read call was successful.
 *
 * To retrieve values from stringbin you do:
 * stringBinObj.read("nameofKey",callback);
 * this will pass the value for nameofkey as the second parameter of your callbck function
 *
 * To destroy values from stringbin you do:
 * stringBinObj.destroy("nameofkey", callbackfunction)
 * your callback function will be passed the error parameter
 *
 * Examples:
 *
 * var myData = new StringBin("myPin");
 * myData.write("krl", "is awesome", function(error) {
 *      if (error) {
 *          console.log(error);
 *      } else {
 *          console.log("success writing to stringbin");
 *      }
 *  });
 *
 *  myData.read("krl", function(error, returnedString) {
 *      if (error) {
 *          console.log("error");
 *      } else {
 *          console.log("The string is: " + returnedString);
 *      }
 *  });
 *
 *  myData.destroy("krl", function(error) {
 *      if (error) {
 *          console.log(error);
 *      } else {
 *          console.log("success destroying key");
 *      }
 *  });
 *
 *
 * Licensed under the MIT license:
 *
 * The MIT License
 * 
 * Copyright (c) 2010 Alex Kellen Olson
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 */

function StringBin(pin) {
    this.pin = pin;
    this.readUrl = "http://api.stringbin.com/1/read?pin="+ pin;
    this.writeUrl = "http://api.stringbin.com/1/write?pin="+ pin;
    return true;
}

StringBin.prototype.logger = function(toLog) {
    if (console && console.log && console.warn) {
        console.log(toLog);
    }
};

StringBin.prototype.buildUrl = function(params) {
    var url = this[params.operation + "Url"];
    $KOBJ.each(params, function(k,v) {
        url += "&";
        url += k + "=" + v;
    });
    return url;
};

StringBin.prototype.read = function(key,cb) {
    var url = this.buildUrl({"operation":"read","key":key,"callback":"?"});
    var that = this;
    $KOBJ.getJSON(url, function(data) {
        if (data.error === "true") {
            that.logger("error retrieving data from StringBin, something went wrong.");
            that.logger(data.errors);
            cb(data.errors);
        } else if (data.string === "''") {
            that.logger("error retrieving data from StringBin, key does not exist.");
            cb("key does not exist");
        } else {
            that.logger("success retrieving data from StringBin.");
            cb(false, data.string);
        }
    });
};

StringBin.prototype.write = function(key,value,cb) {
    var url = this.buildUrl({"operation":"write","key":key,"value":value,"callback":"?"});
    var that = this;
    $KOBJ.getJSON(url, function(data) {
        if (data.error === "true") {
            that.logger("error storing data in StringBin.");
            that.logger(data.errors);
            cb(data.errors);
        } else {
            that.logger("success storing data in StringBin.");
            cb(false);
        }
    });
};

StringBin.prototype.destroy = function(key,cb) {
    var url = this.buildUrl({"operation":"write","key":key,"value":"''","callback":"?"});
    var that = this;
    $KOBJ.getJSON(url, function(data) {
        if (data.error === "true") {
            that.logger("error destroying data in StringBin.");
            that.logger(data.errors);
            cb(data.errors);
        } else {
            that.logger("success destroying data in StringBin.");
            cb(false);
        }
    });
};
