const express = require('express');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');

const sauceRoutes = require('./routes/sauce');
const userRoutes = require('./routes/user');

mongoose.connect('mongodb+srv://YannLcrx:qzoX5sfkx0Mc62cf@cluster0.td9cx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
   next();
 });

app.use(bodyParser.json());

app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);
 
/*app.use('/api/sauces', (req, res, next) => {
   const sauce = [
     {
       _id: 'oeihfzeoi',
       userId: '42',
       name: 'Ketchup louche',
       manufacturer: 'Un gars un peu balafré',
       description: 'Les infos de mon premier objet',
       mainPepper: 'Du piment despelette',
       imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
       heat: 4,
       likes: 2,
       dislikes: 1,
       usersLiked: ['jean-michel', 'kirby59'],
       usersDisliked: ['zoulman']
     },
     {
      _id: 'oeihfzeoi',
      userId: '42',
      name: 'Moutarde au miel vert',
      manufacturer: 'Algérie',
      description: 'Les infos de mon deuxième objet',
      mainPepper: 'Du Selecto',
      imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
      heat: 8,
      likes: 5,
      dislikes: 2,
      usersLiked: ['jean-michel', 'kirby59', 'DJAishaDu13', 'Darge','JPKOF'],
      usersDisliked: ['zoulman','Catherine Ringer'],
    },
   ];
   res.status(200).json(sauce);
 });*/

module.exports = app;