module.exports.getPersonImageUrl = (person) => {
	let images = person["Picture"].map(imageObj => imageObj.url)
	if(images[1]) return images[1]
	if(images[0]) return images[0]
	return "http://f4xbx1lr5yj41rcrc3t0t4y1.wpengine.netdna-cdn.com/wp-content/uploads/2016/01/765-default-avatar-scalia-person.png"
}