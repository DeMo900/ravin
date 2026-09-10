export const upload = async (image: File, bucketUrl: string, r2: R2Bucket) => {
  const date = Date.now();
  const fileName = date + image.name;
  await r2.put(fileName, image);
  const url = bucketUrl + fileName;
  return { url };
};
