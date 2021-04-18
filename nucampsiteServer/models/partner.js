// @Required dependencies:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// @Creating a schema for partner data based on given criteria:
const partnerSchema = new Schema ({
    name: {
        type: String,
        unique: true,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
// @Creating Partner variable/model which holds partner collection & schema: 
const Partner = mongoose.model('Partner', partnerSchema);
// @Exporting created model for use within partner router:
module.exports = Partner;