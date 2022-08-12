/* eslint-disable no-lone-blocks */
import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
// import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles,  ThemeProvider , createTheme } from "@material-ui/core/styles";
// import { useParams } from "react-router";
import axios from "../Welcome/api/axios";
import NavBar from "./NavBar";
import "./profile.css";



// const theme = createTheme({
//   typography: {
//     fontFamily: [
//       'Chilanka',
//       'cursive',
//     ].join(','),
//   },});


const useStyles = makeStyles((theme) => ({
  root: {
    height: "50vh",
    // backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    // backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    display: "center",
    alignItems: "left",
    justifyContent: "center"
  },
  
}));

// function EditForm() {
//   const { isOpen, onOpen, onClose } = useDisclosure()
//   const initialRef = React.useRef(null)
//   const finalRef = React.useRef(null)
//   const [isChecked, setIsChecked] = useState(false);
//   const savedPassword = localStorage.getItem("password");
//   const [oldPwd, setOldPwd] = useState('');
//   const [newUsername, setNewUsername] = useState('');
//   const [newPwd, setNewPwd] = useState('');

//   useEffect(()=>{
//     if (savedPassword === oldPwd){
//       setIsChecked(true);
//     }

//   }, [oldPwd, newUsername, newPwd]);

//   const handelSave = async(e: { preventDefault: () => void; })=>{
//     e.preventDefault();
//     if (isChecked === true) {
//       console.log("do try catch");
//     }
//   }

  // return (
  //   <>
  //     <button className = "profileEditButton" onClick={onOpen} type="submit">Edit</button>
  //     <div>
      {/* <Modal> */}
        {/* initialFocusRef={initialRef}
        finalFocusRef={finalRef} */}
        {/* isOpen={isOpen}
        onClose={onClose} */}
        {/* <ModalOverlay /> */}
        {/* <ModalContent>
          <ModalHeader>Create your account</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Old password</FormLabel>
              <Input ref={initialRef} placeholder='Old password' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>New username or leave empty if no change</FormLabel>
              <Input placeholder='New username' />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel>New password  or leave empty if no change</FormLabel>
              <Input placeholder='New password' />
            </FormControl>

            <button onClick = {handelSave} type='submit'>
              Save
            </button>
            <button onClick={onClose} type='submit'>Cancel</button>
          </ModalBody>
        </ModalContent> */}
      //   <form className="profileEditForm" >
      //     <label htmlFor="profileEditLabel"> User Name:
      //       <input type="text" name="firstname" />
      //     </label>
      //     <label htmlFor="profileEditLabel">Email:
      //       <input type="text" name="lastname" />
      //     </label>
      //   <button className="profileSubmitButton" type="submit"> Submit</button>
      //   <button className="profileCancelButton" type="button" onClick={onClose}> Cancel </button>
      // </form>
      {/* </Modal> */}
      // </div>
    // </>
  // ）
      // }


