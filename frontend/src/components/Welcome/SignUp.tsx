import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
// import Checkbox from "@material-ui/core/Checkbox";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
// import Container from "@material-ui/core/Container";
import axios from './api/axios';
import image from "./Images/image.jpg";

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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    padding: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const EMAIL_REGEX = /^[a-zA-Z0-9.! #$%&'*+/=? ^_`{|}~-]+@[a-zA-Z0-9-]+(?:\. [a-zA-Z0-9-]+)*$/;
const REGISTER_URL = '/users/register';

export default function SignUp() {
  const classes = useStyles();

  const [user, setUser] = useState('');
	const [validName, setValidName] = useState(false);
	const [userFocus, setUserFocus] = useState(false);

  const [email, setEmail] = useState('');
	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [pwd, setPwd] = useState('');
	const [validPwd, setValidPwd] = useState(false);
	const [pwdFocus, setPwdFocus] = useState(false);

	const [matchPwd, setMatchPwd] = useState('');
	const [validMatch, setValidMatch] = useState(false);
	const [matchFocus, setMatchFocus] = useState(false);

	const [errMsg, setErrMsg] = useState('');
	const [success, setSuccess] = useState(false);

  useEffect(() => {
		setValidName(USER_REGEX.test(user));
	}, [user]);

  useEffect(() => {
		setValidName(EMAIL_REGEX.test(email));
	}, [email]);

	useEffect(() => {
		setValidPwd(PWD_REGEX.test(pwd));
		setValidMatch(pwd === matchPwd);
	}, [pwd, matchPwd]);

	useEffect(() => {
		setErrMsg('');
	}, [user, pwd, matchPwd]);

  const handleSignup = async(e: { preventDefault: () => void; }) => {
    e.preventDefault();

    console.log(user);
    console.log(email);
    console.log(pwd);


    // const v1 = USER_REGEX.test(user);
    // const v2 = EMAIL_REGEX.test(email);
		// const v3 = PWD_REGEX.test(pwd);
		// if (!v1 || !v2 || !v3) {
		// 	setErrMsg('Invalid Entry');
		// 	return;
		// }

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
			console.log(JSON.stringify(response?.data));
			setSuccess(true);
			// clear state and controlled inputs
			setUser('');
			setPwd('');
			setMatchPwd('');
		} catch (err) {
			// if (!err?.response) {
			// 	setErrMsg('No Server Response');
			// } else if (err.response?.status === 409) {
			// 	setErrMsg('Username Taken');
			// } else {
			// 	setErrMsg('Registration Failed');
			// }
			// errRef.current.focus();
		}
  }


  return (
    <Grid container component="main" className={classes.root}>
      {/* <Container component="main" maxWidth="xs"> */}
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
                  onChange={(e) => setUser(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} justify-content = "center">
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  onChange={(e) => setPwd(e.target.value)}
                />
              </Grid>
              {/* <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid> */}
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
      {/* </Container> */}
    </Grid>
  );
}
