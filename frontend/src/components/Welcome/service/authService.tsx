const doLogIn = (username: string) => {
  localStorage.setItem("username", username);
  localStorage.setItem("isLoggedIn", "true");  // changed true to "true"
};

const isLoggedIn= () => Boolean(localStorage.getItem("isLoggedIn"));


const logOut = (props: { history: string[]; }) =>{

  localStorage.removeItem("username");
  localStorage.removeItem("isLoggedIn");
  props.history.push("/login");

};

export default {
  doLogIn,
  isLoggedIn,
  logOut
};