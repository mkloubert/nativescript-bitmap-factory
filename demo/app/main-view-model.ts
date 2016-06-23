import BitmapFactory = require("nativescript-bitmap-factory");
import {Observable} from "data/observable";
import KnownColors = require("color/known-colors");

export function createViewModel() {
    var viewModel: any = new Observable();

    var bmp = BitmapFactory.create(300);
    bmp.dispose((b) => {
        /* b.drawRect({ x: 150, y: 150 },
                   '300x150',
                   KnownColors.Red, KnownColors.Black); */

        /* for (var i = 0; i < b.width; i++) {
b.setPoint({ x: i, y: 150 },
                   KnownColors.Red);
        } */
        

        b.drawOval("150,150", "300,150", KnownColors.Red, KnownColors.Black);

        b.setPoint({ x: 150, y: 140 },
                   KnownColors.Yellow);

        b.drawLine("0,150", "300,75", KnownColors.Blue);

        b.drawRect("150,150", "30x20", KnownColors.White);

        // var p = b.getPoint({ x: 150, y: 150 });
        // console.log("Point: " + [p.a, p.r, p.g, p.b]);

        viewModel.set('image', b.toDataUrl());
    });
    
    console.log("Bitmap disposed!");
    console.log("Bitmap.isDisposed: " + bmp.isDisposed);

    return viewModel;
}
