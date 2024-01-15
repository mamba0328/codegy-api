const logout = async (req, res, next) => {
    return res.status(200).cookie('refreshToken', '', { expires: new Date(), httpOnly: true }).json({
            message: "Logout succesfull",
    })
};


module.exports = {logout}