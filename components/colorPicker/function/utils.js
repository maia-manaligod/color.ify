export const convertRGBtoHSL = (rgb) => {
    const r = rgb[0]/255
    const g = rgb[1]/255
    const b = rgb[2]/255

    const min = Math.min(r, g, b)
    const max = Math.max(r, g, b)

    const delta = max - min
    
    let h 
    let s
    
    if (max == min){
        h = 0; 
    } else if (r == max){
        h = (g - b)/delta 
    } else if (g == max){
        h = (b - r) / delta
    } else if (b == max){
        h = (r - g) / delta
    }

    h = Math.min(h * 60, 360)

    if (h < 0){
        h += 360
    }

    const l = (min + max) / 2

    if (max == min){
        s = 0
    } else if (l <= 0.5){
        s = delta / (max + min)
    } else {
        s = delta / (2 - max - min)
    }

    return [Math.round(h), Math.round(s * 100), Math.round(l * 100)]
}


export function HSLToHex(h, s, l){
    const hDecimal = l/100;
    const a = (s * Math.min(hDecimal, 1 - hDecimal)) / 100;

    const f = (n) => {
        const k = (n + h / 30) % 12;
        const color = hDecimal - a * Math.max(Math.min(k - 3, 9-k, 1), -1);

        return Math.round(255 * color)
        .toString(16)
        .padStart(2, "0");

    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

export function HexToHSL(hex){
    if (hex == ""){ return null; }
    let result = /^#?([a-f\d]+)?$/i.exec(hex);

    if (!result){
        return null;
    } else if (hex.startsWith("#")){
        result = result[1];
        
    }

    if (result == null) { result = ""; }
    else if (result.length <= 3){
        result = result.padStart(3, "0");
        var temp = result[0] + result[0] + result[1] + result[1] + result[2] + result[2];
        result = temp;

    }
    else if (result.length > 6){

        if (!result.startsWith("0")){ return null;}
        else { result = result.substring(1); 
            hex = hex.substring(1);
        
        }
    }

  
    result = result.padStart(6 , "0");

    




    const res = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(result);

/*
    if (!result){
        throw new Error("Could not parse Hex Color")
    }
    */

    const rHex = parseInt(res[1], 16);
    const gHex = parseInt(res[2], 16);
    const bHex = parseInt(res[3], 16);

    const r = rHex/255;
    const g = gHex/255;
    const b = bHex/255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h = (max + min) /2;
    let s = h; 
    let l = h;

    if (max === min){
        if (!hex.startsWith("#")) { hex = "#" + hex; }
        return ([[0, 0, l], hex]);
    }

    const d = max - min;
    s = l > .5 ? d / (2 - max - min): d / (max + min);
    switch(max){
        case r:
            h = (g - b) / d + (g < b ? 6 : 0);
            break; 
        case g:
            h = (b - r) / d + 2;
            break; 
        case b: 
            h = (r - g) / d + 4;
            break; 
    }
    h /=6;

    s = s*100;
    s = Math.round(s);
    l = l * 100; 
    l = Math.round(l);
    h = Math.round(360 * h);


    if (!hex.startsWith("#")) { hex = "#" + hex; }
    return [[h, s, l], hex];

}





