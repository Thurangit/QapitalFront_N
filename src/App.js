import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './modules/routes';
import ToastContainer from './modules/Components/Toast';

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />
        <ToastContainer />
      </div>
    </Router >
  );
}



export default App;
