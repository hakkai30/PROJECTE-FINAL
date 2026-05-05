import { supabase } from "../config/supabase";
import { authService } from "./authService";

/** Sube una imagen a Supabase Storage y devuelve la URL pública */
const uploadImage = async (file) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const filePath = `posts/${fileName}`;

  const { error } = await supabase.storage
    .from('post-images')
    .upload(filePath, file);

  if (error) throw new Error(error.message);

  const { data: urlData } = supabase.storage
    .from('post-images')
    .getPublicUrl(filePath);

  return urlData.publicUrl;
};

export const postService = {
  uploadImage,

  async getFeedPosts() {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        comments (*)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createPost({ text, imageFile = null, imageUrl = "", user = "USER" }) {
    // Si hay un archivo, subirlo primero
    let finalImageUrl = imageUrl;
    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ description: text, img: finalImageUrl, user_email: user }])
      .select(`*, comments (*)`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async toggleLikePost(postId) {
    const currentUser = authService.loadCurrentUser();
    if (!currentUser) throw new Error("Debes iniciar sesión para dar like.");

    // 1. Verificar si ya existe el like en post_likes
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (checkError) throw new Error("Error al verificar el like.");

    if (existingLike) {
      // Quitar like
      const { error: deleteError } = await supabase
        .from('post_likes')
        .delete()
        .eq('id', existingLike.id);
      
      if (deleteError) throw new Error("No se pudo quitar el like.");
    } else {
      // Dar like
      const { error: insertError } = await supabase
        .from('post_likes')
        .insert([{ post_id: postId, user_id: currentUser.id }]);
      
      if (insertError) throw new Error("No se pudo dar like.");
    }

    // 2. Obtener el post actualizado (el trigger o el contador denormalizado se encarga si existiera, 
    // pero aquí actualizaremos el contador de la tabla posts manualmente para mantener compatibilidad)
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const newLikesCount = existingLike ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: newLikesCount })
      .eq('id', postId)
      .select(`*, comments (*)`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async addCommentToPost(postId, { text, user = "USER" }) {
    const { data: comment, error: commentError } = await supabase
      .from('comments')
      .insert([{ post_id: postId, text, user_email: user }])
      .select()
      .single();

    if (commentError) throw new Error(commentError.message);

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`*, comments (*)`)
      .eq('id', postId)
      .single();

    if (postError) throw new Error(postError.message);

    return { post, comment };
  },

  async deleteCommentFromPost(postId, commentId) {
    const { error: commentError } = await supabase
      .from('comments')
      .delete()
      .eq('id', commentId);

    if (commentError) throw new Error(commentError.message);

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`*, comments (*)`)
      .eq('id', postId)
      .single();

    if (postError) throw new Error(postError.message);

    return post;
  },

  async deletePost(postId) {
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) throw new Error(error.message);
    return true;
  },

  async getUserLikedPostIds(userId) {
    const { data, error } = await supabase
      .from('post_likes')
      .select('post_id')
      .eq('user_id', userId);

    if (error) throw new Error(error.message);
    return data.map(row => String(row.post_id));
  }
};
