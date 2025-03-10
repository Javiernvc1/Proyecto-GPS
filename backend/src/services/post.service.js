/* <----------------------- MODELOS --------------------------> */
const Post = require("../models/post.model");
const User = require("../models/user.model");
const Hashtag = require("../models/hashtag.model.js");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require("../utils/errorHandler.js");

/* <----------------------- UTILS ------------------------> */
const { saveImagePost, saveHashtagsPost } = require("../utils/generalUtils.js");

/* <----------------------- TRIGGERS ------------------------> */
const { checkAchievementsPost } = require("../triggers/achievements.trigger.js");

/**
 * Servicio para crear una publicacion utilizando datos proporcionados
 * @param {Object} post - Objeto que contiene datos de publicacion a crear
 * @param {string} post.title - Título de la publicación.
 * @param {string} post.description - Descripción de la publicación.
 * @param {Array} post.images - Arreglo de imágenes asociadas a la publicación.
 * @param {string} post.author - ID del autor de la publicación.
 * @param {Array} post.hashtags - Arreglo de hashtags asociados a la publicación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[newPost, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function createPost(post, files = []) {
    try {
        const { title, description, author, hashtags } = post;
        const userExists = await User.findOne({ _id: author })
        if(!userExists) return [null, "Id de usuario a crear publicacion no existe, verifica id."];

        if (userExists.isBanned) return [null, `El usuario con ID ${author} está baneado y no puede crear publicaciones.`];

        const fileNames = await Promise.all(
            files.map( file => saveImagePost(file) )
        );
        const hashtagsIDs = await saveHashtagsPost(hashtags);

        const newPost = new Post({ title, description, images:fileNames, author, hashtags: hashtagsIDs })
        await newPost.save();

        userExists.posts.push(newPost._id);
        await userExists.save();

        checkAchievementsPost(author);

        return [newPost, null]
    } catch (error) {
        handleError(error, "post.service -> createPost");
    }
}
/**
 * Servicio para obtener todas las publicaciones existentes
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getPosts() {
    try{
        const posts = await Post.find()
        if(!posts) return [null, "No se encontraron publicaciones"];

        // Obtén los IDs únicos de los autores
        const authorIds = [...new Set(posts.map(post => post.author))];
        // Busca los autores por sus IDs y obtén solo sus nombres
        const authors = await User.find({ _id: { $in: authorIds } }, 'name');

        // ID de hashtags por publicacion
        const HashtagsIds = posts.reduce((acc, post) => {
            post.hashtags.forEach(hashtag => acc.add(hashtag)); // Agregar todos los hashtags de todas las publicaciones
            return acc;
        }, new Set());

        // Busca los hashtags por sus IDs y obtén solo sus nombres
        const hashtags = await Hashtag.find({ _id: { $in: [...HashtagsIds] } }, 'nameHashtag');

        // Mapea los hashtags para acceder a ellos por su ID
        const hashtagsMap = hashtags.reduce((acc, hashtag) => {
            acc[hashtag._id] = { id: hashtag._id, name: hashtag.nameHashtag };
            return acc;
        }, {});

        // Convierte el array de autores en un objeto para un acceso rápido
        const authorsMap = authors.reduce((acc, author) => {
            acc[author._id] = { id: author._id, name: author.name };
            return acc;
        }, {});

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
            author: { id: post.author, name: authorsMap[post.author].name },
            hashtags: post.hashtags.map(hashtagId => hashtagsMap[hashtagId])
        }));

        return[publicationData, null];

    }catch(error){
        handleError(error, "post.service -> getPosts");
    }
}
/**
 * Servicio de busqueda y obtencion de publicacion existente por su id
 * @param {string} id - id del usuario a obtener publicaciones.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[post, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getPostByID(id) {
    try {
        const post = await Post.findById({ _id: id});
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        return [post, null]
    } catch (error) {
        handleError(error, "post.service -> getPostByID");
    }
}
/**
 * Servicio de busqueda y obtencion de todas las publicaciones de un usuario especifico
 * @param {string} id id del usuario del cual se obtendran publicaciones
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[posts, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function getUserPosts(id) {
    try {
        const user = await User.findById(id)
            .select("-password")
            .populate("roleUser")
            .exec();
        if (!user) return [null, "No se encontró usuario"];

        const posts = await Post.find({ author: user._id });
        if (!posts.length) return [null, "No se encontraron publicaciones"];

        // Obtén los IDs únicos de los autores (solo será uno en este caso)
        const authorIds = [user._id];

        // Busca los autores por sus IDs y obtén solo sus nombres
        const authors = await User.find({ _id: { $in: authorIds } }, 'name');

        // ID de hashtags por publicacion
        const HashtagsIds = posts.reduce((acc, post) => {
            post.hashtags.forEach(hashtag => acc.add(hashtag)); // Agregar todos los hashtags de todas las publicaciones
            return acc;
        }, new Set());

        // Busca los hashtags por sus IDs y obtén solo sus nombres
        const hashtags = await Hashtag.find({ _id: { $in: [...HashtagsIds] } }, 'nameHashtag');

        // Mapea los hashtags para acceder a ellos por su ID
        const hashtagsMap = hashtags.reduce((acc, hashtag) => {
            acc[hashtag._id] = { id: hashtag._id, name: hashtag.nameHashtag };
            return acc;
        }, {});

        // Convierte el array de autores en un objeto para un acceso rápido
        const authorsMap = authors.reduce((acc, author) => {
            acc[author._id] = { id: author._id, name: author.name };
            return acc;
        }, {});

        const publicationData = posts.map(post => ({
            ...post.toObject(),
            images: post.images.map(imageName => `http://localhost:3001/uploads/images/${imageName}`),
            author: { id: post.author, name: authorsMap[post.author].name },
            hashtags: post.hashtags.map(hashtagId => hashtagsMap[hashtagId])
        }));

        return [publicationData, null];

    } catch (error) {
        handleError(error, "post.service -> getUserPosts");
        return [null, "Error al obtener publicaciones del usuario"];
    }
}

/**
 * Servicio para actualizar los campos de una publicación existente.
 * @param {string} id - ID de la publicación a actualizar.
 * @param {Object} body - Objeto que contiene los campos a actualizar.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[postUpdated, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function updatePost(id, body) {
    try {
        const post = await Post.findById(id);
        if(!post) return [null, `No se encontro la publicacion de id: ${id}`];
        const { title, description, hashtags, status } = body;
        const postUpdated = await Post.findByIdAndUpdate(
            id,
            { title, description, hashtags, status },
            { new: true }
        );
        return [postUpdated, null];
    } catch (error) {
        handleError(error, "post.service -> updatePost");
    }
}
/**
 * Servicio para eliminar una publicación existente por su ID.
 * @param {string} id - id de la publicación a eliminar.
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene `[postDeleted, null] si tiene éxito o `[null, mensaje de error]` si falla.
 */
