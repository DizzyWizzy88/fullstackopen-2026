import { createContext, useReducer, useContet, useEffect } from 'react'
import blogService from './services/blogs'

const userReducer = (state, action) => {
    switch (action.type) {
        case 'SET_USER':
            return action.payload
        case 'CLEAR_USER':
            return null
        default:
            return state
    }
}

const userContextProvider = (props) => {
    const [user, dispatch] = userReducer(userReducer, null)

    useEffect(() => {
        const logedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            dispatch({ type: 'SET_USER', payload: user })
            blogService.setToken(user.token)
        }
    }, [])

    return (
        <UserContext.Provider value={[user, dispatch]}>
            {proprs.children}
        </UserContext.Provider>
    )
}

export const useUserValue = () => useContext(UserContext)[0]
export const useUserDispatch = () => useContext(UserContext)[1]