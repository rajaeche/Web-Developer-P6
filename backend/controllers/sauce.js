
// modèle
const Sauce = require('../models/Sauce');

// package pour gérer les fichiers
const fs = require('fs');


// ------Afficher toutes Les Sauces---------
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
        (sauces) => {
            res.status(200).json(sauces);
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
};



// ----------Créer Une Sauce-----------
exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject._userId;
    const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });
    sauce.save()
        .then(() => { res.status(201).json({ message: 'Sauce added !' }); })
        .catch(error => res.status(400).json({ error }));
};


// --------Like et Dislike------------
exports.likeDislike = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => {

            // LIKE
            if (!sauce.usersLiked.includes(req.body.userId) && req.body.like === 1) {
                Sauce.updateOne(
                    { _id: req.params.id }, { $inc: { likes: 1 }, $push: { usersLiked: req.body.userId } }
                )
                .then(() => { res.status(201).json({ message: 'Sauce liked !' }); })
                .catch(error => res.status(400).json({ error }));
            };
            if (sauce.usersLiked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne(
                    { _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId } }
                )
                .then(() => { res.status(201).json({ message: 'Sauce unliked !' }); })
                .catch(error => res.status(400).json({ error }));
            };

            // DISLIKE
            if (!sauce.usersDisliked.includes(req.body.userId) && req.body.like === -1) {
                Sauce.updateOne(
                    { _id: req.params.id }, { $inc: { dislikes: 1 }, $push: { usersDisliked: req.body.userId } }
                )
                .then(() => { res.status(201).json({ message: 'Sauce disliked !' }); })
                .catch(error => res.status(400).json({ error }));
            };
            if (sauce.usersDisliked.includes(req.body.userId) && req.body.like === 0) {
                Sauce.updateOne(
                    { _id: req.params.id }, { $inc: { dislikes: -1 }, $pull: { usersDisliked: req.body.userId } }
                )
                .then(() => { res.status(201).json({ message: 'Sauce undisliked !' }); })
                .catch(error => res.status(400).json({ error }));
            };
        })
        .catch((error) => { res.status(400).json({ error: error }); });
};



// ----------Afficher une sauce-------------
exports.getSingleSauce = (req, res, next) => {
    Sauce.findOne({
        _id: req.params.id
    })
        .then((sauce) => { res.status(200).json(sauce); })
        .catch((error) => { res.status(400).json({ error: error }); })
};




// ----------Modifier la sauce---------
exports.editSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
            if (req.file) {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, (error) => {
                    if (error) throw error;
                })
            }
            const sauceObject = req.file ? {
                ...JSON.parse(req.body.sauce),
                imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
            } : { ...req.body };
            Sauce.updateOne({ ...req.params.id }, sauceObject)
                .then(() => { res.status(200).json({ message: 'Sauce updated' }) })
                .catch((error) => { res.status(401).json({ error }) });
        })
        .catch((error) => { res.status(401).json({ error }) });
};



// ----------Supprimer la sauce--------
exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id})
        .then(sauce => {
            if (sauce.userId != req.auth.userId) {
                res.status(401).json({message: 'Not authorized'});
            } else {
                const filename = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${filename}`, () => {
                    Sauce.deleteOne({_id: req.params.id})
                        .then(() => { res.status(200).json({message: 'Sauce deleted !'})})
                        .catch(error => res.status(401).json({ error }));
                });
            }
        })
        .catch( error => {
            res.status(500).json({ error });
        });
 };


