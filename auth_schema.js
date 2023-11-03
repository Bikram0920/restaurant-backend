const jwt = require("jsonwebtoken")
const user = require("./auth_schema_signup")
const bcrypt = require("bcrypt")
const SECRET_KEY="Restaurant";

const signup = async (req,res)=>{
    // Check for exiting user

    console.log(req.body);
    const {username,email,password,c_password} = req.body
    console.log(username,email,password,c_password)

    try{
        if(password!==c_password)
        {
            return res.status(400).json({ error: "Password and confirm password must be same" });
        }
        const Checkuser = await user.findOne({
            email: email,
        });

        if(Checkuser){
            console.log("Alredy exists");
            return res.status(400).json({ error: "User already exists" });
        }
        else{
            // Crypting the password
        const password_user = password
        const saltround = 10
        const hashedPassword = await bcrypt.hash(data=password_user,saltround);

    // Create User
        const result = await user.create({
            username:username,
            email:email,
            password:hashedPassword,
        })

        await result.save()
    
        const token = jwt.sign({
            email:result.email,
            id:result._id,
        },SECRET_KEY);

        return res.status(200).json({ token });
        }

        
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            error: "Error while authenticating"
        })
    }
}


const signin = async(req,res)=>{
    const {email,password} = req.body;
    console.log(email,password);
    try{
        //  check for existing user

        const checkUser = await user.findOne({
            email: email,
        })
        if(!checkUser){
           return res.status(400).json({"error":"User doesn't exist"});
        }
        else
        {
            console.log(checkUser);
            const match_password =await bcrypt.compare(password, checkUser.password);
            console.log(match_password);
            if(!match_password){
                return res.status(400).json({
                    error: "Incorrrect password"
                })
            }
            else
            {
                const token = jwt.sign({
                    email: checkUser.email,
                    id: checkUser._id,
                },SECRET_KEY);

                if(token){
                    return res.status(201).json({
                        email: checkUser.email,
                        token: token
                    })
                }
                else
                {
                    return res.status(400).json({error:"Unsuccessful"})
                }
        
            }
        }

        

        

        
       

    }catch(error){
        return res.status(500).json({
            error: `${error}` 
        })
    }
}

module.exports =  {signup,signin}