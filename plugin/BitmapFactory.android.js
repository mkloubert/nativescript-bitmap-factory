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

var BitmapFactoryCommons = require('./BitmapFactory.commons');
var TypeUtils = require("utils/types");

function AndroidBitmap(bitmap) {
    if (!(this instanceof AndroidBitmap)) {
        return new AndroidBitmap(bitmap);
    }

    this._isDisposed = false;
    this._nativeObject = bitmap;
    this.__canvas = new android.graphics.Canvas(bitmap);
}

// [ANDROID INTERNAL] __createPaint()
AndroidBitmap.prototype.__createPaint = function(color) {
    var paint = new android.graphics.Paint();

    if (!TypeUtils.isNullOrUndefined(color)) {
        paint.setARGB(color.a, color.r, color.g, color.b);
    }

    return paint;
};

// [INTERNAL _dispose()
AndroidBitmap.prototype._dispose = function(action, tag) {
    this._nativeObject.recycle();
};

// [INTERNAL] _drawLine()
AndroidBitmap.prototype._drawLine = function(start, end, color) {
    this.__canvas.drawLine(start.x, start.y,
                           end.x, end.y,
                           color);
};

// [INTERNAL] _drawOval()
AndroidBitmap.prototype._drawOval = function(size, leftTop, color, fillColor) {
    var me = this;

    var paintLine = this.__createPaint(color);
    paintLine.setStyle(android.graphics.Paint.Style.STROKE);
    
    var paints = [];
    paints.push(paintLine);

    if (null !== fillColor) {
        var paintFill = this.__createPaint(fillColor);
        paintFill.setStyle(android.graphics.Paint.Style.FILL);

        paints.push(paintFill);
    }

    var drawer = function(r, p) {
        me.__canvas.drawOval(r, p);
    };
    if (size.width == size.height) {
        var drawer = function(r, p) {
            var radius = size.width / 2.0;

            me.__canvas.drawCircle(leftTop.x + radius, leftTop.y + radius,
                                   radius,
                                   p);
        };
    }

    for (var i = paints.length; i > 0; i--) {
        var left = leftTop.x;
        var top = leftTop.y;
        var right = left + size.width / 2.0 - 1;
        var bottom = top + size.height / 2.0 - 1;

        var rect = new android.graphics.RectF(left, top,
                                              right, bottom);

        drawer(rect, paints[i - 1]);
    }
};

// [INTERNAL] _drawRect()
AndroidBitmap.prototype._drawRect = function(size, leftTop, color, fillColor) {
    var paintLine = this.__createPaint(color);
    paintLine.setStyle(android.graphics.Paint.Style.STROKE);
    
    var paints = [];
    paints.push(paintLine);

    if (null !== fillColor) {
        var paintFill = this.__createPaint(fillColor);
        paintFill.setStyle(android.graphics.Paint.Style.FILL);

        paints.push(paintFill);
    }

    for (var i = paints.length; i > 0; i--) {
        var left = leftTop.x;
        var top = leftTop.y;
        var right = left + size.width - 1;
        var bottom = top + size.height - 1;

        var rect = new android.graphics.RectF(left, top,
                                              right, bottom);

        this.__canvas
            .drawRect(rect, paints[i - 1]);
    }
};

// [INTERNAL] _getPoint()
AndroidBitmap.prototype._getPoint = function(coordinates) {
    return this._nativeObject
               .getPixel(coordinates.x, coordinates.y);
};

// [INTERNAL] _setPoint()
AndroidBitmap.prototype._setPoint = function(coordinates, color) {
    this._nativeObject
        .setPixel(coordinates.x, coordinates.y,
                  android.graphics.Color.argb(color.a, color.r, color.g, color.b));
};

// _toObject()
AndroidBitmap.prototype._toObject = function(format, quality) {
    var bmpFormat;
    var mime;
    switch (format) {
        case 1:
            bmpFormat = android.graphics.Bitmap.CompressFormat.PNG;
            mime = 'image/png';
            break;

        case 2:
            bmpFormat = android.graphics.Bitmap.CompressFormat.JPEG;
            mime = 'image/jpeg';
            break;
    }

    if (TypeUtils.isNullOrUndefined(bmpFormat)) {
        throw "Format '" + format + "' is NOT supported!";
    }

    var stream = new java.io.ByteArrayOutputStream();
    try {
        this._nativeObject
            .compress(bmpFormat, quality, stream);

        var bitmapData = {};

        var base64 = android.util.Base64.encodeToString(stream.toByteArray(), 
                                                        android.util.Base64.NO_WRAP);
        
        // base64
        Object.defineProperty(bitmapData, 'base64', {
            get: function() { return base64; }
        });

        // mime
        Object.defineProperty(bitmapData, 'mime', {
            get: function() { return mime; }
        });

        return bitmapData;
    }
    finally {
        stream.close();
    }
}

// height
Object.defineProperty(AndroidBitmap.prototype, 'height', {
    get: function() { return this._nativeObject.getHeight(); }
});

// isDisposed
Object.defineProperty(AndroidBitmap.prototype, 'isDisposed', {
    get: function() { return this._isDisposed; }
});

// nativeObject
Object.defineProperty(AndroidBitmap.prototype, 'nativeObject', {
    get: function() { return this._nativeObject; }
});

// width
Object.defineProperty(AndroidBitmap.prototype, 'width', {
    get: function() { return this._nativeObject.getWidth(); }
});

// setup common methods and properties
BitmapFactoryCommons.setupBitmapClass(AndroidBitmap);


function createBitmap(width, height) {
    var newBitmap = android.graphics.Bitmap.createBitmap(width, height,
                                                         android.graphics.Bitmap.Config.ARGB_8888);

    return new AndroidBitmap(newBitmap);
}
exports.createBitmap = createBitmap;
