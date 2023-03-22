import './css/index.css'
import ReactDOM from 'react-dom/client'
import App from './App'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('React root not found')

const root = ReactDOM.createRoot(rootElement)
root.render(<App />)
