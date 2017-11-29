import User from '../models/user';
import cuid from 'cuid';
import serverConfig from '../config';
import jwt from 'jwt-simple';
import { generateRandomToken, sha512 } from '../util/security';
import _ from 'lodash';

export function get(req, res) {
  if (req.user) {
    res.json({ user: {
      cuid: req.user.cuid,
      email: req.user.email,
      favoriteLocations: req.user.favoriteLocations
    }});
  } else {
    res.status(403).end();
  }
}

export function create(req, res) {
  if (!req.body.user.email || !req.body.user.password) {
    res.status(403).end();
  } else {
    let newUser = new User(req.body.user);
    newUser.cuid = cuid();
    newUser.password_salt = generateRandomToken();
    newUser.password = sha512(newUser.password, newUser.password_salt);

    let payload = { sub: newUser.cuid };

    User.findOne({ email: newUser.email })
      .then((emailUser) => {
        if (emailUser) {
          res.status(409).end();
        } else {
          return newUser.save();
        }
      })
      .then(() => {
        let token = jwt.encode(payload, serverConfig.jwt_token);
        res.json({ token: token});
      })
      .catch(err => {
        res.status(500).send(err);
      });
  }
}

export function addFavoriteLocation(req, res) {
  if (req.user) {
    if (req.body.favorite) {
      let favorite = {
        name: req.body.favorite.name,
        location: req.body.favorite.location
      };
      let index = _.findIndex(req.user.favoriteLocations, function (item) {
        if (item.location) {
          return item.location.coordinates[0] === favorite.location.coordinates[0] && item.location.coordinates[1] === favorite.location.coordinates[1];
        } else {
          return false;
        }
      });
      if (index !== -1) {
        req.user.favoriteLocations.splice(index, 1);
      } else {
        req.user.favoriteLocations.push(favorite);
      }
      req.user.save().then(()=> {
        res.status(200).send({});
      }).catch((err) => {
        res.status(400).send(err);
      })
    } else {
      res.status(400).end();
    }
  } else {
    res.status(403).end();
  }
}

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(serverConfig.sendgrid.apiKey);

export function sendContactEmail(req, res) {
  if (req.user) {
    const msg = {
      to: serverConfig.contactEmail,
      from: 'National Forecast <contact@national-forecast.com>',
      subject: 'Contact form',
      html: '<p><b>From:</b> ' + req.user.email + ' <b>Subject:</b> ' + req.body.subject + '</p><p><b>Text:</b></p>' + req.body.text,
    };
    sgMail.send(msg,false,() => {
      res.status(200).send({});
    });
  } else {
    res.status(403).end();
  }
}
