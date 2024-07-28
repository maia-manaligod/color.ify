"use server"
import sharp from "sharp"

export async function generateColorImage(color, width, height){
    console.log("genColor")
    const imageBuffer = await sharp({
        create : {
            width: width,
            height: height,
            channels: 3,
            background: color
        }

    }).jpeg().toBuffer()

    return imageBuffer.toString('base64');
}