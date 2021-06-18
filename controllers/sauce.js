const Sauce = require('../models/sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes: 0,
    dislikes: 0,
    usersLiked: [''],
    usersDisliked: ['']
  });
  sauce.save()
    .then(() => res.status(201).json({ message: 'Sauce ajoutée !'}))
    .catch(error => res.status(400).json({ error }));
  };
 
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({ error }));
  };
 
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({ error }));
  };

exports.editSauce = (req, res, next) => {
  const sauceObject = req.file ?
  {
    ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };
  Sauce.updateOne({_id: req.params.id}, { ...sauceObject, _id: req.params.id }).then(
    () => {
      res.status(200).json({
        message: 'Votre sauce a été modifiée avec succès !'
      });
    }
  ).catch((error) => {res.status(400).json({error});
    }
  );
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split('/images/')[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: 'Sauce supprimée !'}))
          .catch(error => res.status(400).json({ error }));
      });
    })
}

exports.likeSauce = (req, res, next) => {
  //const likeObject = JSON.parse(req.body.like);
  if (req.body.like == 1) {
    Sauce.updateOne({ _id: req.params.id },{
      $inc: { likes: 1 },
      $push: { usersLiked: req.body.userId },
      $pull: { usersDisliked: req.body.userId }
    })
      .then(() => res.status(201).json({ message: 'Votre like a bien été pris en compte !'}))
      .catch(error => res.status(400).json({ error }));
  };
  if (req.body.like == 0) {
    Sauce.updateOne({ _id: req.params.id },{
      $inc: { likes: -1 },
      //$push: { usersLiked: req.body.userId }
    })
      .then(() => res.status(201).json({ message: 'Votre like a bien été retiré !'}))
      .catch(error => res.status(400).json({ error }));
  };
  if (req.body.like == -1) {
    Sauce.updateOne({ _id: req.params.id },{
      $inc: { dislikes: 1 },
      $push: { usersDisliked: req.body.userId },
      $pull: { usersLiked: req.body.userId }
    })
      .then(() => res.status(201).json({ message: 'Votre dislike a bien été pris en compte !'}))
      .catch(error => res.status(400).json({ error }));
  };
}