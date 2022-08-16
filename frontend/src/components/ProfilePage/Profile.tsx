import React, { useEffect, useState, ChangeEvent } from "react";
import { Button, ChakraProvider, Heading } from '@chakra-ui/react';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles, ThemeProvider, createTheme } from "@material-ui/core/styles";
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import axios from "../Welcome/api/axios";
import NavBar from "./NavBar";
import "./profile.css";
import townPerson from './img/townPerson.png';
import townImg from './img/CoveyTown.png';
import TownRecord from "./TownRecord";


const useStyles = makeStyles((theme) => ({
  root: {
    height: "90vh",
    backgroundImage: `url(${townImg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[50]
        : theme.palette.grey[900],
    display: "center",
    alignItems: "left",
    justifyContent: "center"

  },
}));

/**
 * This is the user profile page component
 * @returns a html object
 */
export default function UserProfile() {
  const classes = useStyles();
  const savedUsername = localStorage.getItem("username");
  const token = localStorage.getItem("x-access-token");
  const GETINFO_URL = `/users/${savedUsername}`;
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [viewForm, setViewForm] = useState(false);
  const [file, setFile] = useState<File | null>();
  const [profileImg, setProfileImg] = useState('');

  const showUsername = async () => {
    try {
      const response = await axios.get(
        GETINFO_URL,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-access-token': token
          },
        }
      );
      setUsername(response.data.username);
      setEmail(response.data.email);
      setPassword(response.data.password);
      if (response.data.profilePictureUrl) {
        setProfileImg(response.data.profilePictureUrl);
      }
      console.log(response.data);

    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    showUsername();
  }, []);

  /**
   * This is a foldable form which allow user to edit the Email or password.
   */
  function EditForm() {
    const [oldPwd, setOldPwd] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
    const EMAIL_REGEX = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const [validEmail, setValidEmail] = useState(false);
    const [validPwd, setValidPwd] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    useEffect(() => {
      setValidEmail(EMAIL_REGEX.test(newEmail));
    }, [newEmail]);

    useEffect(() => {
      setValidPwd(PWD_REGEX.test(newPwd));
    }, [newPwd]);

    useEffect(() => {
      setErrMsg('');
    }, [newEmail, newPwd]);


    const handleSave = async (e: { preventDefault: () => void; }) => {
      e.preventDefault();
      const v1 = EMAIL_REGEX.test(newEmail);
      const v2 = PWD_REGEX.test(newPwd);
      if (!v1) {
        setErrMsg('Invalid new Email!');
        return;
      }
      if (!v2) {
        setErrMsg(' Invalid new Password! Password must include uppercase and lowercase letters, a number and a special character.');
        return;
      }

      try {
        const response = await axios.put(
          GETINFO_URL,
          JSON.stringify({ originalPassword: oldPwd, password: newPwd, email: newEmail }),
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            },
          }
        );
        setEmail(newEmail);
        setPassword(newPwd);
        setViewForm(false)
      } catch (err) {
        if (err instanceof Error) {
          console.log(err.message);
          if (err.message === "Request failed with status code 400") {
            setErrMsg(' Incorrect Old Password!');
          }
        }
      }
    }

    return (
      <form className="profileEditForm" onSubmit={handleSave}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="oldpwd"
          label="Old Password"
          name="oldpwd"
          autoFocus
          autoComplete="current-password"
          onChange={(e) => setOldPwd(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="email"
          label="New Email"
          type="email"
          id="email"
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          id="email"
          label="New Password"
          name="password"
          type="password"
          autoFocus
          onChange={(e) => setNewPwd(e.target.value)}
        />
        <button className="profileSubmitButton" type="submit" onClick={handleSave} > Submit</button>
        <button className="profileCancelButton" type="button" onClick={() => setViewForm(false)}> Cancel </button>
        <p
          style={{
            fontSize: '1.2rem',
            color: 'purple',
            width: 300,
          }}
        >
          {errMsg}
        </p>
      </form>
    )
  }



  const uploadHandler = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    try {
      if (file) {
        const data = new FormData();
        let fileName = Date.now() + file.name;
        fileName = fileName.replace(/\s/g, '_');
        data.append("name", fileName);
        data.append("file", file);
        await axios.post(
          `${process.env.REACT_APP_TOWNS_SERVICE_URL}/upload`,
          data,
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            },
          }
        ).then((res) => {
          if (res.status !== 200) {
            throw new Error("image format not correct");
          }
        });
        // Update user with image url
        await axios.put(
          `${process.env.REACT_APP_TOWNS_SERVICE_URL}/users/image/${savedUsername}`,
          JSON.stringify({ profilePictureUrl: fileName }),
          {
            headers: {
              'Content-Type': 'application/json',
              'x-access-token': token
            },
          }
        )
        window.location.reload();
      }
      else {
        console.log("file not found");
      }
    } catch (err) {
      console.log('Error', err);
    }
  }


  return (
    <ChakraProvider>
      <NavBar />
      <Grid container component="main" className={classes.root}>
        <div className="profile-container">
          <div className="profile-info">
            <div className="profile-details">
              <Heading as='h3' size='lg' className="detailsTitle"> My Profile </Heading>
              <div className="profile-header">
                {(() => {
                  if (file) {
                    return (
                      <img
                        className="profileUserImg"
                        src={URL.createObjectURL(file)}
                        alt="new profile img preview" />
                    );
                  } if (profileImg) {
                    return (
                      <img
                        className="profileUserImg"
                        src={`${process.env.REACT_APP_AWS_SERVICE_URL}/${profileImg}`}
                        alt="user profile img" />
                    );
                  }
                  return (
                    <img
                      className="profileUserImg"
                      src={townPerson}
                      alt="default profile img" />
                  );
                })()}

                <form className="uploadImage" onSubmit={uploadHandler}>
                  <label htmlFor="file" className="uploadOption">
                    {!file && (
                      <div className="selectImgButton">
                        <AddPhotoAlternateIcon htmlColor="tomato" className="shareIcon" />
                        <span className="uploadOptionText">Add Profile Image</span>
                      </div>
                    )}
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="file"
                      accept=".png,.jpeg,.jpg"
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        const { files } = e.target;
                        if (files) {
                          setFile(files[0]);
                        }
                      }} />
                  </label>
                  {file && <div className="uploadCancelGroup">
                    <button className="uploadButton" type="submit">Upload</button>
                    <button className="cancelButton" type="button" onClick={() => setFile(null)}> Cancel </button>
                  </div>}
                </form>

              </div>
              <div className="detailsInfo">
                <Heading as='h5' size='sm' className="detailsTitle"> Username: {username} </Heading>
              </div>
              <div className="detailsInfo">
                <Heading as='h5' size='sm' className="detailsTitle"> Email: {email} </Heading>
              </div>
              <Button className="profileEditButton" type="submit" onClick={() => setViewForm(true)}>Edit</Button>
              <div className="formWrapper">
                {viewForm ?
                  <EditForm /> : ''}
              </div>
            </div>
            <div className="profile-details">
              <Heading as='h3' size='lg' className="detailsTitle">My Record</Heading>
              <Heading as='h5' size='sm' className="detailsTitle">My Created Towns</Heading>
              <TownRecord username={username} token={token} />
            </div>
          </div>
        </div>

      </Grid>
    </ChakraProvider>
  );
}
