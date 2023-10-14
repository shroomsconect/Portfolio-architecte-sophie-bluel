module.exports = (req, res, next) => {
	try{
		const host = req.get('host');
		const title = ( req.body.title.trim() === null )? undefined : req.body.title.trim();
		const categoryId = ( parseInt(req.body.category) === null )? undefined : parseInt(req.body.category);
		const userId = ( req.auth.userId === null )? undefined : req.auth.userId;
		const imageUrl = ( `${req.protocol}://${host}/images/${req.file.filename}` === null )? undefined : `${req.protocol}://${host}/images/${req.file.filename}`;
	console.log(title,categoryId,userId,imageUrl)
		if(title !== undefined &&
			title.length > 0 &&
			categoryId !== undefined &&
			categoryId > 0 &&
			userId !== undefined &&
			userId > 0 &&
			imageUrl !== undefined){
			req.work = {title, categoryId, userId, imageUrl}
			next()
		}else{
			return res.status(400).json({error: new Error("Bad Request")})
		}
	}catch(e){
		return res.status(500).json({error: new Error("Something wrong occured")})
	}

}
