import { useState } from 'react';

import Login from '@/components/Login';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? null : <Login onLogin={() => setLoggedIn(true)} />;
}

export default App;
