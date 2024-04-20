
import mongoose, { Schema, model ,Types} from 'mongoose';
const contectschema = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    
    email: {
        type: String,
        required: true,
        unique: true,
    },
    
    phone: {
        type: String,
        required:true,
        unique:true,
    },
    message:{
        type: String,
        required:true,
    }
    
},
    {
        timestamps: true,
    }

    );
    const contectModel= mongoose.models.contect || model('contect',contectschema);
export default contectModel;
