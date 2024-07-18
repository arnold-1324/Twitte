import User from "../Models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenSetCokkie from "../Utils/generateToken.js";

export const Signup= async(req,res)=>{
    try {
        const {username,Fullname,email,password,confirmPassword}=req.body;
        
        if(password!==confirmPassword){
            return res.status(400).json({ error: "Passwords don't match" });
        }
        const user= await User.findOne({ username });
         if(user){
            return res.status(400).json({ error:"Username Already Taken"});
         }
         const Usermail= await User.findOne({ email});
          if(Usermail) return res.status(400).json({ error:"Email Already exists"});

          const salt= await bcryptjs.genSalt(10);
          const hashedPassword=await bcryptjs.hash(password,salt);

          const newUser=new User({
            username,
            email,
            Fullname,
            password:hashedPassword,
          })

          if(newUser){
            generateTokenSetCokkie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
				_id: newUser._id,
				FullName: newUser.Fullname,
				username: newUser.username,
				email:newUser.email
			});
		} else {
			res.status(400).json({ error: "Invalid user data" });
          }

    } catch (error) {
        console.log("Error in signup controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
        
}

export const Login=async(req,res)=>{
    try {
        const { username, password } = req.body;
		const user = await User.findOne({ username });
		const isPasswordCorrect = await bcryptjs.compare(password, user?.password || "");

		if (!user || !isPasswordCorrect) {
			return res.status(400).json({ error: "Invalid username or password" });
		}

		generateTokenSetCokkie(user._id, res);
        res.status(200).json({
			_id: user._id,
			FullName: user.Fullname,
			username: user.username,
            email:user.email
		});
    } catch (error) {
        console.log("Error in login controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}

export const Logout=async(req,res)=>{
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Loggout successfully"});
    } catch (error) {
        console.log("Error in logout controller", error.message);
		res.status(500).json({ error: "Internal Server Error" });
    }
}