const User = require('../models/user')
const {setUser} = require('../service/auth')


async function handleUserSignup(req, res) {
    console.log("Signup request received:", req.body); // Debugging
    
    const {name, email, password} = req.body
    const user = await User.findOne({ name, email, password });
    if(user){
        const token = setUser(user);

        console.log("Login Successful:", user); 
        res.cookie('uid', token);
        return res.redirect('/');

    }
    await User.create({
        name,
        email,
        password,
    })
    return res.redirect('/')
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ email, password });
    if (!user) {
        return res.render('login', { error: 'Invalid username or password' });
    }

    const token = setUser(user);

    console.log("Login Successful:", user); 
    res.cookie('uid', token);
    return res.redirect('/');
}



module.exports = {
    handleUserSignup,
    handleUserLogin
}