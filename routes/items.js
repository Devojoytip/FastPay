const express = require('express')
const router = express.Router()
const multer = require('multer');
const {ensureAuth} = require('../middleware/auth');
const { edit_fn, add_ok, delete_fn, edit_ok, add_item } = require('../controllers/item_controller');


//writing middleware
const multerMiddle = function(itemImage){
    if(itemImage == undefined){
        return next();
    }
    else{
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
              cb(null, 'public/item_images')
            },
            filename: function (req, file, cb) {
                const fname=file.originalname.replace(' ','_').split('.')[0];
              const ext=file.originalname.split('.')[file.originalname.split('.').length-1]
              cb(null, fname  + '-' + Date.now()+'.'+ext)
            }
          })
          
        const uploadOptions = multer({ storage: storage })

        return uploadOptions.single(itemImage);
    }
}


// @desc : welcome page
// @route : GET /item/add
router.get('/:id/add',ensureAuth,add_item)

router.post('/:id/add/ok',multerMiddle('itemImage'),add_ok)

router.post('/:id/delete',ensureAuth,delete_fn)

router.get('/:id/edit',ensureAuth, edit_fn)

router.post('/:id/edit/ok',ensureAuth, edit_ok)

router.post('/:id/delete',ensureAuth,delete_fn)

module.exports = router