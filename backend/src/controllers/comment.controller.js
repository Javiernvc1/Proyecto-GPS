/* <----------------------- SERVICIOS ------------------------> */
const CommentService = require('../services/comment.service');
const Post = require('../models/post.model');
const NotificationService = require('../services/notification.service');

/* <----------------------- SCHEMA ------------------------> */
// [NOTA]: Revisar incorporacion de schema de COMMENT
const { userIdSchema } = require("../schema/user.schema.js");

/* <----------------------- FUNCIONES ------------------------> */
// Funciones que manejan las respuestas HTTP exitosas/erroneas.
const { respondSuccess, respondError } = require('../utils/resHandler');
// handleError: Funcion de registro y manejo de errores de manera centralizada 
const { handleError } = require('../utils/errorHandler');


/**
 * Crea un nuevo comentario utilizando el servicio 'CommentService.createComment()' con el parametro de body
 * que contiene los campos necesarios y requeridos del comentario.
 * @param {Object} req - Objeto de solicitud (request) para crear un nuevo comentario a partir de req.body
 * @param {Object} res -  Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function createComment(req, res) {
    try {
        const { userComment, userId, postId } = req.body;
        const comment = { userComment, userId, postId };
        const [newComment, commentError] = await CommentService.createComment(comment, req.files);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!newComment) return respondError(req, res, 400, 'No se creo el comentario');

                // Encuentra la publicación para obtener la ID del dueño
                const post = await Post.findById(postId);
                if (post) {
                    // Crea una notificación para el dueño de la publicación
                    const notificationContent = `El usuario ${userId} ha comentado tu publicación.`;
                    const notificationData = {
                        contentNotification: notificationContent,
                        userId: post.ownerId, // Asumiendo que post tiene un campo ownerId
                        dateNotification: new Date()
                    };

                    await NotificationService.createNotification(notificationData);
                    // No es necesario manejar el resultado de la creación de la notificación aquí, pero puedes hacerlo si es necesario
                }

        respondSuccess(req, res, 201, newComment);
    } catch (error) {
        handleError(error, 'comment.controller -> createComment');
        respondError(req, res, 500, 'No se creo comentario');
    }
}
/**
 * Busca y obtiene todos los comentarios creados utilizando el servicio 'CommentService.getComments()'.
 * @param {Object} req - El objeto de solicitud (request) no se utiliza en esta funcion.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getComments(req, res) {
    try {
        const [comments, errorComments] = await CommentService.getComments();
        if (errorComments) return respondError(res, 500, 'Error al buscar comentarios');
        comments.length === 0
            ? respondSuccess(req, res, 200, 'No existen comentarios en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes comentarios: ', data: comments });
    } catch (error) {
        handleError(error, 'comment.controller -> getComments');
        respondError(req, res, 500, 'No se pudo encontrar comentarios');
    }
}
/**
 * Busca y obtiene un comentario utilizando el servicio 'CommentService.getComment(params.id)'.
 * @param {Object} req - Objeto de solicitud (request) para buscar comentario.
 * @param {string} req.params.id - ID del comentario que se desea obtener.
 * @param {Object} res - Objeto de respuesta (response) que contiene informacion sobre respuesta HTTP.
 * @returns {Promise<void>} Promesa que no devuelve ningun valor explicito.
 */
async function getComment(req, res) {
    try {
        const { params } = req;
        const [comment, commentError] = await CommentService.getComment(params.id);
        if (commentError) return respondError(req, res, 404, commentError);
        respondSuccess(req, res, 200, comment);
    } catch (error) {
        handleError(error, 'comment.controller -> getComment');
        respondError(req, res, 500, 'No se pudo encontrar comentario');
    }
}
/**
 * Actualiza un comentario por su ID utilizando el servicio `CommentService.updateComment(id, body)`.
 * @param {Object} req - Objeto de solicitud para actualizar un comentario.
 * @param {string} req.params.id - ID del comentario que se desea actualizar.
 * @param {Object} req.body - Cuerpo de la solicitud que contiene los datos actualizados del comentario.
 * @param {Object} res - Objeto de respuesta que contiene información sobre la respuesta HTTP.
 * @returns 
 */
