const User = require('../models/User');

const addTarget = async (req, res) => {
    const { name, targetAmount, deadline } = req.body;
    
    console.log("Adding target:", { name, targetAmount, deadline });

    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.user.id,
            { 
                $push: { 
                    targets: { name, targetAmount, deadline } 
                } 
            },
            { new: true, runValidators: true } 
        );

        if (!updatedUser) return res.status(404).json({ msg: "User not found" });

        console.log("Updated Targets:", updatedUser.targets);
        res.json(updatedUser.targets);
    } catch (err) {
        console.error("Target Save Error:", err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { addTarget }; 