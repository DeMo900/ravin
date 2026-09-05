
export const upload = async(image:File,r2:R2Bucket)=>{
const date = Date.now()
const fileName = date + image.name
await r2.put(fileName,image)

}