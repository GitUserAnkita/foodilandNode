var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
const request = require("request");
const Instagram = require("instagram-web-api");
const FileCookieStore = require("tough-cookie-filestore2");
var axios = require("axios");
const instagram = require("./model/instagram");

require("dotenv").config();

var db = require("./config/dbConfig");
db();

const multer = require("multer");
const res = require("express/lib/response");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./insta/");
  },
  filename: function (rea, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storage });
var app = express();

var port = process.env.PORT;

const instBaseUrl = process.env.INSTA_BASE_URL;
const userId = process.env.USER_ID;
const AccessToken = process.env.LONG_ACCESS_TOKEN;

const { username, password } = process.env;
const client = new Instagram({ username, password });

app.use(cors());
app.use(function (req, res, next) {
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.post('/api/posts/instagram', upload.single("photo"), async (req, res) => {
//   const body = req.body;
//   let imagePath = ""
//   if (req.file) {
//     imagePath = req.file.path
//   }
//   const mediaObj = {
//     photo: imagePath,
//     caption: body.caption,
//     post: 'feed'
//   }
//   const cookieStore = new FileCookieStore('./cookies.json')
//   const client = new Instagram({ username, password, cookieStore }, { language: 'es-CL' })
//     ; (async () => {
//       // URL or path of photo
//       console.log()
//       await client.login('cookieStore == ', cookieStore)
//       // Upload Photo to feed or story, just configure 'post' to 'feed' or 'story'
//       const { media } = await client.uploadPhoto(mediaObj)
//       console.log("media === ", media)

//       // console.log(`https://www.instagram.com/p/${media.code}/`)

//       const mediaResponse = new instagram({
//         media_id: media.caption.media_id,
//         mediaLink: `https://www.instagram.com/p/${media.code}/`,
//         caption: media.caption.text
//       })
//       mediaResponse.save().then(postedData => {
//         res.status(200).send({ message: "successfully posted .", postedData, media: media })
//       }).catch(err => {
//         res.status(200).send({ message: err.message })
//       })

//     })()
// })

app.get("/get-auth-code", (req, res, next) => {
  return res.send(
    `<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`
  );
});

app.get("/api/getAllMedia", async (req, res) => {
  let idsArray = [];
  let mediaLinkArray = [];
  let mediaDataArray = [];
  await getAllMediaIds()
    .then((ids) => {
      var id;
      for (var i = 0; i < ids.length; i++) {
        id = ids[i].id;
        idsArray.push(id);
      }
    })
    .catch((err) => {
      res.send(err);
    });

  for (var j = 0; j < idsArray.length; j++) {
    await getMediaLink(idsArray[j])
      .then((data) => {
        if (data.length > 0) {
          mediaLinkArray.push(data);
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }

  for (var k = 0; k < mediaLinkArray.length; k++) { 
    await mediaData(mediaLinkArray[k])
      .then((data) => {
        if (data.length > 0) {
          mediaDataArray.push( {mediaDatad :data});
        }
      })
      .catch((err) => {
        res.send(err);
      });
  }
  res.status(200).send(mediaDataArray)
});

async function getAllMediaIds() {
  var ids = [];
  var config = {
    method: "get",
    url: `${instBaseUrl}/${userId}/media?access_token=${AccessToken}`,
  };
  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      ids = response.data.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return ids;
}

async function getMediaLink(mediaId) {
  // console.log("------------------", mediaId)
  // var mediaLink = []
  var mediaLink;
  var config = {
    method: "get",
    url: `${instBaseUrl}/${mediaId}?fields=caption,id,media_type,media_url,permalink,username,timestamp&access_token=${AccessToken}`,
  };

  await axios(config)
    .then(function (response) {
      // mediaLink.push({link:response.data.permalink})
      mediaLink = response.data.permalink;
    })
    .catch(function (error) {
      console.log(error);
    });
  return mediaLink;
}

async function mediaData(url) {
  var result;
  var config = {
    method: "get",
    url: `https://api.instagram.com/oembed?url=${url}`,
  };
  await axios(config)
    .then(function (response) {
      // console.log(JSON.stringify(response.data));
      // htmlString = JSON.stringify(response.data.html)
      // var replaceData = htmlString.replace(/\\/g, '');
      result = response.data.html;
    })
    .catch(function (error) {
      console.log(error);
      result = error;
    });
  return result;
}

app.get('/api/getMediaData', async (req, res) => {
  var htmlString;
  var config = {
    method: 'get',
    url: 'https://api.instagram.com/oembed?url=https://www.instagram.com/p/CdF783Xtzgo/',
  };
  axios(config)
    .then(function (response) {
      htmlString = JSON.stringify(response.data.html)
      var replaceData = htmlString.replace(/\\/g, '');
      res.send(replaceData)
    })
    .catch(function (error) {
      console.log(error);
    });

})

app.listen(port, () => {
  console.log(`server is ready to port ${port}`);
});

module.exports = app;
