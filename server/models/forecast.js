import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const forecastSchema = new Schema({
  provider: { type: Schema.Types.ObjectId, ref: 'Provider', required: true },
  city: {},
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: Array
  },
  list: [{
    date: { type: 'Date'},
    min: { type: Number },
    max: { type: Number },
    weather: {}
  }],
  createdAt: { type: 'Date', default: Date.now},
});

forecastSchema.index({ location : '2dsphere' });

//todo: add TTL index

export default mongoose.model('Forecast', forecastSchema);
