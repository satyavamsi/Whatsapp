import React, { useLayoutEffect, useState, useEffect } from 'react'
import { useParams, Redirect } from 'react-router-dom';

import '../css/Chat.css'

import { Avatar, IconButton } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';

import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

import db from '../helpers/firebase';
import { useStateValue } from '../helpers/StateProvider';
import { actionTypes } from '../helpers/reducer';

import firebase from 'firebase';



function Chat({ toggleSidebar, setRoomId, sidebarOpen }) {

    const [seed, setSeed] = useState('');
    const [input, setInput] = useState('');
    const { roomId } = useParams();

    const [redirect, setRedirect] = useState(false);

    const [roomName, setRoomName] = useState("");

    const [{ user }, dispatch] = useStateValue();


    const [messages, setMessages] = useState([]);

    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize(window.innerWidth);
        }
        window.addEventListener('resize', updateSize);
        updateSize();
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
        setRoomId(roomId);
    }, [roomId])

    useEffect(() => {
        setMessages([]);
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(
                (snapshot) => {
                    if (snapshot.data()) {
                        setRoomName(snapshot.data().name)
                    } else {
                        setRedirect(true);
                    }
                }
            )

            db.collection('rooms').doc(roomId).
                collection('messages').orderBy('timestamp', 'asc')
                .onSnapshot(snapshot => (
                    setMessages(snapshot.docs.map(doc => doc.data()))
                ))
        }
    }, [roomId])

    const sendMessage = (e) => {
        e.preventDefault();
        db.collection('rooms').doc(roomId).collection('messages')
            .add({
                message: input,
                name: user.displayName,
                uid: user.uid,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            })
        setInput("");
    }

    const logout = () => {
        dispatch({
            type: actionTypes.REMOVE_USER,
            user: null
        })
    }


    return (
        <div className="chat">
            {redirect && <Redirect to="/rooms/general" />}
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {messages.length ? new Date(messages?.[messages.length - 1]?.timestamp?.toDate()).toUTCString() : ''}</p>
                </div>
                {size > 572 ?
                    <div className="chat__headerRight">
                        <IconButton>
                            <SearchOutlinedIcon />
                        </IconButton>
                        <IconButton>
                            <AttachFileIcon />
                        </IconButton>
                        <IconButton >
                            <ExitToAppIcon onClick={logout} />
                        </IconButton>
                    </div> :
                    <div className="chat__headerRight">
                        <IconButton>
                            <SearchOutlinedIcon />
                        </IconButton>
                        <IconButton className={sidebarOpen && "chat__sidebarToggle"}>
                            {sidebarOpen ? <ExitToAppIcon onClick={logout} /> : <AttachFileIcon />}
                        </IconButton>
                        <IconButton onClick={toggleSidebar} className={sidebarOpen && "chat__sidebarToggle"}>
                            {sidebarOpen ? <CloseIcon /> : <MenuIcon />}
                        </IconButton>
                    </div>
                }
            </div>
            <div className="chat__body">
                {messages.map((message, index) => (
                    <p key={index} className={`chat__message 
                    ${message.uid === user.uid && "chat__receiver"}`}>
                        <span className="chat__name">{message.name}</span>
                        {message.message} <br />
                        <span className="chat__timestamp">
                            {new Date(message.timestamp?.toDate()).toUTCString()}
                        </span>
                    </p>
                ))}

            </div>
            <div className="chat__footer">
                <InsertEmoticonIcon />
                <form>
                    <input value={input} onChange={e => setInput(e.target.value)} type="text" placeholder="Type a message" />
                    <button onClick={sendMessage} type="submit">Send message</button>
                </form>
                <MicIcon />
            </div>
            <div className={sidebarOpen && size <= 572 && "background__overlay"}>
            </div>
        </div>
    )
}

export default Chat
