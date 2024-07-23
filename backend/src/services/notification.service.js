const Notification = require("../models/notification.model");
const User = require("../models/user.model");

/* <----------------------- FUNCIONES ------------------------> */
// handleError: Funcion de registro y manejo de errores de manera centralizada
const { handleError } = require("../utils/errorHandler.js")

/**
 * Servicio para crear una notificación.
 * @param {Object} bodyNotification - Objeto que contiene datos de la notificación a crear.
 * @param {string} bodyNotification.contentNotification - Contenido de la notificación.
 * @param {string} bodyNotification.userId - Id del usuario al que pertenece la notificación.
 * @param {Date} bodyNotification.dateNotification - Fecha de la notificación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene `[newNotification, null]` si tiene éxito o `[null, mensaje de error]` si falla.
 */

async function createNotification(bodyNotification) {
    if (!bodyNotification.contentNotification || !bodyNotification.dateNotification || !bodyNotification.userId) {
        return [null, "Datos de notificación no proporcionados"];
    }
    try {
        const newNotification = new Notification(bodyNotification);
        await newNotification.save();
        return [newNotification, null];
    } catch (error) {
        return [null, handleError(error, "notification.service -> createNotification")];
    }
}

/**
 * Servicio para obtener todas las notificaciones de un usuario específico que no han sido leídas.
 * @param {string} userId - Id del usuario.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene todas las notificaciones no leídas del usuario.
 */
async function getNotifications(userId) {
    try {
        const notifications = await Notification.find({ userId: userId, read: false });
        return [notifications, null];
    } catch (error) {
        handleError(error, "notification.service -> getNotifications")
    }
}

/**
 * Servicio para obtener una notificación por su id.
 * @param {string} id - Id de la notificación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene la notificación encontrada o `[null, mensaje de error]` si falla.
 */
async function getNotification(id) {
    try {
        const notification = await Notification.findById(id);
        if (!notification) return [null, "Notificación no encontrada"];
        return [notification, null];
    } catch (error) {
        handleError(error, "notification.service -> getNotification")
    }
}

/**
 * Servicio para actualizar una notificación por su id.
 * @param {string} id - Id de la notificación.
 * @param {Object} notification - Objeto que contiene los datos de la notificación a actualizar.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene la notificación actualizada o `[null, mensaje de error]` si falla.
 */
async function updateNotification(id, notification) {
    try {
        const { contentNotification, dateNotification, read } = notification;
        const notificationFound = await Notification.findById(id);
        if (!notificationFound) return [null, "Notificación no encontrada"];
        notificationFound.contentNotification = contentNotification;
        notificationFound.dateNotification = dateNotification;
        notificationFound.read = read;
        await notificationFound.save();
        return [notificationFound, null];
    } catch (error) {
        handleError(error, "notification.service -> updateNotification")
    }
}

/**
 * Servicio para eliminar una notificación por su id.
 * @param {string} id - Id de la notificación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene un mensaje de éxito o `[null, mensaje de error]` si falla.
 */
async function deleteNotification(id) {
    try {
        const notificationFound = await Notification.findById(id);
        if (!notificationFound) return [null, "Notificación no encontrada"];
        await Notification.findByIdAndDelete(id);
        return ["Notificación eliminada con éxito", null];
    } catch (error) {
        handleError(error, "notification.service -> deleteNotification")
    }
}

/**
 * Servicio para marcar una notificación como leída.
 * @param {string} id - Id de la notificación.
 * @returns {Promise<Array>} Promesa que resuelve a un arreglo que contiene la notificación actualizada o `[null, mensaje de error]` si falla.
 */
async function markAsRead(id) {
    try {
        const notification = await Notification.findById(id);
        if (!notification) return [null, "Notificación no encontrada"];

        notification.read = true;
        await notification.save();

        return [notification, null];
    } catch (error) {
        handleError(error, "notification.service -> markAsRead")
    }
}

module.exports = {
    createNotification,
    getNotifications,
    getNotification,
    updateNotification,
    deleteNotification,
    markAsRead
}