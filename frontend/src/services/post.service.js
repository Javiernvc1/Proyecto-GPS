import axios from "./root.service";

const headers = {
    'Content-Type': 'multipart/form-data'
  };

export const createPost = async(postData) => {
    try {
        const response = await axios.post("/posts/createPost", postData, headers);
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> createPost", error);
    }
}

export const getPosts = async() => {
    try {
        const response = await axios.get("/posts/getPosts")
        return response.data
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}

export const getUserPosts = async (id) => {
    try {
      const response = await axios.get(`/posts/getUserPosts/${id}`);
      return response.data; // Asumiendo que la respuesta tiene los datos en response.data
    } catch (error) {
      console.error('Error al obtener publicaciones del usuario:', error);
    }
  };

export const updatePost = async( postId, editedPost ) =>{
    try {
        const response = await axios.put(`/posts/updatePost/${postId}`, editedPost)
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> updatePost", error);
    }
}

export const deletePost = async(postId) => {
    try {
        const response = await axios.delete(`/posts/deletePost/${postId}`, )
        return response;
    } catch (error) {
        console.log("FRONTEND: Error en post.service -> getPosts", error);

    }
}

export const markInteraction = async (postId, userAndInteraction) => {
    try {
      const response = await axios.post(`/posts/markPostInteraction/${postId}`, userAndInteraction);
      return response;
    } catch (error) {
      console.log("FRONTEND: Error en post.service -> markInteraction", error);
      throw error; // Asegúrate de manejar el error donde llames a esta función
    }
  };
  