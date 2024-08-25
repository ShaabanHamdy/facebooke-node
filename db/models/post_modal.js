import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    
    
    postContent: { type: String },
    postImage: { type: [Object] },
    likes: { type: Number, default: 0, min: 0},
    unLikes: { type: Number, default: 0, min: 0},
    postTime:{type:[String]},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: [true, "user Id is required"] },


},{
    // toJSON:{virtuals:true},
    // toObject:{virtuals:true},
    timestamps: true
});





const postModel = mongoose.models.Post || mongoose.model('Post', postSchema);

export default postModel