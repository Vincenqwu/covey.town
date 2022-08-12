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
import axios from "../Welcome/api/axios"
import NavBar from "./NavBar";


// const theme = createTheme({
//   typography: {
//     fontFamily: [
//       'Chilanka',
//       'cursive',
//     ].join(','),
//   },});


const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    // backgroundImage: `url(${image})`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],

    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  size: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  paper: {
    margin: theme.spacing(2, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(0),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

function InitialFocus() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const initialRef = React.useRef(null)
  const finalRef = React.useRef(null)
  const [isChecked, setIsChecked] = useState(false);
  const savedPassword = localStorage.getItem("password");
  const [oldPwd, setOldPwd] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPwd, setNewPwd] = useState('');

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
    <>
      <Button onClick={onOpen}>Edit</Button>
      {/* <Button ml={4} ref={finalRef}>
        I will receive focus on close
      </Button> */}

      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
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
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick = {handelSave}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}



// export default function SignIn(props: { history: string[]; }) {
export default function Update() {

  const classes = useStyles();

  const savedUsername = localStorage.getItem("username");
  const token = localStorage.getItem("x-access-token");
  const GETINFO_URL = `/users/${savedUsername}`;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  
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

  
  return (
    <><div>
      <NavBar />
    </div><Grid container component="main" className={classes.root}>
        <CssBaseline />
        {/* <Grid item xs={false} sm={4} md={7} className={classes.image} /> */}
        <Grid
          className={classes.size}
          item
          xs={12}
          sm={10}
          md={5}
          component={Paper}
          elevation={1}
          square
        >
          <div className={classes.paper}>
            <Typography component="h1" variant="h5">
              My Profile
            </Typography>
            <form className={classes.form} noValidate>
              <Typography component="h3"> My Username:  {username} </Typography>
              <Typography component="h3"> My Email:  {email} </Typography>
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
            </form>
            <InitialFocus />
          </div>
        </Grid>
        
      </Grid></>
  );
}
