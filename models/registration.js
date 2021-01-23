const mongoose = require('mongoose');
const schema = mongoose.Schema;
const bcrypt = require('bcryptjs');

const registrationSchema = new schema({

    name: {
        type: String
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
    },

    password: {
        type: String,
        select: false,
        required: true,
    },

    confirmpassword: {
        type: String,
        required: true,
        validate: {
            validator: function(el) {
                return el === this.password;
            },
            message: "Password are not same"
        }
    }
});


registrationSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.confirmpassword = undefined;
    next();
})

// registrationSchema.methods.correctPassword = async function(
//     candidatePassword, 
//     userPassword
// )
//     {
//     return await bcrypt.compare(candidatePassword, userPassword);
// };

const registrationModel = mongoose.model("registration", registrationSchema);

module.exports = registrationModel;