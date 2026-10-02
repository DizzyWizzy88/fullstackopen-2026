import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from './services/blogs'
import { useBlogMutations } from '../hooks/useBlogMutations'

const BlogDetail = ({ blog }) => {
    const [comment, setComment] = useState("")
    const queryClient = useQueryClient()
    const { likeBlogMutation } = useBlogMutations()

    const commentMutation = useMutation({
        mutationFn: ({ id, comment }) => blogService.addComment(id, comment),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            setComment("")
        },
    })

    if (!blog) return null

    const handleAddComment = (e) => {
        e.preventDefault()
        if (!comment.trim()) return
        commentMutation.mutate({ id: blog.id, comment })

        return (
            <div>
                <h2>{blog.title} {blog.author}</h2>
                <div><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></div>
                <div>
                    {blog.likes} likes{' '}
                    <button onClick={() => likeBlogMutation.mutate(blog)}>like</button>
                </div>
                <div>added by {blog.user?.name || 'anonymous'}</div>

                <h3>comments</h3>
                <form onSubmit={handleAddComment}>
                    <input
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="write a comment..."
                    />
                    <button type="submit">add comment</button>
                </form>
                <ul>
                    {blog.comments?.map((c, idx) => (
                        <li key={idx}>{c}</li>
                    ))}
                </ul>
            </div>
        )
}

export default BlogDetail