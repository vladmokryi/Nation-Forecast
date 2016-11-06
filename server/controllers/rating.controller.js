import Rating from '../models/rating';
import _ from 'lodash';
import mongoose from 'mongoose';

export function getRatingsByUser(req, res) {
  if (req.user) {
    Rating.find({user: req.user._id}).then((ratings)=> {
      let resObj = {};
      _.forEach(ratings, (rate)=> {
        resObj[rate.provider] = true;
      });
      res.json({ratings: resObj});
    }).catch((err)=> {
      res.status(500).send(err);
    });
  } else {
    res.status(401).end()
  }
}

export function setRating(req, res) {
  if (req.user) {
    if (req.body.providerId) {
      Rating.findOne({user: req.user._id, provider: req.body.providerId}).then((rating)=> {
        if (rating) {
          //delete rate
          rating.remove().then(()=> {
            res.json({[req.body.providerId]: false});
          }).catch((err)=> {
            res.status(500).send({err});
          });
        } else {
          //add rating
          let data = {
            user : req.user._id,
            provider : req.body.providerId,
          };
          addRating(data, (err) => {
            if (err) {
              res.status(500).send({err});
            } else {
              res.json({[req.body.providerId]: true});
            }
          });
        }
      }).catch((err)=> {
        res.status(500).send({err});
      });
    } else {
      res.status(400).end()
    }
  } else {
    res.status(401).end()
  }
}

function addRating(data, callback) {
  const newForecast = new Rating(data);
  newForecast.save().then(saved => {
    callback(null, saved);
  }).catch(err => {
    callback(err);
  });
}
