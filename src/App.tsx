import Chat from '@/components/Chat';
import Login from '@/components/Login';
import { selectLoggedIn } from '@/store/selectors/auth';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/auth';

function App() {
  const dispatch = useAppDispatch();
  const loggedIn = useAppSelector(selectLoggedIn);

  return loggedIn ? (
    <Chat />
  ) : (
    <Login onLogin={(credentials) => dispatch(login(credentials))} />
  );
}

export default App;
