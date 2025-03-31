const User = require('../models/user')
const {setUser} = require('../service/auth')


async function handleUserSignup(req, res) {
    const {name, email, password} = req.body
    await User.create({
        name,
        email,
        password,
    })
    return res.redirect('/')
}

async function handleUserLogin(req, res) {
    const { email, password } = req.body;

    const user = await User.findOne({ password });
    if (!user) {
        return res.render('login', { error: 'Invalid username or password' });
    }

    const token = setUser(user);

    console.log("Login Successful:", user); 
    res.cookie('uid', token, {
        domain: 'www.piyushgarg.dev'
    });
    return res.redirect('/');
}



module.exports = {
    handleUserSignup,
    handleUserLogin
}