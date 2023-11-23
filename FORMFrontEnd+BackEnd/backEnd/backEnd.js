const express = require('express');
const app = new express();
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const { ConnectDB, getDB } = require('./connectingDB');
const { ObjectId } = require('mongodb');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

let DB;

ConnectDB((error) => {
  if (!error) {
    app.listen(5000, function () {
      console.log('Server work');
      DB = getDB();
    });
  } else {
    console.log(error);
  }
});



function verify(req, res, next){
    let token = req.headers['authorization']

    if(!token){
      res.status(401).json({message: 'Token undefined'})
    }

    if(token){
      let JWT = token.split(' ')[1]
      console.log(JWT)


      jwt.verify(JWT, 'key', (err, decode)=>{
        if(err){
         res.status(404).json({message:'Eror'})
        }
         req.user = decode
         next();
     })
    }

}
app.post('/logToken', verify, (req, res)=>{
   res.status(200).json({message: `The token matches the user's key`})
})
  
 


//Send  data  post register in MongoDB 
app.post('/register', async function (req, res) {
  const { username, login, password } = req.body;

  const collection = await DB.collection('test');
  const user = await collection.findOne({ $or: [{ username }, { login }] });

  let data = {};

  if (user) {
    data.message = 'User exists';
    res.status(409).json(data.message);
  } else {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    data.usingDB = await collection.insertOne({ username, login, password: hash });

    res.status(200).json(data.usingDB);
  }
});

function generateToken(token, key) {
  return jwt.sign(token, key, { expiresIn: '1h' });
}

//Send  data  post login in MongoDB 
app.post('/login', async function (req, res) {
  const { login, password } = req.body;  // Assuming you are sending 'login' and 'password' from the client

  try {
    const user = await DB.collection('test').findOne({ login });
    // console.log('User from DB:', user);
    if (user) {
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (passwordMatch) {
        const token = { userId: user._id, login: user.login }; 
        const secretKey = 'key'; // Update to use 'user.login'  // Replace with a more secure secret key
        const jwtToken = generateToken(token, secretKey);
        res.status(200).json({jwtToken});
      } else {
        res.status(401).json({ error: 'Invalid password' });
      }
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});



// const checkAuth = (req, res, next) => {
//   const token = req.headers.authorization;

//   if (!token) {
//     return res.status(401).json({ error: 'Unauthorized' });
//   }

//   jwt.verify(token.replace('Bearer ', ''), 'your_secret_key', (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ error: 'Invalid token' });
//     }

//     // Помістіть інформацію з токена в об'єкт запиту для подальшого використання
//     req.user = decoded;
//     next();
//   });
// };

// app.get('/user/:id', checkAuth, async function(req, res) {
//   try {
//     // Витягуємо з БД відповідного юзера за id, яке передано в параметрах запиту
//     const userId = req.params.id;
//     const data = await getDB().collection('users').findOne({ _id: ObjectId(userId) });

//     if (data) {
//       res.status(200).json(data);
//     } else {
//       res.status(404).json({ error: 'User not found' });
//     }
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: 'Server error' });
//   }
// });











app.get('/getSrver', async function (req, res) {
  let data = { registe: 'Register', id: 1 };
  res.status(200).json(data);
});

//Find data with MongoDB
app.get('/data', async function (req, res) {
  const { login } = req.query;

  try {
    let data = await DB.collection('test').findOne(req.query);
    if (data) {
      res.status(200).json(data);
    } else {
      res.status(404).json({ error: 'Дані не знайдено' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Помилка сервера' });
  }
});

//Delete document in MongoDB
app.get('/d', function (req, res) {
  try {
    const connection = DB.collection('test');
    const drop = connection.deleteMany();
    res.status(200).json(drop);
  } catch (err) {
    res.status(500).json(`${err} delete`);
  }
});


// Middleware for handling missing or invalid JWT


