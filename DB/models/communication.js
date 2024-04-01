import mongoose, { Schema, model ,Types} from 'mongoose';
const communicationschema = new Schema({
    type: {
        type: String,
        enum: ['email', 'whatsapp', 'facebook', 'instagram'],
        required: true
      },
      address: {
        type: String,
        required: true
      },
      logo: {
        type: String, // Assuming the logo will be stored as a URL
        required: false 
      },
      phone: {
        type: String,
        required:true,
        unique:true,
    },
},
    {
        timestamps: true,
    }

    );

const communicationModel= mongoose.models.communication || model('communication',communicationschema);
export default communicationModel;

