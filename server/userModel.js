
module.exports = function(mongoose){
    var Schema = mongoose.Schema;
    var userSchema = new Schema({
        name: String,
        followers: [],
        following:[],
        _id: String,
        email: String,
        photo: String,
        isOnline: Boolean
    })
    var userData = mongoose.model('user',userSchema);

    return userData
};
