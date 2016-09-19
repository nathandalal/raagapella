module.exports.getEventImageUrl = (event) => {
	let images = event["Event Flyer"].map(imageObj => imageObj.url)
	if(images[1]) return images[1]
	if(images[0]) return images[0]
	return undefined	
}