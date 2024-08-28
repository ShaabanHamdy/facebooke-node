import postModel from "../../../db/models/post_modal.js"






export const createPost = async(req,res,next)=>{
    if (!req.files) {
        next(new Error("please select post picture", { cause: 400 }))
    }
    const post = await postModel.create({
        postImage: req.files?.postImage.map((e) =>"https://shaaban-facebook-node.up.railway.app/" + e.path),
        postContent: req.body.postContent,
        likes: req.body.likes,
        unLikes: req.body.unLikes,
        postTime: new Date(),
        userId:req.user.id
    })
   if (!post) {
    
     return  next(new Error("fail to create post"))
   }
   res.json({message:"success",post})
}


export const getAllPosts = async (req, res, next) => {
    const {limit,skip} = paginate(req.query.page , req.query.size)
    
    const post = await postModel.find().populate([{
        path: "userId"
    }])
    // .limit(limit).skip(skip)
    if (post.length == 0) {
        next(new Error("no posts available"))
    }

    res.json({ message: "success", results: post.length, post  })

}


// ======================================================

export const deletePost = async (req, res, next) => {
    const post = await postModel.deleteOne({_id:req.body.post_id})
    if (post.deletedCount < 1) return next(new Error("there not find andy posts ", 
        { cause: 409 }))
    res.status(201).json({ message: "success", deletedCount: post.deletedCount })
}