async function deletePost(id){
    try {
        const postDeleted = await Post.findByIdAndDelete(id);
        if(!postDeleted) return [null, `No se encontro publicacion de id: ${id}`];
        await User.updateOne(
            { _id: postDeleted.author },
            { $pull: { posts: id } }
        );
        return [postDeleted, null];
    } catch (error) {
        handleError(error, "post.service -> deletePost");
    }
}
/**
 * 
 * @param {string} postId - El id de publicacion.
 * @param {string} userId - El id de usuario que interactua con la publicacion.
 * @param {string} interactionType - El tipo de interacción ("helpful" o "nothelpful").
 * @returns {Promise<Array>} Promesa que resuelve un arreglo que contiene la publicacion y la interaccion actualizada si tiene exito,si falla retorna `[null, mensaje de error]`
 */
async function markPostInteraction(postId, userId, interactionType){
    try {
        const postExist = await Post.findById(postId);
        if(!postExist) return [null, `No se encontro publicacion de id: ${id}`];
        const userExist = await User.findById(userId);
        if(!userExist) return [null, `No se encontro usuario de id: ${userId}`];

        if(userExist.isBanned) return [null, `El usuario con ID ${userId} está baneado y no puede interactuar con la publicación.`];
        
        if (interactionType !== "helpful" && interactionType !== "nothelpful") return [null, "El tipo de interacción debe ser 'helpful' o 'nothelpful'"]

        // Busqueda de interacciones previas de usuario con la publicacion
        const userInteractionIndex = postExist.interactions.findIndex( interaction =>interaction.user.toString() === userId)
        // Si el usuario ya ha interactuado antes con la publicacion
        if(userInteractionIndex !== -1){
            // Si la interaccion nueva es igual a la previa, se elimina
            if(postExist.interactions[userInteractionIndex].type === interactionType){
                postExist.interactions.splice(userInteractionIndex, 1);
            } else{
                // Si la interaccion nueva es distinta a la previa, se actualiza por la nueva.
                postExist.interactions[userInteractionIndex].type = interactionType;
            }
        }
        else{
            postExist.interactions.push({user: userId, type: interactionType});
        }
        await postExist.save();
        return [postExist, null]
    } catch (error) {
        handleError(error, "post.service -> markPostInteraction")
    }
}

module.exports = {
    createPost,
    getPosts,
    getPostByID,
    getUserPosts,
    updatePost,
    deletePost,
    markPostInteraction
}