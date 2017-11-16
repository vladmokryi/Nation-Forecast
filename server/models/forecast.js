import mongoose from 'mongoose';
const Schema = mongoose.Schema;
import serverConfig from '../config';

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
    avg: { type: Number },
    humidity: { type: Number },
    pressure: { type: Number },
    wind: {
      speed: { type: Number },
      deg: { type: Number },
      gust: { type: Number }
    },
    weather: {}
  }],
  createdAt: { type: 'Date', default: Date.now},
});

forecastSchema.index({ location : '2dsphere' });
forecastSchema.index({ createdAt: 1}, {expireAfterSeconds: serverConfig.cache.period});

export default mongoose.model('Forecast', forecastSchema);
