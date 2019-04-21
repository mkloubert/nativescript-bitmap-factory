[![npm](https://img.shields.io/npm/v/nativescript-bitmap-factory.svg)](https://www.npmjs.com/package/nativescript-bitmap-factory)
[![npm](https://img.shields.io/npm/dt/nativescript-bitmap-factory.svg?label=npm%20downloads)](https://www.npmjs.com/package/nativescript-bitmap-factory)

# NativeScript Bitmap Factory

A [NativeScript](https://nativescript.org/) module for creating and manipulating bitmap images.

[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=U3FY9F6QMDQ4L&lc=DE&item_name=Marcel%20Kloubert&item_number=nativescript%2dbitmap%2dfactory&no_note=1&no_shipping=2&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted)

## NativeScript Toolbox

This module is part of [nativescript-toolbox](https://github.com/mkloubert/nativescript-toolbox).

## License

[MIT license](https://raw.githubusercontent.com/mkloubert/nativescript-bitmap-factory/master/LICENSE)

## Platforms

* Android
* iOS

## Installation

Run

```bash
tns plugin add nativescript-bitmap-factory
```

inside your app project to install the module.

## Usage

```typescript
import BitmapFactory = require("nativescript-bitmap-factory");
import KnownColors = require("color/known-colors");

// create a bitmap with 640x480
var bmp = BitmapFactory.create(640, 480);

// work with bitmap and
// keep sure to free memory
// after we do not need it anymore
bmp.dispose(() => {
    // draw an oval with a size of 300x150
    // and start at position x=0, y=75
    // and use
    // "red" as border color and "black" as background color.
    bmp.drawOval("300x150", "0,75",
                 KnownColors.Red, KnownColors.Black);
      
    // draw a circle with a radius of 80
    // at the center of the bitmap (null => default)
    // and use
    // "dark green" as border color           
    bmp.drawCircle(80, null,
                   KnownColors.DarkGreen);
                
    // draws an arc with a size of 100x200
    // at x=10 and y=20
    // beginning at angle 0 with a sweep angle of 90 degrees
    // and a black border and a yellow fill color    
    bmp.drawArc("100x200", "10,20",
                0, 90,
                KnownColors.Black, KnownColors.Yellow);
                   
    // set a yellow point at x=160, y=150
    bmp.setPoint("160,150", "ff0");
    
    // draws a line from (0|150) to (300|75)
    // with blue color
    bmp.drawLine("0,150", "300,75", '#0000ff');
    
    // writes a text in yellow color
    // at x=100, y=100
    // by using "Roboto" as font
    // with a size of 10
    bmp.writeText("This is a test!", "100,100", {
        color: KnownColors.Yellow,
        size: 10,
        name: "Roboto"
    });
    
    // returns the current bitmap as data URL
    // which can be used as ImageSource
    // in JPEG format with a quality of 75%
    var data = bmp.toDataUrl(BitmapFactory.OutputFormat.JPEG, 75);
    
    // ... and in Base64 format
    var base64JPEG = bmp.toBase64(BitmapFactory.OutputFormat.JPEG, 75);
    
    // ... and as ImageSource
    var imgSrc = bmp.toImageSource();
});
```

## Functions

| Name | Description |
| ---- | --------- |
| asBitmap | Returns a value as wrapped bitmap. |
| create | Creates a new bitmap instance. |
| getDefaultOptions | Returns the default options for creating a new bitmap. |
| makeMutable | A helper function that keeps sure to return a native image object that is able to be used as wrapped bitmap object. |
| setDefaultOptions | Sets the default options for creating a new bitmap. |

## Platform specific stuff

You can access the `nativeObject` property to access the platform specific object.

For Android this is a [Bitmap](https://developer.android.com/reference/android/graphics/Bitmap.html) object and for iOS this is an [UIImage](https://developer.apple.com/library/ios/documentation/UIKit/Reference/UIImage_Class/) object.

To check the platform you can use the `android` and `ios` properties which have the same values as the corresponding properties from `application` core module.

### Android

You also can access the underlying [Canvas](https://developer.android.com/reference/android/graphics/Canvas.html) object by `__canvas` property.

### iOS

You also can access the underlying [CGImage](https://developer.apple.com/library/ios/documentation/GraphicsImaging/Reference/CGImage/) object by`__CGImage` property.

## Data types

### IArgb

Stores data of an RGB value with alpha value.

These values can also be submitted as strings (like `#ff0` or `ffffff`) or numbers.

```typescript
interface IArgb {
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
```

### IBitmapData

Used by `toObject()` method.

```typescript
interface IBitmapData {
    /**
     * Gets the data as Base64 string.
     */
    base64: string;

    /**
     * Gets the mime type.
     */
    mime: string;
}
```

### IFont

Font settings.

```typescript
interface IFont {
    /**
     * Anti alias or not.
     */
    antiAlias?: boolean;

    /**
     * Gets the custom forground color.
     */
    color?: string | number | IArgb;
    
    /**
     * Gets the name.
     */
    name?: string;

    /**
     * Gets the size.
     */
    size?: number;
}
```

### IPoint2D

Coordinates, can also be a string like `0,0` or `150|300`.

```typescript
interface IPoint2D {
    /**
     * Gets the X coordinate.
     */
    x: number;
    
    /**
     * Gets the Y coordinate.
     */
    y: number;
}
```

### IPoint2D

Size, can also be a string like `0,0` or `150x300`.

```typescript
interface ISize {
    /**
     * Gets the height.
     */
    height: number;
    
    /**
     * Gets the width.
     */
    width: number;
}
```

### OutputFormat

Supported output formats.

```typescript
enum OutputFormat {
    /**
     * PNG
     */
    PNG = 1,

    /**
     * JPEG
     */
    JPEG = 2,
}
```

### Bitmap

```typescript
interface IBitmap {
    /**
     * Get the android specific object provided by 'application' module.
     */
    android: AndroidApplication;

    /**
     * Clones that bitmap.
     */
    clone(): IBitmap;

    /**
     * Crops that bitmap and returns its copy.
     */
    crop(leftTop?: IPoint2D | string,
         size?: ISize | string): IBitmap;

    /**
     * Gets or sets the default color.
     */
    defaultColor: IPoint2D | string | number;

    /**
     * Disposes the bitmap. Similar to the IDisposable pattern of .NET Framework.
     */
    dispose<T, TResult>(action?: (bmp: IBitmap, tag?: T) => TResult,
                        tag?: T): TResult;

    /**
     * Draws a circle.
     */
    drawCircle(radius?: number,
               center?: IPoint2D | string,
               color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Draws an arc.
     */
    drawArc(size?: ISize | string,
            leftTop?: IPoint2D | string,
            startAngle?: number,
            sweepAngle?: number,
            color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Draws a line.
     */
    drawLine(start: IPoint2D | string, end: IPoint2D | string,
             color?: string | number | IArgb): IBitmap;

    /**
     * Draws an oval circle.
     */
    drawOval(size?: ISize | string,
             leftTop?: IPoint2D | string,
             color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Draws a rectangle.
     */
    drawRect(size?: ISize | string,
             leftTop?: IPoint2D | string,
             color?: string | number | IArgb, fillColor?: string | number | IArgb): IBitmap;

    /**
     * Gets the color of a point.
     */
    getPoint(coordinates?: IPoint2D | string): IArgb;

    /**
     * Gets the height of the bitmap.
     */
    height: number;

    /**
     * Get the iOS specific object provided by 'application' module.
     */
    ios: iOSApplication;

    /**
     * Inserts another image into that bitmap.
     */
    insert(other: any,
           leftTop?: IPoint2D | string): IBitmap;
    
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
     */
    normalizeColor(value: string | number | IArgb): IArgb;

    /**
     * Creates a copy of that bitmap with a new size.
     */
    resize(newSize: ISize | string): IBitmap;

    /**
     * Resizes that image by defining a new height by keeping ratio.
     */
    resizeHeight(newHeight: number): IBitmap;

    /**
     * Resizes that image by defining a new (maximum) size by keeping ratio.
     */
    resizeMax(maxSize: number): IBitmap;

    /**
     * Resizes that image by defining a new width by keeping ratio.
     */
    resizeWidth(newWidth: number): IBitmap;

    /**
     * Rotates the image.
     */
    rotate(degrees?: number): IBitmap;

    /**
     * Sets a pixel / point.
     */
    setPoint(coordinates?: IPoint2D | string,
             color?: string | number | IArgb): IBitmap;

    /**
     * Gets the size.
     */
    size: ISize;

    /**
     * Converts that image to a Base64 string.
     */
    toBase64(format?: OutputFormat, quality?: number): string;

    /**
     * Converts that image to a data URL.
     */
    toDataUrl(format?: OutputFormat, quality?: number): string;

    /**
     * Returns that image as ImageSource.
     */
    toImageSource(): ImageSource;

    /**
     * Converts that image to an object.
     */
    toObject(format?: OutputFormat, quality?: number): IBitmapData;

    /**
     * Writes a text.
     */
    writeText(txt: any,
              leftTop?: IPoint2D | string, font?: IFont | string): IBitmap;

    /**
     * Gets the width of the bitmap.
     */
    width: number;
}
```

## Contributors

* [Dimitar Topuzov](https://github.com/dtopuzov)
* [Geoff Bullen](https://github.com/geoffbullen)
* [Jonathan Salomon](https://github.com/abhayastudios)
* [Josh Huckabee](https://github.com/jhuckabee)
