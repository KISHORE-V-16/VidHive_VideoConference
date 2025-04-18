const userModel = require('../Model/UserModel.js');
const jwt = require('jsonwebtoken');
const bcrybt = require('bcrypt');
const validator = require('validator');

// Login User
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if(!email && !password){
           return res.json({success:false,message:"Enter a valid Email Id & Password"});
        }
        else if(!email){
            return res.json({success:false,message:"Enter a valid Email Id"});
        }
        else if(!password){
            return res.json({success:false,message:"Enter a valid Password"});
        }
        //finding user in db
        const user = await userModel.findOne({ email });
        
        //checking user is present or not
        if (!user) {
            return res.json({ success: false, message: "User Doesn't exist" });
        }
        //user password matching with stored password
        const isMatch = await bcrybt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: "Invalid Password" });
        }

        const token = createToken(user._id);
        res.cookie(`token_${user._id}`, token, { httpOnly: true, secure: true, sameSite: 'Strict' });
        res.json({ success: true, token:token,username:user.username});

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "Error while Login" });
    }
};

//create token
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Register User
const registerUser = async (req, res) => {
    const { username, password, email } = req.body;
    try {
        //checking is user already exists
        
        const exists = await userModel.findOne({ email });
        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        //validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.json({
                success: false,
                message: "Please enter a valid email",
            });
        }

        if (password.length < 8) {
            return res.json({
                success: false,
                message: "Please enter a strong password(minimum length 8)",
            });
        }

        // hashing or encryption of user password
        const salt = await bcrybt.genSalt(10); //higher the number in genSalt() higher the encryption and takes time also
        const hashedPassword = await bcrybt.hash(password, salt);

        const newUser = new userModel({
            username: username,
            email: email,
            password: hashedPassword,
        });

        console.log(newUser,"good");

        const user = await newUser.save();
        return res.json({ success: true});
        
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error while Registering" });
    }
};



module.exports = { loginUser, registerUser };