// export default function SignIn(props: { history: string[]; }) {
export default function UserProfile() {
  const classes = useStyles();
  const savedUsername = localStorage.getItem("username");
  const token = localStorage.getItem("x-access-token");
  const GETINFO_URL = `/users/${savedUsername}`;
  const [user, setUser] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [viewForm, setViewForm] = useState(false);
  const UPDATEURL = '/:username'
  
  const showUsername = async() => {
    try {
      const response = await axios.get(
        GETINFO_URL,
        {
          headers: { 'Content-Type': 'application/json', 
          'x-access-token':  token},
        }
      );
      setUsername(response.data.username);
      setEmail(response.data.email);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(()=>{
    showUsername();
  }, []);


  // const EditForm = () => {
  //   const handleSubmit = async (event: { preventDefault: () => void; username: { value: string; }; email: { value: string; }; password: { value: string; }; }) => {
  //     event.preventDefault();
  //     // const newUsername = event.username.value;
  //     const newUsername = "abc";
  //     const newEmail = event.email.value;
  //     const newPassword = event.password.value; // 获得信息
  //     console.log(newUsername, newEmail, newPassword);
  //     const UPDATE_URL = '/:username'

  //     const userInfo = {
  //       username: newUsername, // 存入json.
  //       email: newEmail,
  //     }
    //   try {
    //     const response = await fetch(`${process.env.REACT_APP_TOWNS_SERVICE_URL}/:username`, {
    //       method: "PUT",
    //       headers: {
    //         'Content-Type': 'application/json'
    //       },
    //       credentials: 'include',
    //       body: JSON.stringify(userInfo)
    //     });
    //     const updatedUser = await response.json();
    //     // setCurrUser(updatedUser);
    //     setViewForm(false)
    //     console.log('Success', updatedUser);
    //     setUsername('');
		// 	  setEmail('');
    //   }

    function EditForm() {
      const [isChecked, setIsChecked] = useState(false);
      const savedPassword = localStorage.getItem("password");
      const [oldPwd, setOldPwd] = useState('');
      const [newUsername, setNewUsername] = useState('');
      const [newPwd, setNewPwd] = useState('');
      const UPDATE_URL = '/:username'
    
      useEffect(()=>{
        if (savedPassword === oldPwd){
          setIsChecked(true);
        }
    
      }, [oldPwd, newUsername, newPwd]);
    
      const handelSave = async(e: { preventDefault: () => void; })=>{
        e.preventDefault();
        if (isChecked === true) {
          console.log("do try catch");
        }
      }
    return (
      <form className="profileEditForm" >
        {/* <label className="profileEditLabel" htmlFor="abc"> User Name:
          <input type="text" name="udername" />
        </label> */}
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="oldpwd"
          label="Old Password"
          name="oldpwd"
          autoFocus 
          onChange={(e) => setOldPwd(e.target.value)}
          />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="username"
          label="New Username"
          type="username"
          id="username"
          // autoComplete="current-username"
          // onChange={(e) => setUsername(e.target.value)}
           />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="New Email"
          name="email"
          autoFocus 
          // onChange={(e) => setEmail(e.target.value)}
          />
        {/* <label className="profileEditLabel" htmlFor="abc">Email:
          <input type="text" name="Email" />
        </label> */}
        <button className="profileSubmitButton" type="submit"> Submit</button>
        <button className="profileCancelButton" type="button" onClick={() => setViewForm(false)}> Cancel </button>
      </form>
    )
  }
  
  
  return (
    <><div>
      <NavBar />
    </div><Grid container component="main" className={classes.root}>
        <div className="profile-container">
          {/* <leftBar/> */}
          {/* <CssBaseline /> */}
          {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
          {/* <Grid
            className={classes.size}
            item
            xs={12}
            sm={10}
            md={5}
            component={Paper}
          > */}
            {/* <div className={classes.paper}> */}
            <div className="profile-info">
            <div className="profile-details">
              <h1 className="detailsTitle" > My Profile </h1>
              <div className="detailsInfo">
                  <h3 className="detailsInfoKey"> Username: {username} </h3>
              </div>
              <div className="detailsInfo">
                  <h3 className="detailsInfoKey"> Email: {email} </h3>
              </div>
              <Button className="profileEditButton" type="submit" onClick={() => setViewForm(true)}>Edit</Button>
              <div className="formWrapper">
                {viewForm ?
                  <EditForm /> : ''}
              </div>
            </div>
            </div>
            {/* <Typography component="h1" variant="h5">
              My Profile
            </Typography>
            <Typography component="h3"> My Username: {username} </Typography>
            <Typography component="h3"> My Email: {email} </Typography> */}
            {/* <EditForm /> */}
            {/* <form className={classes.form} noValidate>
              <Typography component="h3"> My Username:  {username} </Typography>
              <Typography component="h3"> My Email:  {email} </Typography>
              <EditForm /> */}
                    {/* <div>{savedEmail}</div>
            <TextField
              onChange={(event) => handelAccount("email", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email"
              name="email"
              autoFocus />
            <TextField
              onChange={(event) => handelAccount("password", event)}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password" />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              className={classes.submit}>
              Edit
            </Button> */}
            {/* </form> */}
            {/* </div> */}
          {/* </Grid> */}
        </div>
      </Grid></>
      );
  }
