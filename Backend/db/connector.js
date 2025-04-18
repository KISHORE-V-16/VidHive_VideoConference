const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("✅ DB Connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
};

module.exports = { connectDB };
