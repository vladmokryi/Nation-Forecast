import Rating from '../models/rating';
import Provider from '../models/provider';
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

export function setRating(req, res, next) {
  if (req.user) {
    if (req.body.providerId) {
      Rating.findOne({user: req.user._id, provider: req.body.providerId}).then((rating)=> {
        if (rating) {
          //delete rate
          rating.remove().then(()=> {
            Provider.findOne({_id: req.body.providerId}).then((provider) => {
              if (provider) {
                res.json({
                  providerId: req.body.providerId,
                  rating: {[req.body.providerId]: false},
                  count: provider.rating
                });
              } else {
                res.status(404).send({});
              }
            }).catch((err)=> {
              res.status(500).send({err});
            });
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
              Provider.findOne({_id: req.body.providerId}).then((provider) => {
                if (provider) {
                  res.json({providerId: req.body.providerId, rating: {[req.body.providerId]: true}, count: provider.rating});
                } else {
                  res.status(404).send({});
                }
              }).catch((err)=> {
                res.status(500).send({err});
              });
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
