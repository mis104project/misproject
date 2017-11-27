var mongoose = require('../db').mongoose;

var MemberSchema = new mongoose.Schema({
    name: String,
    password: String,
    bDate: String,
    cell: String,
    email: String,
    mRatings: String,
    nickname: String,
    major: String,
    level: String,
    createTime: String
});

MemberSchema.statics.getUserBySignupInfo = function (user, email, callback) {
    this.find({$or: [{user: user}, {email: email}]}, callback);
};

MemberSchema.statics.addMember = function (member, callback) {
    this.create(member, callback);
};

MemberSchema.statics.getMember = function (email, callback) {
    this.findOne({email: email}, callback);
};

module.exports = mongoose.model('Member', MemberSchema);