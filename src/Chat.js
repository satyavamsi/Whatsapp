import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';

import './Chat.css'

import { Avatar, IconButton } from '@material-ui/core';

import AttachFileIcon from '@material-ui/icons/AttachFile';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';

import db from './firebase';
import { useStateValue } from './StateProvider';

import firebase from 'firebase';

function Chat() {

    const [seed, setSeed] = useState('');
    const [input, setInput] = useState('');
    const { roomId } = useParams();

    const [roomName, setRoomName] = useState("");

    const [{ user }, dispatch] = useStateValue();

    console.log(user);

    const [messages, setMessages] = useState([]);

    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId])

    useEffect(() => {
        if (roomId) {
            db.collection('rooms').doc(roomId).onSnapshot(
                snapshot => (
                    setRoomName(snapshot.data().name)
                )
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


    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
                <div className="chat__headerInfo">
                    <h3>{roomName}</h3>
                    <p>Last seen at {messages.length ? new Date(messages?.[messages.length - 1]?.timestamp?.toDate()).toUTCString() : ''}</p>
                </div>
                <div className="chat__headerRight">
                    <IconButton>
                        <SearchOutlinedIcon />
                    </IconButton>
                    <IconButton>
                        <AttachFileIcon />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon />
                    </IconButton>
                </div>
            </div>
            <div className="chat__body">
                {messages.map(message => (
                    <p className={`chat__message 
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
        </div>
    )
}

export default Chat
