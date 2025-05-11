import './App.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { AppRoutes } from './modules/routes';

function App() {
  return (
    <Router>
      <div>
        <AppRoutes />
      </div>
    </Router >
  );
}



export default App;
