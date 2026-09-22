import { useState } from 'react';

import Chat from '@/components/Chat';
import Login from '@/components/Login';
import './App.css';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  return loggedIn ? <Chat /> : <Login onLogin={() => setLoggedIn(true)} />;
}

export default App;
