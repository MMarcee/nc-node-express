// @required dependencies:
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

// @Creating a schema for promotions data based on given criteria:
const promotionSchema = new Schema ({
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
        default: true
    },
    cost: {
        type: Currency,
        required: true,
        min: 0
    },
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});
// @Creating Promotion variable/model which holds promotion collection & schema:
const Promotion = mongoose.model('Promotion', promotionSchema);
// @Exporting created model for use within promotion router:
module.exports = Promotion;