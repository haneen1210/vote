import mongoose, { Schema, model ,Types} from 'mongoose';
const communicationschema = new Schema({
    socialMedia: [{
        image :{
          type:Object,
          required:true,
        },
        link :{
          type: String,
          required:true,
        },
      }],

      email: {
        type: String,
        required: true,
        unique: true,
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

    createdBy:{type:Types.ObjectId,ref:'User'},
    updateBy:{type:Types.ObjectId,ref:'User'},
},
    {
        timestamps: true,
    }

    );

const communicationModel= mongoose.models.communication || model('communication',communicationschema);
export default communicationModel;

