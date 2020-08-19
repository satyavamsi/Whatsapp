import React, { useState, useEffect } from 'react'
import '../css/Sidebar.css'

import { Avatar, IconButton } from '@material-ui/core';

import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import ChatIcon from '@material-ui/icons/Chat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';

import SidebarChat from './SidebarChat';

import db from '../helpers/firebase';
import { useStateValue } from '../helpers/StateProvider';


function Sidebar({ sidebarOpen, setRoomId, roomId, toggleSidebar }) {

    const [rooms, setRooms] = useState([]);

    const [{ user }, dispatch] = useStateValue();

    useEffect(() => {
        const unsubscribe = db.collection('rooms').onSnapshot(
            snapshot => (
                setRooms(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })))
            )
        )

        return () => (
            unsubscribe()
        )

    }, [])
    return (
        <div className={`sidebar ${sidebarOpen ? 'sidebarOpen' : ''}`}>
            <div className="sidebar__header">
                <Avatar src={user?.photoURL} />
                <div className="sidebar__headerRight">
                    <IconButton>
                        <DonutLargeIcon />
                    </IconButton>
                    <IconButton>
                        <ChatIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="sidebar__search">
                <div className="sidebar__searchContainer">
                    <SearchOutlinedIcon />
                    <input placeholder="Search chat"></input>
                </div>

            </div>
            <div className="sidebar__chats">
                <SidebarChat addNewChat setRoomId={setRoomId} />
                {rooms.map(room => (
                    <SidebarChat roomId={roomId} setRoomId={setRoomId} key={room.id} id={room.id} name={room.data.name} toggleSidebar={toggleSidebar} />
                ))}
            </div>
        </div>
    )
}

export default Sidebar
