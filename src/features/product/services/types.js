export const isPDF = (type) => type === "application/pdf";
export const isVideo = (type) => type?.startsWith("video/");
export const isImage = (type) => type?.startsWith("image/");
