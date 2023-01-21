export function mapMattermostPost(post: any) {
  return {
    id: post.id,
    message: post.message,
    userId: post.user_id,
  }
}
