import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const providerSchema = new Schema({
  name: {type: 'String', required: true},
  displayName: {type: 'String', required: true},
  link: {type: 'String', required: true},
  rating: {type: Number, default: 1}
});

export default mongoose.model('Provider', providerSchema);
