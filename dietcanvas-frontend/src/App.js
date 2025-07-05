import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Register from './pages/Register';
import Login from './pages/Login';
import Recipes from './pages/Recipes';
import Planner from './pages/Planner';
import backgroundImage from './assets/dietcanvas.jpg';

function App() {
  return (
    <Router>
      <div
        className="App"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
          position: 'relative',
          color: 'white'
        }}
      >
        {/* Transparent overlay */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // black with 50% opacity
            zIndex: 0
          }}
        ></div>

        {/* Main content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <header className="App-header">
            <h1>DietCanvas</h1>
            <p>Your personal recipe & meal planner</p>
            <nav className="App-nav">
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
              <Link to="/recipes">Recipes</Link>
              <Link to="/planner">Meal Planner</Link>
            </nav>
          </header>

          <main className="App-main">
            <Routes>
              <Route path="/" element={<p>Welcome to DietCanvas — select an option above to get started!</p>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/planner" element={<Planner />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;
