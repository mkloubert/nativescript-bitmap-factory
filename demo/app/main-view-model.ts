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
        

        b.drawOval("300,150", "0,75", KnownColors.Red, KnownColors.Black);
        b.drawCircle(80, null, KnownColors.DarkGreen);

        b.setPoint(KnownColors.Yellow, "160,150");

        b.drawLine("0,150", "300,75", KnownColors.Blue);

        // b.drawRect("150,150", "30x20", KnownColors.White);

        // var p = b.getPoint({ x: 150, y: 150 });
        // console.log("Point: " + [p.a, p.r, p.g, p.b]);

        b.writeText("This is a test!", "100,100", {
            color: KnownColors.Yellow,
            size: 10,
        });

        var b2 = b.clone().resize("20x20");
        b.insert(b2, "25,25");

        viewModel.set('image', b.clone().toDataUrl());
    });
    
    console.log("Bitmap disposed!");
    console.log("Bitmap.isDisposed: " + bmp.isDisposed);

    return viewModel;
}
