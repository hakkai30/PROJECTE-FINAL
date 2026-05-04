import { supabase } from "../config/supabase";

export const postService = {
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

  async createPost({ text, imageUrl = "", user = "USER" }) {
    const { data, error } = await supabase
      .from('posts')
      .insert([{ description: text, img: imageUrl, user_email: user }])
      .select(`*, comments (*)`)
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async toggleLikePost(postId, { direction = "up" } = {}) {
    const increment = direction === "up" ? 1 : -1;
    
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();

    if (fetchError) throw new Error(fetchError.message);

    const { data, error } = await supabase
      .from('posts')
      .update({ likes: Math.max(0, (post.likes || 0) + increment) })
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
};
