var mongoose = require( 'mongoose' );
var Schema   = mongoose.Schema;


var Joueur =  new Schema ({
		pseudo : {
		type : String,
		required : true,
		unique : true},
		highScore : {
		type : String,
		required : false},
		ghost: [String],
		
});


mongoose.model('Joueur', Joueur);
//mongoose.model( 'Todo', Todo );
//mongoose.connect( 'mongodb://localhost/zzzzzzzzzzzzzzzz' );
mongoose.connect( 'mongodb://127.0.0.1/game' );
//mongoose.connect( 'mongodb://localhost/umlDB');