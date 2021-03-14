/**
 * Takes an array of images and creates new image with image prototype
 * After providing src to the image prototype it's loaded and cached by the browser
 * @param {string[]} images - array of image urls
 */
export const preloadImages = (images) => images.map((image) => {
	const newImage = new Image();

	newImage.src = image;

	return newImage;
});
