const { v4: uuid } = require('uuid');
const path = require('path');

const uploadFile = async (file, validExt = ['jpg', 'png', 'gif', 'jpeg'], pathDir = '') => {

  const fileExts = file.name.split('.');
  const fileExt = fileExts[fileExts.length - 1].toLowerCase();

  if(!validExt.includes(fileExt)){
    throw `Extension invalida ${validExt}`;
  }

  const newName = uuid() + "."+ fileExt;

  const uploadDir = path.join(__dirname, pathDir, newName);

  const promUpload = new Promise((resolve, reject) => {
    file.mv(uploadDir, (error) => {
      if(error) {
        reject(error);
      }
      
      resolve(newName);
    });
  });

  return promUpload;
}


module.exports = {
  uploadFile,
}