async function updateComment(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [comment, commentError] = await CommentService.updateComment(id, body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario actualizado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> updateComment');
        respondError(req, res, 500, 'No se pudo actualizar comentario');
    }
}
/**
 * Elimina un comentario por su ID utilizando el servicio `CommentService.deleteComment(id)`.
 * @param {Object} req - Objeto de solicitud para eliminar un comentario.
 * @param {string} req.params.id - ID del comentario que se desea eliminar.
 * @param {Object} res - Objeto de respuesta que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Una promesa que no devuelve ningún valor explícito.
 */
async function deleteComment(req, res) {
    try {
        const { id } = req.params;
        const [comment, commentError] = await CommentService.deleteComment(id);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario eliminado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> deleteComment');
        respondError(req, res, 500, 'No se pudo eliminar comentario');
    }
}
/**
 * Obtiene todos los comentarios realizados por un usuario específico utilizando el servicio `CommentService.getCommentsByUser(id)`.
 * @param {Object} req - Objeto de solicitud para obtener comentarios por usuario.
 * @param {string} req.params.id - ID del usuario cuyos comentarios se desean obtener.
 * @param {Object} res - Objeto de respuesta que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Una promesa que no devuelve ningún valor explícito.
 */
async function getCommentsByUser(req, res) {
    try {
        const { params } = req;
        const [comments, errorComments] = await CommentService.getCommentsByUser(params.id);
        if (errorComments) return respondError(res, 500, 'Error al buscar comentarios');
        comments.length === 0
            ? respondSuccess(req, res, 200, 'No existen comentarios en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes comentarios: ', data: comments });
    } catch (error) {
        handleError(error, 'comment.controller -> getCommentsByUser');
        respondError(req, res, 500, 'No se pudo encontrar comentarios');
    }
}   
/**
 * Edita un comentario existente utilizando el servicio `CommentService.editComment(id, body)`.
 * @param {Object} req - Objeto de solicitud para editar un comentario.
 * @param {string} req.params.id - ID del comentario que se desea editar.
 * @param {Object} req.body - Cuerpo de la solicitud con los datos actualizados del comentario.
 * @param {Object} res - Objeto de respuesta que contiene información sobre la respuesta HTTP.
 * @returns {Promise<void>} Una promesa que no devuelve ningún valor explícito.
 */
async function editComment(req, res) {
    try {
        const { id } = req.params;
        const { body } = req;
        const [comment, commentError] = await CommentService.editComment(id, body);
        if (commentError) return respondError(req, res, 400, commentError);
        if (!comment) return respondError(req, res, 400, 'No se encontro comentario asociado al id ingresado');
        respondSuccess(req, res, 200, { message: 'Comentario actualizado', data: comment });
    } catch (error) {
        handleError(error, 'comment.controller -> editComment');
        respondError(req, res, 500, 'No se pudo actualizar comentario');
    }
}

async function getCommentsByPost(req, res) {
    try {
        const { params } = req;
        const [comments, errorComments] = await CommentService.getCommentsByPost(params.id);
        if (errorComments) return respondError(res, 500, 'Error al buscar comentarios');
        comments.length === 0
            ? respondSuccess(req, res, 200, 'No existen comentarios en la bbdd')
            : respondSuccess(req, res, 200, { message: 'Se encontraron los siguientes comentarios: ', data: comments });
    } catch (error) {
        handleError(error, 'comment.controller -> getCommentsByPost');
        respondError(req, res, 500, 'No se pudo encontrar comentarios');
    }
}

module.exports = {
    createComment,
    getComments,
    getComment,
    updateComment,
    deleteComment,
    getCommentsByUser,
    editComment,
    getCommentsByPost,
};
