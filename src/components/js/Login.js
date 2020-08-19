import React, { useState } from 'react'

import '../css/Login.css'

import { Dialog, DialogContent, Avatar, Button, Divider, Typography } from '@material-ui/core';

import avatar from '../../avatar.png'

import { auth, provider } from '../helpers/firebase';

import { useStateValue } from '../helpers/StateProvider';
import { actionTypes } from '../helpers/reducer';




function Login() {

    const [state, dispatch] = useStateValue();

    const [open, setOpen] = useState(true);

    const signIn = () => {
        auth.signInWithPopup(provider).then(result => (
            dispatch({
                type: actionTypes.SET_USER,
                user: result.user
            })
        ))
            .catch(error => alert(error.message))
    }

    return (
        <div className="login">
            <div className="login__container">
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/WhatsApp_icon.png" alt="" />
                <div className="login__text">
                    <h1>Sign in to whatsapp</h1>
                </div>
                <Button type="submit" onClick={signIn}>
                    Sign In With Google
                </Button>
            </div>
            <Dialog classes={{ paper: 'app_dialog' }} open={open}>

                <DialogContent classes={{ root: 'app_dialog_content' }} >
                    <div className="app_avatar">
                        <Avatar alt="Satya Vamsi" classes={{ root: 'app_avatar_image' }} src={avatar} />
                        <p className="app_profile_name">Satya Vamsi</p>
                        <p className="app_intro_description">
                            I am a full stack developer skilled in React.js,  Node.js and PostgreSQL.
      Experience in building end-to-end web applications using PostgreSQL, React, Material-UI, Express.js  <br /><br />
      Check out my profile <a className="app_profile_link" href="https://www.linkedin.com/in/satyavamsi/" target="_blank">here</a>
                            <Divider style={{ backgroundColor: '#fff', margin: 20 }} />
      This WhatsApp Clone is built using React.js and Firebase. <br />
      Checkout the code <a className="app_profile_link" href="https://github.com/satyavamsi/Whatsapp" target="_blank">here</a>
                        </p>

                    </div>
                    <button onClick={() => { setOpen(false) }} className="app_button">
                        Lets Go!!
  </button>




                </DialogContent>

            </Dialog>
        </div>
    )
}


export default Login
