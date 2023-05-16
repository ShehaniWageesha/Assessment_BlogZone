var mongoose = require('mongoose');
var Schema = mongoose.Schema;

blogSchema = new Schema( {
	title: String,
	desc: String,
	file: String,
	user_id: Schema.ObjectId,
	is_delete: { type: Boolean, default: false },
	date : { type : Date, default: Date.now }
}),
blog = mongoose.model('blog', blogSchema);

module.exports = blog;