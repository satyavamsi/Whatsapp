import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import './App.css';

import Login from './components/js/Login';
import Sidebar from './components/js/Sidebar';
import Chat from './components/js/Chat';

import { useStateValue } from './components/helpers/StateProvider';

function App() {

  const [{ user }, dispatch] = useStateValue();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [roomId, setRoomId] = useState("");

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  }

  const selectRoomId = (id) => {
    setRoomId(id);
  }

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
          <div className="app__body">
            <Router>
              <Sidebar sidebarOpen={sidebarOpen} roomId={roomId} setRoomId={selectRoomId} toggleSidebar={toggleSidebar} />
              <Switch>
                <Route path="/rooms/:roomId">
                  <Chat setRoomId={selectRoomId} toggleSidebar={toggleSidebar} sidebarOpen={sidebarOpen} />
                </Route>
                <Route path="/"></Route>
              </Switch>
            </Router>
          </div>
        )
      }
    </div >
  );
}

export default App;
