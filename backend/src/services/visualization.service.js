const Post = require('../models/post.model');
const User = require('../models/user.model');
const Hashtag = require('../models/hashtag.model'); 
const { handleError } = require("../utils/errorHandler.js");

/**
 * Servicio de busqueda de contenido en las publicaciones por usuario, hashtags, título y descripción
 * @param {string} query - El término de búsqueda.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function searchPosts(query) {
    try {
        console.log(query);
        // Asegurarse de que query sea una cadena
        const searchString = String(query);

        // Buscar usuarios cuyo nombre coincida con el query
        const users = await User.find({ name: { $regex: searchString, $options: 'i' } });
        const userIds = users.map(user => user._id);
        const hashtags = await Hashtag.find({ name: { $regex: searchString, $options: 'i' } });
        const hashtagIds = hashtags.map(hashtag => hashtag._id);
        // Buscar posts por título, hashtags o autor
        const posts = await Post.find({
            $or: [
                { title: { $regex: searchString, $options: 'i' } },
                { hashtags: { $in: hashtagIds} },
                { author: { $in: userIds } }
            ]
        });

        if (!posts.length) return [null, `No se encontraron publicaciones con el término de búsqueda: ${searchString}`];
        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> searchPosts");
        // Asegúrate de devolver un valor que pueda ser desestructurado correctamente, incluso en caso de error.
        return [null, error.message];
    }
}

/**
 * Servicio para obtener las publicaciones de usuarios y hashtags seguidos, ordenadas por tendencias
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getTrendingPosts(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return [null, `No se encontró al usuario con el ID: ${userId}`];

        const followedUsersPosts = await Post.find({ author: { $in: user.followed } });
        const followedHashtagsPosts = await Post.find({ hashtags: { $in: user.followedHashtags } });

        const posts = followedUsersPosts.concat(followedHashtagsPosts);

        posts.sort((a, b) => (b.comments.length + b.interactions.length) - (a.comments.length + a.interactions.length));

        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> getTrendingPosts");
    }
}

/**
 * Servicio para obtener las publicaciones de usuarios y hashtags seguidos
 * @param {string} userId - El ID del usuario.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getFollowedPosts(userId) {
    try {
        const user = await User.findById(userId);
        if (!user) return [null, `No se encontró al usuario con el ID: ${userId}`];

        const followedUsersPosts = await Post.find({ author: { $in: user.followed } });
        const followedHashtagsPosts = await Post.find({ hashtags: { $in: user.followedHashtags } });

        const posts = followedUsersPosts.concat(followedHashtagsPosts);

        return [posts, null];
    } catch (error) {
        handleError(error, "post.service -> getFollowedPosts");
    }
}


module.exports = {
    searchPosts,
    getTrendingPosts,
    getFollowedPosts
}