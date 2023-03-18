import './css/index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('React root not found')

const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
