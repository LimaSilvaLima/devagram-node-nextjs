import mongoose, {Schema} from 'mongoose';

const SeguidorSchema = new Schema({
    usuarioId : {type : String, required : true},
    usuarioSeguidoId : {type : String, required : true}
});

export const seguidorModel = (mongoose.models.seguidores ||
    mongoose.model('seguidores', SeguidorSchema));