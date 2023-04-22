const { response, request } = require('express');
const path = require('path');
const fs = require('fs');
const { uploadFile: uploadFileH } = require('../helpers/uploadFile');
const { User, Product } = require('../models');
const cloudinary = require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);


const uploadFile = async (req = request, res = response) => {
  const file = req.files.file;

  try {
    const resUp = await uploadFileH(
      file,
      ['jpg', 'png', 'gif', 'jpeg'],
      '../uploads'
    );
    return res.status(201).json({
      msg: resUp,
    });
  } catch (error) {
    return res.status(400).json({
      msg: error,
    });
  }
};

const updateModelImg = async(imageFile, model, pathModel) => {
  const imgName = await uploadFileH(
    imageFile,
    ['jpg', 'png', 'gif', 'jpeg'],
    pathModel
  );
  
  if(model.img){
    //borrar;
    const pathDir = path.join(__dirname, pathModel, model.img);
    if(fs.existsSync(pathDir)){
      fs.rmSync(pathDir);
    }
  }

  model.img = imgName;
  await model.save();
  return imgName;
}

const updateModelImgCloudinary = async (imageFile, model) => {

  if(model.img){
    //borrar;
    const paths = model.img.split('/');
    const imgId = paths[paths.length - 1].split('.')[0];
    console.log(imgId);
    cloudinary.uploader.destroy(imgId);
  }

  console.log(imageFile.tempFilePath);
  const { secure_url } = await cloudinary.uploader.upload(imageFile.tempFilePath);
  console.log(secure_url);
  model.img = secure_url;
  await model.save();
  return secure_url;
}

const updateImage = async (req = request, res = response) => {
  switch (req.params.collection) {
    case 'users':
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          msg: `No existe este usuario`,
        });
      }
      try {
        await updateModelImg(req.files.file, user, '../uploads/users');
        return res.json({
          user: {
            id: user.id,
            img: user.img
          }
        });
      } catch (error) {
        return res.status(500).json({
          msg: error,
        });
      }
      break;
    case 'products':
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          msg: `No existe este producto`,
        });
      }
      try {
        await updateModelImg(req.files.file, product, '../uploads/products');
        return res.json({
          product: {
            id: product.id,
            img: product.img
          }
        });
      } catch (error) {
        return res.status(500).json({
          msg: error,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'No se valido está opcion',
      });
  }
};


const updateImageCloudinary = async (req = request, res = response) => {
  switch (req.params.collection) {
    case 'users':
      const user = req.user;
      if (!user) {
        return res.status(404).json({
          msg: `No existe este usuario`,
        });
      }
      try {
        await updateModelImgCloudinary(req.files.file, user);
        return res.json({
          user: {
            id: user.id,
            img: user.img
          }
        });
      } catch (error) {
        return res.status(500).json({
          msg: error,
        });
      }
      break;
    case 'products':
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          msg: `No existe este producto`,
        });
      }
      try {
        await updateModelImgCloudinary(req.files.file, product);
        return res.json({
          product: {
            id: product.id,
            img: product.img
          }
        });
      } catch (error) {
        return res.status(500).json({
          msg: error,
        });
      }
      break;
    default:
      return res.status(500).json({
        msg: 'No se valido está opcion',
      });
  }
};


const getImage = async (req = request, res = response) => {
  let img = null;
  let pathImg;
  switch (req.params.collection) {
    case 'users':
      const user = await User.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          msg: `No existe este usuario`,
        });
      }
      img = user.img;
      pathImg = path.join(__dirname, '../uploads/users', user.img ?? '');
      break;
    case 'products':
      const product = await Product.findById(req.params.id);
      if (!product) {
        return res.status(404).json({
          msg: `No existe este producto`,
        });
      }
      img = product.img;
      pathImg = path.join(__dirname, '../uploads/products', product.img ?? '');
      break;
    default:
      return res.status(500).json({
        msg: 'No se valido está opcion',
      });
  }

  if(!img) {
    return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
  }

  if(!fs.existsSync(pathImg)) {
    return res.sendFile(path.join(__dirname, '../assets/no-image.jpg'));
  }

  res.sendFile(pathImg);
}

module.exports = {
  uploadFile,
  updateImage,
  getImage,
  updateImageCloudinary,
};
