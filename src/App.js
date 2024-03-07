import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [appVersion, setAppVersion] = useState('');

  useEffect(() => {
    // Pastikan ini sesuai dengan yang kamu ekspos di contextBridge
    window.electron.getAppVersion().then((version) => {
      setAppVersion(version);
    });
  }, []);

  return (
    <div className="App">
      {`HELLO WORLD IM VERSION ${appVersion}`}
    </div>
  );
}

export default App;
