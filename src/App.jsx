import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeContext } from './contexts/theme';
import { AppContext } from './contexts/AppContext';
import Header from './components/Header/Header';
import MusicPlayer from './components/MusicPlayer/MusicPlayer';
import Home from './views/Home/Home';
import Search from './views/Search/Search';
import Profile from './views/Profile/Profile';
import Playlist from './views/Playlist/Playlist';
import ErrorPage from './views/ErrorPage/ErrorPage';
import { getUserData } from './services/auth.service';
import { spotifyApi } from './services/spotify.service';
import toast, { Toaster } from 'react-hot-toast';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [{ theme }] = useContext(ThemeContext);
  const [{ setAppLoading, currentlyPlayingTrack }] =
    useContext(AppContext);
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (!token) return;

    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      setAppLoading(false);
      return;
    }
    setAppLoading(true);
    getUserData(accessToken, handleLogout)
      .then((data) => {
        if (data) {
          setUser(data);
          setAppLoading(false);
        }
      })
      .catch((error) => {
        toast.error(error.message);
      });
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    try {
      spotifyApi.setAccessToken(accessToken);
    } catch (error) {
      toast.error(error.message);
    }
  }, [accessToken]);

  const handleLogout = () => {
    setAccessToken(null);
    setUser(null);

    localStorage.removeItem('accessToken');
  };

  return (
    <>
      <main className={`app bg-${theme.color} text-${theme.textColor}`}>
        <BrowserRouter>
          <Toaster />
          <Header user={user} logout={handleLogout} />
          {currentlyPlayingTrack && (
            <MusicPlayer
              token={accessToken}
            />
          )}
          <Routes>
            <Route
              index
              element={
                <Home
                  accessToken={accessToken}
                  setAccessToken={setAccessToken}
                />
              }
            />
            <Route
              path="/home"
              element={
                <Home
                  accessToken={accessToken}
                  setAccessToken={setAccessToken}
                />
              }
            />
            <Route
              path="/search"
              element={
                <Search accessToken={accessToken} logout={handleLogout} />
              }
            />
            <Route
              path="/profile"
              element={<Profile token={accessToken} logout={handleLogout} />}
            />
            <Route
              path="/playlist/:id"
              element={<Playlist token={accessToken} />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </BrowserRouter>
      </main>
    </>
  );
}

export default App;
