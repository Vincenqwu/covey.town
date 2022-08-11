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
} from '@chakra-ui/react'
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


// type responseType = {
//   id: number;
//   name?: string; 
//   salary?: number; 
// };


// export default function SignIn(props: { history: string[]; }) {
export default function Update() {

  const classes = useStyles();

  // console.log(typeof classes.root);

  const [viewForm, setViewForm] = useState(false);


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

  function BasicUsage() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>
  
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Modal Title</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              ssss
            </ModalBody>
  
            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
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
              <Button
                type="submit"
                
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Edit
              </Button>
              {/* <Box mt={5}>
                <Copyright />
              </Box> */}
            </form>
          </div>
        </Grid>
        <BasicUsage />
      </Grid></>
  );
}
