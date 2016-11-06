import mongoose from 'mongoose';
import Provider from './provider'
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
});

ratingSchema.post('save', function(doc) {
  Provider.update({_id: doc.provider.toString()}, {$inc: { rating: 1}}, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

ratingSchema.post('remove', function(doc) {
  Provider.update({_id: doc.provider.toString()}, {$inc: { rating: -1}}, (err) => {
    if (err) {
      console.log(err);
    }
  });
});

export default mongoose.model('Rating', ratingSchema);
