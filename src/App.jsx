import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EmbedPropertyList from './pages/EmbedPropertyList';
import Dashboard from './pages/Dashboard';
import StripeConnectCallback from './pages/StripeConnectCallback';
import ConnectStatus from './pages/ConnectStatus';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/owners/dashboard/embedpropertylist" element={<EmbedPropertyList />} />
        <Route path="/connect/stripe/callback" element={<StripeConnectCallback />} />
        <Route path="/owners/dashboard/connect-status" element={<ConnectStatus />} />
      </Routes>
    </Router>
  );
}

export default App;
