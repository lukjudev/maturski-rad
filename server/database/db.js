const mongoose = require('mongoose');

const db = () => {
    mongoose.connect(`${process.env.DB}`)
        .then(() => console.log("Uspešno je uspostavljena veza sa bazom."));
}

module.exports = db;