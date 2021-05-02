const express = require('express');
const Favorite = require('../models/favorite');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

// @ Entry point for favorites ('/') handling all reqs:
favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorite.find({user: req.user._id})
    .populate('user')
    .populate('campsites')
    .then(favorites => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(favorites);
    })
    .catch(err => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
        .then((favorite) => {

            if (favorite) {
                req.body.forEach(() => {
                    if(!favorite.campsites._id.exist()) {
                        favorite.campsites.push(_.id)
                    }
                });
 
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            } else {
                
            Favorite.create({user: req.user._id, campsites: req.body})
            .then(favorites => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorites);
            })
            .catch(err => next(err));
        }
    })
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /campsites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOneAndDelete()
        .then(response => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(response);
    })
    .catch(err => next(err));
});

// @Entry point for favorites by campsiteId handling each request by Id only:
favoriteRouter.route('/:campsiteId')
.options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites ${req.params.campsiteId}`);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    Favorite.findOne({user: req.user._id})
        .then((favorite) => {
            if (favorite) {
                    if (!favorite.campsites.exist(req.params.campsiteId)) {
                        favorite.campsites.push(req.params.campsiteId);
                
                favorite.save()
                    .then((favorite) => {
                        res.statusCode = 200;
                        res.setHeader("Content-Type", "application/json");
                        res.json(favorite);
                    })
                    .catch((err) => next(err));
            } else {
                res.statusCode = 200;
                res.end(`Campsite ${req.params.campsiteId} is already a favorites!`)
            }
        } else { 
            Favorite.create({user: req.user._id, campsites: [req.params.campsiteId]})
                .then((favorites) => {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(favorites);
                })
                .catch((err) => next(err));
           }
    })  
    .catch((err) => next(err)); 
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not allowed on /favorites");
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({user: req.user._id})
        .then((favorite) => {
            if (favorite) {
                favorite.campsites.indexOf(req.params.campsiteId);

                if (favorite.campsites.indexOf(req.params.campsiteId) >= 0) {
                    favorite.campsites.splice(index, 1);

                    favorite.save()
                        .then((favorite) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        })
                        .catch((err) => next(err));
                } else {
                    res.statusCode = 200;
                    res.end(`Campsite ID ${req.params.campsiteId} there are no favorites to delete!`)
                }
            }
        })
        .catch((err) => next(err));
    });

module.exports = favoriteRouter;
