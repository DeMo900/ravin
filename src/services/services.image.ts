export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

export const upload = async (
  image: File,
  bucketUrl: string,
  r2: R2Bucket,
): Promise<UploadResult> => {
  if (image.size > 5 * 1024 * 1024) {
    return { success: false, error: "Image size exceeds 5MB limit." };
  }
  if (!image.type.startsWith("image/")) {
    return { success: false, error: "Invalid image type." };
  }
  const date = Date.now();
  const fileName = `${date}_${image.name}`;
  await r2.put(fileName, image);
  const formattedBucketUrl = bucketUrl.endsWith("/") ? bucketUrl : `${bucketUrl}/`;
  const url = `${formattedBucketUrl}${fileName}`;
  return { success: true, url };
};

