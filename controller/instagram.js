const request = require("request");
const Instagram = require("instagram-web-api");
var axios = require("axios");

require("dotenv").config();

const instBaseUrl = process.env.INSTA_BASE_URL;
const userId = process.env.USER_ID;
const AccessToken = process.env.LONG_ACCESS_TOKEN;
const { username, password } = process.env;
const client = new Instagram({ username, password });

exports.getAllMediaData = async (req, res) => {
  try{
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
            mediaDataArray.push({ mediaDatad: data });
          }
        })
        .catch((err) => {
          res.send(err);
        });
    }
    console.log("=============",mediaDataArray)
    res.status(200).send(mediaDataArray);
  }catch(err){
    res.send({message:err.message});
  }
};

exports.getAuthCode = async(req,res) =>{
    res.send(
        `<a href='https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_APP_ID}&redirect_uri=${process.env.REDIRECT_URI}&scope=user_media,user_profile&response_type=code'> Connect to Instagram </a>`
      );
}

async function getAllMediaIds() {
  var ids = [];
  var config = {
    method: "get",
    url: `${instBaseUrl}/${userId}/media?access_token=${AccessToken}`,
  };
  await axios(config)
    .then(function (response) {
      ids = response.data.data;
    })
    .catch(function (error) {
      console.log(error);
    });
  return ids;
}

async function getMediaLink(mediaId) {
  var mediaLink;
  var config = {
    method: "get",
    url: `${instBaseUrl}/${mediaId}?fields=caption,id,media_type,media_url,permalink,username,timestamp&access_token=${AccessToken}`,
  };

  await axios(config)
    .then(function (response) {
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
      result = response.data.html;
    })
    .catch(function (error) {
      console.log(error);
      result = error;
    });
  return result;
}
