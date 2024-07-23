import axios from "axios";

export const getNotifications = async (userId) => {
    try {
        const response = await axios.get(`/notifications/getNotifications/${userId}`);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al obtener notificaciones:', error);
        console.log(error);
    }
}

export const  createNotification = async (notification) => {
    try {
        const response = await axios.post('/notifications/createNotification', notification);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al crear notificación:', error);
    }
}

export const getNotification = async (id) => {
    try {
        const response = await axios.get(`/notifications/getNotification/${id}`);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al obtener notificación:', error);
    }
}

export const updateNotification = async (id, notification) => {
    try {
        const response = await axios.put(`/notifications/updateNotification/${id}`, notification);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al actualizar notificación:', error);
    }
}

export const deleteNotification = async (id) => {
    try {
        const response = await axios.delete(`/notifications/deleteNotification/${id}`);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al eliminar notificación:', error);
    }
}

export const markAsRead = async (id) => {
    try {
        const response = await axios.put(`/notifications/markAsRead/${id}`);
        return response.data;
    } catch (error) {
        console.error('(Frontend) Notification Service -> Error al marcar como leída la notificación:', error);
    }
}
