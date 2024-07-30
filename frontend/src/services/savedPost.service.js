// savedPost.service.js
import axios from "./root.service";

const API_URL = 'http://localhost:3001/api/savedPost';

export const savePost = async (postId, postData) => {
    try {
        if (typeof postId !== 'string' && typeof postId !== 'number') {
            throw new Error('Invalid postId');
        }
        console.log('postData:', postData);
        const response = await axios.post(`${API_URL}/${postId}/saved-posts`, postData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error saving post:', error);
        throw error;
    }
};

export const getSavedPosts = async (userId) => {
    try {
        const response = await axios.get(`${API_URL}/${userId}/saved-posts`);
        return response.data;
    } catch (error) {
        console.error("Error getting saved posts:", error);
        throw error;
    }
};

export const removeSavedPost = async (userId, postId) => {
    try {
        const response = await axios.delete(`${API_URL}/${userId}/saved-posts/${postId}`);
        return response.data;
    } catch (error) {
        console.error("Error removing saved post:", error);
        throw error;
    }
};