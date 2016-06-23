// The MIT License (MIT)
// 
// Copyright (c) Marcel Joachim Kloubert <marcel.kloubert@gmx.net>
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to
// deal in the Software without restriction, including without limitation the
// rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
// sell copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
// FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
// DEALINGS IN THE SOFTWARE.

var KnownColors = require("color/known-colors");
var TypeUtils = require("utils/types");

const REGEX_COLOR = /^(#)?([a-f0-9]{3,4}|[a-f0-9]{6}|[a-f0-9]{8})$/i;
exports.REGEX_COLOR = REGEX_COLOR;

const REGEX_POINT_2D = /^([0-9]+[\.]?[0-9]*)+(\s)*([\||,])(\s)*([0-9]+[\.]?[0-9]*)+$/i;
exports.REGEX_POINT_2D = REGEX_POINT_2D;

const REGEX_SIZE = /^([0-9]+[\.]?[0-9]*)+(\s)*([x|,])(\s)*([0-9]+[\.]?[0-9]*)+$/i;
exports.REGEX_SIZE = REGEX_SIZE;

function setupBitmapClass(bitmapClass) {
    // defaultColor
    var _defColor = { a: 255, r: 0, g: 0, b: 0 };
    Object.defineProperty(bitmapClass.prototype, 'defaultColor', {
        get: function() { return _defColor; },

        set: function(newValue) { _defColor = toARGB(newValue); }
    });

    // dispose()
    bitmapClass.prototype.dispose = function(action, tag) {
        if (this.isDisposed) {
            return;
        }

        try {
            if (!TypeUtils.isNullOrUndefined(action)) {
                return action(this, tag);
            }
        }
        finally {
            this._dispose();
            this._isDisposed = true;
        }
    };

    // drawCircle()
    bitmapClass.prototype.drawCircle = function(radius, center, color, fillColor) {
        if (TypeUtils.isNullOrUndefined(radius)) {
            radius = Math.min(center.x, center.y);
        }

        return this.drawOval(center, { width: radius * 2, height: radius * 2 }, color, fillColor);
    };

    // drawLine()
    bitmapClass.prototype.drawLine = function(start, end, color) {
        start = toPoint2D(start);
        end = toPoint2D(end);
        color = toARGB(color);

        this._drawLine(start, end, color);
        return this;
    };

    // drawOval()
    bitmapClass.prototype.drawOval = function(size, leftTop, color, fillColor) {
        if (TypeUtils.isNullOrUndefined(size)) {
            size = {
                height: this.height,
                width: this.width
            };
        }
        
        if (TypeUtils.isNullOrUndefined(leftTop)) {
            leftTop = {
                x: 0,
                y: 0
            };
        }

        leftTop = toPoint2D(leftTop);
        
        color = this.normalizeColor(color);
        fillColor = toARGB(fillColor);
        size = toSize(size);

        this._drawOval(size, leftTop, color, fillColor);
        return this;
    };

    // drawRect()
    bitmapClass.prototype.drawRect = function(center, size, color, fillColor) {
        if (TypeUtils.isNullOrUndefined(center)) {
            center = {
                x: this.width / 2.0,
                y: this.height / 2.0
            };
        }

        center = toPoint2D(center);

        if (TypeUtils.isNullOrUndefined(size)) {
            size = {
                height: center.y * 2,
                width: center.x * 2
            };
        }
        
        color = this.normalizeColor(color);
        fillColor = toARGB(fillColor);
        size = toSize(size);

        this._drawRect(center, size, color, fillColor);
        return this;
    };

    // getPoint
    bitmapClass.prototype.getPoint = function(coordinates, color) {
        if (TypeUtils.isNullOrUndefined(coordinates)) {
            coordinates = {
                x: this.width / 2.0,
                y: this.height / 2.0
            };
        }

        return toARGB(this._getPoint(coordinates));
    };

    // normalizeColor()
    bitmapClass.prototype.normalizeColor = function(c) {
        return toARGB(c) || this.defaultColor;
    };

    // setPoint
    bitmapClass.prototype.setPoint = function(coordinates, color) {
        if (TypeUtils.isNullOrUndefined(coordinates)) {
            coordinates = {
                x: this.width / 2.0,
                y: this.height / 2.0
            };
        }

        color = this.normalizeColor(color);

        this._setPoint(coordinates, color);
        return this;
    };

    // size
    Object.defineProperty(bitmapClass.prototype, 'size', {
        get: function() {
            var _me = this;

            var _size = {};

            Object.defineProperty(_size, 'height', {
                get: function() { return _me.height; }
            });

            Object.defineProperty(_size, 'width', {
                get: function() { return _me.width; }
            });

            return _size;
        }
    });

    // toBase64()
    bitmapClass.prototype.toBase64 = function(format, quality) {
        return this._toObject(format, quality)
                   .base64;
    };

    // toDataUrl()
    bitmapClass.prototype.toDataUrl = function(format, quality) {
        var bd = this.toObject(format, quality);
        return 'data:' + bd.mime + ';base64,' + bd.base64;
    };

    // toObject()
    bitmapClass.prototype.toObject = function(format, quality) {
        if (TypeUtils.isNullOrUndefined(format)) {
            format = 1;
        }

        if (TypeUtils.isNullOrUndefined(quality)) {
            quality = 100;
        }

        return this._toObject(format, quality);
    };

    var _size = {};
}
exports.setupBitmapClass = setupBitmapClass;

function toARGB(v, throwException) {
    if (TypeUtils.isNullOrUndefined(v)) {
        return null;
    }

    var argb = {};

    var _a = 255;
    var _r = 0;
    var _g = 0;
    var _b = 0;
    var isValid = true;

    // a
    Object.defineProperty(argb, "a", {
        get: function() { return _a; }
    });

    // r
    Object.defineProperty(argb, "r", {
        get: function() { return _r; }
    });

    // g
    Object.defineProperty(argb, "g", {
        get: function() { return _g; }
    });

    // b
    Object.defineProperty(argb, "b", {
        get: function() { return _b; }
    });

    if (arguments.length < 2) {
        throwException = true;
    }

    var throwOrReturn = function() {
        if (isValid) {
            return argb;
        }

        if (throwException) {
            throw "NO valid color value!";
        }

        return false;
    };

    if (typeof v === "string") {
        // string

        v = v.toLowerCase().trim();
        if (KnownColors[v] !== undefined) {  // known color?
            return toARGB(KnownColors[v]);
        }

        var match = REGEX_COLOR.exec(v);
        
        isValid = null !== match;
        if (isValid) {
            var colorVal = match[2];
            if (colorVal.length < 5) {
                // #(A)RGB

                var argbStartIndex = 3 === colorVal.length ? 0 : 1;

                if (4 === colorVal.length) {
                    _a = parseInt(colorVal[0] + colorVal[0], 16); 
                }
                _r = parseInt(colorVal[argbStartIndex] + colorVal[argbStartIndex], 16);
                _g = parseInt(colorVal[argbStartIndex + 1] + colorVal[argbStartIndex + 1], 16);
                _b = parseInt(colorVal[argbStartIndex + 2] + colorVal[argbStartIndex + 2], 16);
            }
            else {
                // #(AA)RRGGBB
                
                var argbStartIndex = 6 === colorVal.length ? 0 : 2;

                if (8 === colorVal.length) {
                    _a = parseInt(colorVal.substr(0, 2), 16);
                }
                _r = parseInt(colorVal.substr(argbStartIndex, 2), 16);
                _g = parseInt(colorVal.substr(argbStartIndex + 2, 2), 16);
                _b = parseInt(colorVal.substr(argbStartIndex + 4, 2), 16);
            }
        }
    }
    else if (!isNaN(v)) {
        // number
        v = parseInt('' + v);
        if (v < 0) {
            v += 4294967296;
        }

        isValid = (v >= 0) && (v <= 4294967295);
        if (isValid) {
            var hex = ('0000000' + v.toString(16)).substr(-8);
            return toARGB('#' + hex);
        }
    }
    else if (typeof v === "object") {
        // object
        
        isValid = (typeof v.a !== undefined) &&
                  (typeof v.r !== undefined) &&
                  (typeof v.g !== undefined) &&
                  (typeof v.b !== undefined);

        if (isValid) {
            argb = v;
        }
    }

    return throwOrReturn();
}
exports.toARGB = toARGB;

function toPoint2D(v, throwException) {
    if (TypeUtils.isNullOrUndefined(v)) {
        return null;
    }

    var point = {};

    var _x;
    var _y;
    var isValid = true;

    // x
    Object.defineProperty(point, "x", {
        get: function() { return _x; }
    });

    // y
    Object.defineProperty(point, "y", {
        get: function() { return _y; }
    });

    if (arguments.length < 2) {
        throwException = true;
    }

    var throwOrReturn = function() {
        if (isValid) {
            return point;
        }

        if (throwException) {
            throw "NO valid 2D point value!";
        }

        return false;
    };

    if (typeof v === "string") {
        // string

        var match = REGEX_SIZE.exec(v.toLowerCase().trim());
        
        isValid = null !== match;
        if (isValid) {
            _x = parseFloat(match[1]);
            _y = parseFloat(match[5]);
        }
    }
    else if (typeof v === "object") {
        // object
        
        isValid = (typeof v.x !== undefined) &&
                  (typeof v.y !== undefined);

        if (isValid) {
            point = v;
        }
    }

    return throwOrReturn();
}
exports.toPoint2D = toPoint2D;

function toSize(v, throwException) {
    if (TypeUtils.isNullOrUndefined(v)) {
        return null;
    }

    var size = {};

    var _width;
    var _height;
    var isValid = true;

    // width
    Object.defineProperty(size, "width", {
        get: function() { return _width; }
    });

    // height
    Object.defineProperty(size, "height", {
        get: function() { return _height; }
    });

    if (arguments.length < 2) {
        throwException = true;
    }

    var throwOrReturn = function() {
        if (isValid) {
            return size;
        }

        if (throwException) {
            throw "NO valid size value!";
        }

        return false;
    };

    if (typeof v === "string") {
        // string

        var match = REGEX_SIZE.exec(v.toLowerCase().trim());
        
        isValid = null !== match;
        if (isValid) {
            _width = parseFloat(match[1]);
            _height = parseFloat(match[5]);
        }
    }
    else if (typeof v === "object") {
        // object
        
        isValid = (typeof v.width !== undefined) &&
                  (typeof v.height !== undefined);

        if (isValid) {
            size = v;
        }
    }

    return throwOrReturn();
}
exports.toSize = toSize;
