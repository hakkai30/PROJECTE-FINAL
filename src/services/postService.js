import { supabase } from "../config/supabase";
import { authService } from "./authService";

// Sube una imagen a Supabase Storage y devuelve la URL pública.
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

// Servicio central del feed social: posts, likes, comentarios y borrado.
export const postService = {
  uploadImage,

  async getFeedPosts({ limit = 10, offset = 0 } = {}) {
    const { data, error } = await supabase
      .from('posts')
      .select(`*, comments (*, users (name, avatar))`)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(error.message);
    return data || [];
  },

  async createPost({ text, imageFile = null, imageUrl = "", user = "USER" }) {
    let finalImageUrl = imageUrl;
    if (imageFile) {
      finalImageUrl = await uploadImage(imageFile);
    }

    const { data, error } = await supabase
      .from('posts')
      .insert([{ description: text, img: finalImageUrl, user_email: user }])
      .select(`*, comments (*, users (name, avatar))`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async toggleLikePost(postId) {
    const currentUser = authService.loadCurrentUser();
    if (!currentUser) throw new Error("Debes iniciar sesión para dar like.");

    // Comprobar si ya existe el like
    const { data: existingLike, error: checkError } = await supabase
      .from('post_likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', currentUser.id)
      .maybeSingle();

    if (checkError) throw new Error("Error al verificar el like.");

    if (existingLike) {
      await supabase.from('post_likes').delete().eq('id', existingLike.id);
    } else {
      await supabase.from('post_likes').insert([{ post_id: postId, user_id: currentUser.id }]);
    }

    // Obtener y actualizar el contador de likes del post
    const { data: post } = await supabase.from('posts').select('likes').eq('id', postId).single();
    const newLikesCount = existingLike ? Math.max(0, (post.likes || 0) - 1) : (post.likes || 0) + 1;

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: newLikesCount })
      .eq('id', postId)
      .select(`*, comments (*, users (name, avatar))`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async addCommentToPost(postId, { text, user = "USER" }) {
    const { error: commentError } = await supabase
      .from('comments')
      .insert([{ post_id: postId, text, user_email: user }])
      .select()
      .single();

    if (commentError) throw new Error(commentError.message);

    const { data: post, error: postError } = await supabase
      .from('posts')
      .select(`*, comments (*, users (name, avatar))`)
      .eq('id', postId)
      .single();

    if (postError) throw new Error(postError.message);
    return { post };
  },

  async deleteCommentFromPost(postId, commentId) {
    await supabase.from('comments').delete().eq('id', commentId);

    const { data: post, error } = await supabase
      .from('posts')
      .select(`*, comments (*)`)
      .eq('id', postId)
      .single();

    if (error) throw new Error(error.message);
    return post;
  },

  async deletePost(postId) {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) throw new Error(error.message);
    return true;
  },
};
