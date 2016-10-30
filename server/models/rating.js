import mongoose from 'mongoose';
import Provider from './provider'
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  user: {type: 'String', required: true},
  provider: {type: 'String', required: true},
});

ratingSchema.post('save', function(doc) {
  Provider.update({_id: doc.provider}, {$inc: { rating: 1}});
});

ratingSchema.post('remove', function(doc) {
  Provider.update({_id: doc.provider}, {$inc: { rating: -1}});
});

export default mongoose.model('Rating', ratingSchema);
