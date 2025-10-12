export async function getCroppedImg(imageSrc: string, crop: any): Promise<Blob> {
    const image = await createImage(imageSrc)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!

    const { width, height } = crop
    canvas.width = width
    canvas.height = height

    ctx.drawImage(
        image,
        crop.x,
        crop.y,
        width,
        height,
        0,
        0,
        width,
        height
    )

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob!)
        }, "image/jpeg")
    })
}

function createImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        img.addEventListener("load", () => resolve(img))
        img.addEventListener("error", (err) => reject(err))
        img.src = url
    })
}