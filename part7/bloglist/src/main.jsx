import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter as Router } from 'react-router-dom'
import { NotificationContextProvider } from './NotificationContext'
import { UserContextProvider } from './UserContext'
import App from './App'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
    <QueryClientrovider client={queryClient}>
        <UserContextProvider>
            <NotificationContextProvider>
                <Router>
                    <App />
                </Router>
            </NotificationContextProvider>
        </UserContextProvider>
    </QueryClientrovider>
)
