import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import blogService from '../services/blogs'
import { useNotify } from '../NotificationContext'

export const useBlogs = () => {
    return useQuery({
        queryKey: ['blogs'],
        queryFn: blogService.getAll,
    })
}

export const useBlogMutations = () => {
    const queryClient = useQueryClient()
    const notify = useNotify()

    const createBlogMutation = useMutation({
        mutationFn: blogService.create,
        onsuccess: (newBlog) => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            notify(`A new blog '${newBlog.title}' by ${newBlog.author} added`)
        },
        onError: (error) => {
            notify(err.response?.data?.error || 'Failed to create blog', 'error')
        },
    })

    const likeBlogMutation = useMutation({
        mutationFn: (blog) => 
            blogService.update(blog.id, {
                ...blog,
                likes: blog.likes + 1,
                user: blog.user?.id || blog.user,
            }),
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ['blogs' ] })
            },
    })

    const deleteBlogMutation = useMutation({
        mutationFn: blogService.remove,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['blogs'] })
            notify('Blog removed successfully')
        },
        onError: (err) => {
            notify(err.response?.data?.error || 'Failed to remove blog', 'error')
        },
    })

    return { createBlogMutation, likeBlogMutation, deleteBlogMutation }
}