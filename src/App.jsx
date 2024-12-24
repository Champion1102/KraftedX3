import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Calculator from './Calculator';
import History from './History';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Calculator />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

export default App;