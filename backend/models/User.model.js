const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,
        'Please enter a valid email address'
    ]
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    phone: {
        type: String,
        required: [true, 'Phone number is required'],
        trim: true,
        match: [
        /^\d{10}$/,
        'Phone number must be 10 digits'
    ]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    wishlist: {
    hotels:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hotel' }],
    flights: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Flight' }],
  },
}, { timestamps: true });

userSchema.pre('save',async function(){
    if(!this.isModified('password')) return ;
    this.password = await bcrypt.hash(this.password,10);
    
    
});

userSchema.methods.comparePassword = function(candiate){
    return bcrypt.compare(candiate,this.password);
}



module.exports = mongoose.model('User', userSchema);