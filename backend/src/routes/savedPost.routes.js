/* <----------------------- DEPENDENCIAS --------------------------> */
const express = require('express');

/* <----------------------- CONTROLADOR ---------------------------> */
const SavedPostController = require('../controllers/savedPost.controller.js');

/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR TERCIARIO -----------------------> */
const router = express.Router();

router.post('/:id/saved-posts', SavedPostController.savePost);
router.get('/:id/saved-posts', SavedPostController.getSavedPosts);
router.delete('/:id/saved-posts', SavedPostController.removeSavedPost);

module.exports = router;