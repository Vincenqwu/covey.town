// import TextField from "@material-ui/core/TextField";
// import React, { useCallback } from "react";
// // import TextField from "@mui/material/TextField";
// import { useForm, Controller } from "react-hook-form";

// import GetNewUserInfo from "./ContactModel";

// import { GetNewPersonModel } from "./PersonModel";


// const userInfo = GetNewUserInfo({
//   person: GetNewPersonModel({
//     nickName: "",
//     email: ""
//   }),
// });

// export default function Profile() {
//   const formMethods = useForm({
//     defaultValues: userInfo
//   });

//   const onSubmit = useCallback(() => {
//     // console.log("on submit called");
//   }, []);

//   // console.log("render App");

//   return (
//     // <FormProvider {...}>
//       <form onSubmit={formMethods.handleSubmit(onSubmit)}>
//         <div id="home">
//             <NavBar />
//             <h1 className = "header-h1" >User Profile</h1>
//         </div>
//         <div>
//           <h2>User Name</h2>
//           <div>
//             <Controller
//               control={formMethods.control}
//               name="person.nickName"
//               render={() => <TextField label="NickName" />}
//             />
//           </div>
//           <div>
//           <Controller
//             control={formMethods.control}
//             name="person.email"
//             render={() => <TextField label="EmailAddress" />}
//           />
//           </div>
//           <div>
//           <Controller
//             control={formMethods.control}
//             name="person.password"
//             render={() => <TextField label="AccountPassword" />}
//           />
//           </div>
//         </div>
//       </form>
//     // </FormProvider>
//   );
// }

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
import { makeStyles } from "@material-ui/core/styles";
// import { useParams } from "react-router";
import axios from "../Welcome/api/axios"
import NavBar from "./NavBar";



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
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

// export default function SignIn(props: { history: string[]; }) {
export default function Update() {

  const classes = useStyles();

  // console.log(typeof classes.root);

  // const [viewForm, setViewForm] = useState(false);


  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
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
  const [oldPwd, setOldPwd] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPwd, setNewPwd] = useState('');


  

  function InitialFocus() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    
    const initialRef = React.useRef(null)
    const finalRef = React.useRef(null)


    const [isChecked, setIsChecked] = useState(false);

    
  
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
  
  useEffect(()=>{
    showUsername();
  }, []);


  // useEffect(()=>{
  //   const result = ;
    
  //   setData(result);
  // }, []);


  // const EditForm = () => {
  //   const handleSubmit = async (event: { preventDefault: () => void; target: { email: { value: any; }; password: { value: any; }; }; }) => {
  //     event.preventDefault();

  //     const email = event.target.email.value;
  //     const password = event.target.password.value; // 获得信息
  //     console.log(email, password);

  //     const userInfo = {
  //       Email: email, // 存入json.
  //       Password: password,
  //     }

  //     try {
  //       const response = await fetch(`${process.env.REACT_APP_API_URL}/profile/`, {
  //         method: "PUT",
  //         headers: {
  //           'Content-Type': 'application/json'
  //         },
  //         credentials: 'include',
  //         body: JSON.stringify(userInfo)
  //       });
  //       const updatedUser = await response.json();
  //       // setCurrUser(updatedUser);
  //       setViewForm(false)
  //       console.log('Success', updatedUser);
  //     }
  //     catch (err) {
  //       console.error("Error:", err);
  //     }
  //   }
  // }

  
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
              <div>My Username: {username}</div>
              <div>My Email: {email}</div>
              {/* <div>{savedEmail}</div> */}
              {/* <TextField
                onChange={(event) => handelAccount("email", event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoFocus /> */}
              {/* <TextField
                onChange={(event) => handelAccount("password", event)}
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password" /> */}
              {/* <FormControlLabel
      control={<Checkbox value="remember" color="primary" />}
      label="Remember me"
    /> */}
              {/* <Button
                type="submit"
                
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Edit
              </Button> */}
              {/* <Box mt={5}>
                <Copyright />
              </Box> */}
              <InitialFocus />
            </form>
          </div>
        </Grid>
        
      </Grid></>
  );
}
