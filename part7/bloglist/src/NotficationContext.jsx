import { createContext, useReducer, useContext } from 'react'

const notificationreducer = (state, action) => {
    switch (action.type) {
        case 'SET':
            return action.payload
        case 'CLEAR':
            return null
        default:
            return state
    }
}

const NotificationContext = createContext()

export const NofificationContextProvider = (props) => {
    const [notification, dispatch] = useReducer(notificationreducer, null)

    return (
        <NotificationContext.Provider value={[notification, dispatch]}>
            {props.children}
        </NotificationContext.Provider>
    )
}

export const useNotificationValue = () => {
    const [value] = useContext(NotificationContext)
    return value
}

export const useNotify = () => {
    const [, dispatch] = useContext(NotificationContext)
    return (message, type = 'info', seconds = 5) => {
        dispatch({ type: 'SET', payload: { message, type } })
        setTimeout(() => {
            dispatch({ type: 'CLEAR' })
        }), seconds * 1000
    }
}