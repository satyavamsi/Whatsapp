import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar } from '@material-ui/core';

import '../css/SidebarChat.css'

import db from '../helpers/firebase';

function SidebarChat({ id, name, addNewChat, roomId, toggleSidebar }) {

    const [seed, setSeed] = useState('');
    const [messages, setMessages] = useState("");

    useEffect(() => {
        if (id) {
            db.collection('rooms').doc(id).collection('messages')
                .orderBy('timestamp', 'desc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => doc.data()))
                ))
        }
    }, [id])

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [])

    const createChat = () => {
        const roomName = prompt("Please enter name for chat");
        if (roomName) {
            db.collection('rooms').add({
                name: roomName
            })
        }
    }

    return !addNewChat ? (
        <Link to={`/rooms/${id}`}>
            <div onClick={() => { toggleSidebar() }} className={`sidebarChat ${id === roomId ? "sidebarChat__selected" : ""}`}>
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="sidebarChat__info">
                    <h3>{name}</h3>
                    <p>{messages[0]?.message}</p>
                </div>
            </div>
        </Link>
    ) :
        (
            <div
                onClick={createChat}
                className="sidebarChat">
                <h3>Add new chat</h3>
            </div>
        )
}

export default SidebarChat
