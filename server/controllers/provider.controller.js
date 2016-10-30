import Provider from '../models/provider';
import _ from 'lodash';

export function allRating(req, res, next) {
  if (req.forecasts && req.forecasts.length) {
    let providers = _.map(req.forecasts, forecast => {
      return forecast.provider._id;
    });
    Provider.aggregate([
        {$match: {_id: {$in: providers}}},
        {
          $group: {
            _id: null,
            rating: {$sum: "$rating"}
          }
        }
      ],
      (err, result) => {
        if (err || !result || !result.length) {
          res.status(500).end();
        } else {
          req.rating = result[0].rating;
          next();
        }
      }
    )
  } else {
    res.status(500).end();
  }
}

export function getAll(req, res) {
  Provider.find().then(providers => {
    res.status(200).send({providers});
  }).catch(err => res.status(500).end());
}
