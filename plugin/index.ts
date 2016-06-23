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

var BitmapFactory = require("./BitmapFactory");
import TypeUtils = require("utils/types");

/**
 * Describes an object that stores ARGB color data.
 */
export interface IArgb {
    /**
     * Gets the alpha value.
     */
    a: number;

    /**
     * Gets the red value.
     */
    r: number;

    /**
     * Gets the green value.
     */
    g: number;

    /**
     * Gets the blue value.
     */
    b: number;
}

/**
 * Describes bitmap data.
 */
export interface IBitmapData {
    /**
     * Gets the data as Base64 string.
     */
    base64: string;

    /**
     * Gets the mime type.
     */
    mime: string;
}

/**
 * A 2D point.
 */
export interface IPoint2D {
    /**
     * Gets the X coordinate.
     */
    x: number;
    
    /**
     * Gets the X coordinate.
     */
    y: number;
}

/**
 * Describes an object that stores a size.
 */
export interface ISize {
    /**
     * Gets the height.
     */
    height: number;
    
    /**
     * Gets the width.
     */
    width: number;
}

/**
 * List of outout formats.
 */
export enum OutputFormat {
    /**
     * PNG
     */
    PNG = 1,

    /**
     * JPEG
     */
    JPEG = 2,
}

/**
 * Describes a bitmap.
 */
export interface IBitmap {
    /**
     * Gets or sets the default color.
     */
    defaultColor: IPoint2D | string | number;

    /**
     * Disposes the bitmap. Similar to the IDisposable pattern of .NET Framework.
     * 
     * @param {Function} [action] The action to invoke BEFORE bitmap is disposed.
     * @param any [tag] An optional value for the action.
     * 
     * @return any The result of the action (if defined).
     */
    dispose(action?: (bmp: IBitmap, tag?: any) => void,
            tag?: any);

    /**
     * Draws a circle.
     * 
     * @chainable
     * 
     * @param {number} [radius] The radius.
     * @param any [center] The center coordinates.
     * @param any [color] The line color.
     * @param any [fillColor] The fill color.
     */
    drawCircle(radius?: number,
               center?: IPoint2D | string,
               color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Draws a line.
     * 
     * @chainable
     * 
     * @param {IPoint2D} start The coordinates of the start point.
     * @param {IPoint2D} end The coordinates of the end point.
     * @param {IArgb} [color] The color to use. Default is black.
     */
    drawLine(start: IPoint2D | string, end: IPoint2D | string,
             color?: string | number | IArgb): IBitmap;

    /**
     * Draws an oval circle.
     * 
     * @chainable
     * 
     * @param {IPoint2D} [center] The center coordinates.
     * @param {ISize} [size] The size.
     * @param {IArgb} [color] The line color.
     * @param {IArgb} [fillColor] The fill color.
     */
    drawOval(center?: IPoint2D | string,
             size?: ISize | string,
             color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Draws a rectangle.
     * 
     * @chainable
     * 
     * @param {IPoint2D} [center] The center coordinates.
     * @param {ISize} [size] The size.
     * @param {IArgb} [color] The line color.
     * @param {IArgb} [fillColor] The fill color.
     */
    drawRect(center?: IPoint2D | string,
             size?: ISize | string,
             color?: string | number | IArgb, fillColor?: string | number | IArgb);

    /**
     * Gets the color of a point.
     * 
     * @param {IPoint2D} [coordinates] The coordinates of the point.
     * 
     * @return {IArgb} The color.
     */
    getPoint(coordinates?: IPoint2D | string): IArgb;

    /**
     * Gets the height of the bitmap.
     */
    height: number;
    
    /**
     * Gets if the object has been disposed or not.
     */
    isDisposed: boolean;

    /**
     * Gets the native platform specific object that represents that bitmap.
     */
    nativeObject: any;

    /**
     * Normalizes a color value.
     * 
     * @param any value The input value.
     * 
     * @return {IArgb} The output value.
     */
    normalizeColor(value: string | number | IArgb): IArgb;

    /**
     * Sets a pixel / point.
     * 
     * @param {IPoint2D} [coordinates] The coordinate where to draw the point.
     * @param {IArgb} [color] The color of the point.
     */
    setPoint(coordinates?: IPoint2D | string,
             color?: string | number | IArgb);

    /**
     * Gets the size.
     */
    size: ISize;

    /**
     * Converts that image to a Base64 string.
     * 
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     * 
     * @return {String} The bitmap a Base64 string.
     */
    toBase64(format?: OutputFormat, quality?: number): string;

    /**
     * Converts that image to a data URL.
     * 
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     * 
     * @return {String} The bitmap as data url.
     */
    toDataUrl(format?: OutputFormat, quality?: number): string;

    /**
     * Converts that image to an object.
     * 
     * @param {OutputFormat} format The output format. Default is: PNG
     * @param {Number} quality A value between 0 (0%) and 100 (100%) for the output quality.
     * 
     * @return {IBitmapData} The bitmap as object.
     */
    toObject(format?: OutputFormat, quality?: number): IBitmapData;

    /**
     * Gets the width of the bitmap.
     */
    width: number;
}

/**
 * Creates a new bitmap.
 * 
 * @param {Number} width The width of the new image.
 * @param {Number} [height] The optional height of the new image. If not defined, the width is taken as value.
 * 
 * @return {IBitmap} The new bitmap.
 */
export function create(width: number, height?: number): IBitmap {
    if (TypeUtils.isNullOrUndefined(height)) {
        height = width;
    }

    return BitmapFactory.createBitmap(width, height);
}
