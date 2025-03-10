/* <----------------------- MODULOS --------------------------> */
const express = require('express');

/* <-------------------- RUTAS ESPECIFICAS ------------------------> */
const authRoutes = require("./auth.routes.js");
const userRoutes = require('./user.routes.js');
const postRoutes = require("./post.routes.js");
const badgeRoutes = require('./badge.routes.js');
const hashtagRoutes = require('./hashtag.routes.js');
const commentRoutes = require("./comment.routes.js");
const reportRoutes = require("./report.routes.js");
const notificationRoutes = require("./notification.routes.js");

const savedPostRoutes = require("./savedPost.routes.js");


const visualizationRoutes = require("./visualization.routes.js");
/* <------------------------ MIDDLEWARES ---------------------------> */
const authenticationMiddleware  = require("../middlewares/authentication.middleware.js");
const authorizationMiddleware  = require("../middlewares/authorization.middleware.js");

/* <------------------- ENRUTADOR SECUNDARIO ----------------------> */
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", authenticationMiddleware, userRoutes);
router.use("/posts", postRoutes);
router.use("/badges", badgeRoutes);
router.use("/hashtags", hashtagRoutes);
router.use("/comments", commentRoutes);
router.use("/reports", reportRoutes);
router.use("/notifications", notificationRoutes);

router.use("/savedPost", savedPostRoutes);

router.use("/visualization", visualizationRoutes);

module.exports = router;