import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Link from "@material-ui/core/Link";
import Paper from "@material-ui/core/Paper";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import image from "./Images/image.jpg";
import axios from './api/axios';
// import authService from "./service/authService";

const LOGIN_URL = '/users/login';
 
/**
 * This is the Copyright component 
 * @returns a html
 */
function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary" align="center">
      {"Copyright © "}
      <Link color="inherit" href="https://github.com/Vincenqwu/covey.town"> 
      Github CoveyTown by Qiuan, Tong, Yingying
      </Link>{" "}
      {`${new Date().getFullYear()}.`}
    </Typography>
  );
}

/**
 * This is the html formatting.
 */
const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    backgroundImage: `url(${image})`,
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
    width: "100%",
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

/**
 * This is the SignIn component. 
 * @returns a html
 */
export default function SignIn() {
  const classes = useStyles();
  // const { setAuth } = useContext(AuthContext);

  const [user, setUser] = useState('');
  const [pwd, setPwd] = useState('');
  const [token, setToken] = useState('');
  const [errMsg, setErrMsg] = useState('');
  const [success, setSuccess] = useState(false);
  const [isChecked, setIsChecked] = useState('false');

  const savedUsername = localStorage.getItem("username");
  const savedPassword = localStorage.getItem("password");
  const saveedIsChecked = localStorage.getItem("ischecked");

  useEffect(() => {
    setErrMsg('');
  }, [user, pwd]);

  useEffect(() => {
    if (saveedIsChecked === "true" && savedUsername !== null) {
      setUser(savedUsername);
    }
  }, []);

  useEffect(() => {
    if (saveedIsChecked === "true" && savedPassword !== null) {
      setPwd(savedPassword);
    }
  }, []);

  const handleCheckBox = (event: { target: { checked: any; }; }) => {
    setIsChecked(event.target.checked);
  };

  useEffect(() => {
    if (success === true) {
      localStorage.setItem("username", user);
      localStorage.setItem("password", pwd);
      localStorage.setItem("x-access-token", token);
      localStorage.setItem("ischecked", isChecked);
    }
  }, [success, setSuccess]);

  
  /**
   * This is the handelLogin function, when user input the valid username and password, the user would login successfully.
   * @param e the event
   */
  const handelLogin = async(e: { preventDefault: () => void; })=>{
      e.preventDefault();
        // 调用api，返回信息，是否登陆成功，一个json，name，local jwt token，

      const username = user;
      const password = pwd;

      try {
        const response = await axios.post(
          LOGIN_URL,
          JSON.stringify({ username, password }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
        setToken(response?.data.token);
        setSuccess(true);
        setUser('');
			  setPwd('');

      } catch (err) {
        if (err instanceof Error) {
          if (err.message === "Request failed with status code 404") {
            setErrMsg('Username does not exist');
          } else if (err.message === "Request failed with status code 400") {
            setErrMsg(' Password is wrong');
          } else {
            setErrMsg('Login Failed');
          }
        } else {
          setErrMsg('Login Failed');
        }
      }

  };



  return (
    <>
      {
        success? (
          <section>
					<h1>You are logged in!</h1>
					<br />
					<p><a href="/welcome">Welcome to CoveyTown</a></p>
				</section>
        ) : (
          
          <Grid container component="main" className={classes.root}>
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
                <p
                  style = {{
                    fontSize: '1.2rem',
                    color: 'white',
                    backgroundColor: 'red',
      
                  }}
                  // className={errMsg ? 'errmsg' : 'offscreen'}
                  aria-live="assertive"
                >
                  {errMsg}
                </p>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <form className={classes.form} noValidate>
                  <TextField
                    onChange={(e) => setUser(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    value = {user}
                    autoFocus
                  />
                  <TextField
                    onChange={(e) => setPwd(e.target.value)}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    value = {pwd}
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" onChange={handleCheckBox}/>}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick = {handelLogin}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    <Grid item>
                      <Link href="/signup" variant="body2">
                        Don&apos;t have an account? Sign Up
                      </Link>
                    </Grid>
                  </Grid>
                  <Box mt={5}>
                    <Copyright />
                  </Box>
                </form>
              </div>
            </Grid>
          </Grid>
        )
      }
    
    </>
  );
}
