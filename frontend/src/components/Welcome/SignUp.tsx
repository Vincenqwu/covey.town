import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import axios from './api/axios';
import image from "./Images/image.jpg";
import SignIn from "./SignIn";

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
      {new Date().getFullYear()}
      .
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
    marginTop: theme.spacing(2, 6),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(1),
    padding: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
}));

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const REGISTER_URL = '/users/register';

/**
 * This is the SignUp component. 
 * @returns a html
 */
export default function SignUp() {
  const classes = useStyles();
  
  const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);

  const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

  useEffect(() => {
		setValidName(USER_REGEX.test(user));
	}, [user]);

  useEffect(() => {
		setValidEmail(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
	}, [pwd]);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd]);

  const handleSignup = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(user);
    const v2 = EMAIL_REGEX.test(email);
		const v3 = PWD_REGEX.test(pwd);
		if (!v1 || !v2 || !v3) {
			setErrMsg('Invalid Entry');
			return;
		}
    

    const username = user;
    const password = pwd;

    try {
			const response = await axios.post(
				REGISTER_URL,
				JSON.stringify({ username, password, email}),
				{
					headers: { 'Content-Type': 'application/json' },
				}
			);
			// TODO: remove console.logs before deployment
			// console.log(JSON.stringify(response?.status));
			setSuccess(true);
			// clear state and controlled inputs
			setUser('');
			setPwd('');
		} catch (err) {
      if (err instanceof Error) {
        if (err.message === "Request failed with status code 500") {
          setErrMsg('Username or email is not unique');
        }
        else {
				setErrMsg('Registration Failed');
			} 
		} else {
      setErrMsg('Registration Failed');
    }
  }}


  return (
    <>
      {success ? (
        <SignIn />
      ) : (
      <Grid container component="main" className={classes.root}>
      <CssBaseline />
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
            data-testid = "errmsg"
					>
					    {errMsg}   
					</p>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <form className={classes.form} noValidate>
            <Grid container spacing={2}>
              <Grid item xs={12} justify-content = "center">
                <TextField
                  autoComplete="fname"
                  name="userName"
                  variant="outlined"
                  required
                  fullWidth
                  id="userName"
                  label="Username"
                  autoFocus
                  aria-invalid={validName ? 'false' : 'true'}
                  aria-describedby="uidnote"
                  onChange={(e) => setUser(e.target.value)}
                />
                
                {(user !== '' && !validName) && 
                <h4 style = {{
                  fontSize: '1.5 rem',
                  color: 'red',
                }} data-testid = "errmsg_username">
                  4 to 24 characters.
                  <br />
                  Must begin with a letter.
                  <br />
                  Letters, numbers, underscores, hyphens allowed.
						    </h4>}
              </Grid>
              <Grid item xs={12} justify-content = "center">
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  title="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                {(email !== '' && !validEmail) && 
                <h4 style = {{
                  fontSize: '1.5 rem',
                  color: 'red',
                }} 
                data-testid = "errmsg_email"
                title = "errmsg_email">
                  Need a valid email.
						    </h4>}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  title="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPwd(e.target.value)}
                />
                {(pwd !== '' && !validPwd) && 
                <h4 style = {{
                  fontSize: '1.5 rem',
                  color: 'red',
                }} data-testid = "errmsg_password"
                title = "errmsg_password">
                  8 to 24 characters.
                  <br />
                  Must include uppercase and lowercase letters, a number and a
                  special character.
                  <br />
                  Allowed special characters:{' '}
                  <span aria-label="exclamation mark">!</span>{' '}
                  <span aria-label="at symbol">@</span>{' '}
                  <span aria-label="hashtag">#</span>{' '}
                  <span aria-label="dollar sign">$</span>{' '}
                  <span aria-label="percent">%</span>
						    </h4>}
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick = {handleSignup}
            >
              Sign Up
            </Button>
            <Grid container >
              <Grid item>
                <Link href="/signin" variant="body2">
                  Already have an account? Sign in
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
    )};
    </>
    )
}
