// import parsePhoneNumberFromString from 'libphonenumber-js';
import { mongoose } from 'mongoose';
import bcrypt  from 'bcryptjs'; 

// Declare the Schema of the Mongo model

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        minlength: [3, 'Name must be at least 3 characters long'],
        maxlength: [50, 'Name must be less than 50 characters long'],
        unique: [true, 'name must be unique'],
        lowercase:true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'email must be unique'],
        lowercase:true,
        match: [
            /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            'Please fill a valid email address',
        ],
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long'],
        validate: {
            validator: function (v) {
                return /(?=.*[!@#$%^&*])(?=.*[A-Z].*[A-Z])/.test(v);
            },
            message:
                'Password must contain at least one special character and two capital letters',
        },
    },
    mobile: {
        type: String,
        required: [true, 'Mobile number is required'],
        match: [/^\d{10,15}$/, 'Please fill a valid mobile number'],
    },
    gender: {
        type: String,
        default: "male",
        enum: ["male", "female"]
    },
    birthOfDate: {
        type:String,
        required: [true, 'Birth of Date is required'],
    
    },
    status: {
        type: String,
        default: "offline",
        enum: ["offline", "online"]
    },
    role: {
        type: String,
        default: "User",
        enum: ['User', 'Admin']
    },
    forgetCode: {
        type: Number,
        default: 0
    },
    changePasswordTime: {
        type: Date
    },
    profileImage: { type: [Object] },
    // country: {
    //     type: String,
    //     required: [true, 'Country is required'],
    //   },
    //   mobile: {
    //     type: String,
    //     required: [true, 'Mobile number is required'],
    //     validate: {
    //       validator: function (v) {
    //         const phoneNumber = parsePhoneNumberFromString(v, this.country);
    //         return phoneNumber ? phoneNumber.isValid() : false;
    //       },
    //       message: props => `${props.value} is not a valid mobile number!`,
    //     },
    //   },
}, {
    timestamps: true
});



// hook to hash password 
userSchema.pre("save",function(next,doc){
    this.password = bcrypt.hashSync(this.password, +process.env.SALT_ROUNDS)
    next()
})


//Export the model

const userModel = mongoose.model.User || mongoose.model('User', userSchema);

export default userModel

