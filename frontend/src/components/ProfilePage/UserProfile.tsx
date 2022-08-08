import React, { StrictMode } from "react";
import * as ReactDOMClient from "react-dom/client";

import PersonalInfor from "./PersonalInfor";
// import ProfilePage from "./ProfilePage";

const rootElement = document.getElementById("root")!;
const root = ReactDOMClient.createRoot(rootElement);

root.render(
  <StrictMode>
    <PersonalInfor />
  </StrictMode>
);




// import React from 'react';
// import { Container,Row,Col,Form ,Button} from 'react-bootstrap';
// import {connect} from 'react-redux';
// import axios from 'axios';
// import DefaultUserPic from "../uploads/team-male.jpg";


// class UserProfile extends React.Component {
//     constructor(props: {any: any} | Readonly<{unknow: any}>){
//         super(props);
//         this.state={
//             user_id:this.props.user_id,
//             username:this.props.username,
//             email:this.props.email,
//             profileImage:this.props.profileImage,
//             msg:this.props.msg,
//             uploadedFile:null
//         }
//     }

    
//     fetchUserDetails=(user_id: string)=>{
//         axios.get(`http://localhost:5000/userapi/getUserDetails/${user_id}`,{
//             headers: {
//                 "content-type": "application/json"
//               }
//         }).then(res=>{
//             console.log(res);
//             this.setState({email:res.data.results[0].email});
//             this.setState({profileImage:res.data.results[0].profileImage})
//         })
//         .catch(err=>console.log(err))
//     }

//     changeProfileImage=(event: { target: { files: any[]; }; })=>{
       
//         this.setState({uploadedFile:event.target.files[0]});
//     }

//     UpdateProfileHandler=(e: { preventDefault: () => void; })=>{
//         e.preventDefault();
//         // create object of form data
//         const formData=new FormData();
//         formData.append("profileImage",this.state.uploadedFile);
//         formData.append("user_id",this.state.user_id);

//         // update-profile
//         axios.post("http://localhost:5000/userapi/update-profile/",formData,{
//             headers: {
//                 "content-type": "application/json"
//               }
//         }).then(res=>{
//             console.log(res);
//            this.setState({msg:res.data.message});
//            this.setState({profileImage:res.data.results.profileImage});
//         })
//         .catch(err=>console.log(err))
//     }


//     componentDidMount(){
//      this.fetchUserDetails(this.state.user_id);
//     }

// render(){

//     if(this.state.profileImage){
//         var imagestr=this.state.profileImage;
//         imagestr = imagestr.replace("public/", "");
//         var profilePic="http://localhost:5000/"+imagestr;
//     }else{
//          profilePic=DefaultUserPic;
//     }

//     return (
//         <Container>
//         <Row>
//        <Col>
//        <img src={profilePic} alt="profils pic" />
//        </Col>
//         <Col>
//             <h1>User Profile</h1>
//             <Form className="form">     
//     <p>{this.state.msg}</p>
//   <Form.Group controlId="formCategory1">
//     <Form.Label>Username</Form.Label>
//     <Form.Control type="text" defaultValue={this.state.username}/>
  
//   </Form.Group>
//   <Form.Group controlId="formCategory2">
//     <Form.Label>Email</Form.Label>
//     <Form.Control type="email" defaultValue={this.state.email} />
  
//   </Form.Group>
 
//   <Form.Group controlId="formCategory4">
//     <Form.Label>Profile Image</Form.Label>
//     <Form.Control type="file" name="profileImage" onChange={this.changeProfileImage}/>
//     </Form.Group>
//   <Button variant="primary" onClick={this.UpdateProfileHandler}>Update Profile</Button>
//   </Form>
//    </Col>

//        </Row>
//         </Container>
//     )
// }
// }

// const mapStatetoProps=(state: { user: { userDetails: { userid: any; username: any; }; email: any; profileImage: any; msg: any; }; })=>{
//     return{
//         user_id:state.user.userDetails.userid,
//         username:state.user.userDetails.username,
//        email:state.user.email,
//        profileImage: state.user.profileImage,
//        msg:state.user.msg
//     }
//    }
   
   

//    export default connect(mapStatetoProps)(UserProfile);


// // import React, { useState, useEffect } from 'react';

// // import '../style/profile.css';
// // import "../style/page.css"

// // const Profile = () => {
// //     const [profile, setProfile] = useState(null);
// //     useEffect(()=>{
// //         const fetchData = async() =>{
// //             const {data} = await getCurrentUserProfile();
// //             setProfile(data);
// //         };

// //         catchErrors(fetchData());
// //     }, []);

// //     render() {
// //         return (
// //             <div>
// //                 <h1>{profile}</h1>
// //             </div>

// //     );
// //         }
    
// // }

// // // class Profile extends React.Component {
// // //     constructor(props: {unknown: any} | Readonly<{unknown: any}>) {
// // //       super(props);
// // //       this.state = {
// // //         userName:'',
// // //         email:'',
// // //         password:'',
// // //       };
      
// // //     }

// //     // componentDidMount(){
// //     //   document.getElementById('addHyperLink').className = "";
// //     //   document.getElementById('homeHyperlink').className = "";
// //     //   document.getElementById('profileHyperlink').className = "active";
// //     //   this.getProfile();
// //     // }
// // //     updateProfile(){
      
// // //     }

// // //     // getProfile(){

// // //     // }
    
// // //     render() {
// // //       return (
// // //         <div className="col-md-5">
// // //           <div className="form-area"> 
// // //             <header>
// // //                 <div>User Profile</div>
// // //             </header>
// // //                 <br/>
// // //                 <div className="form-group">
// // //                   {/* <input value={this.state.userName} type="text" onChange={this.handleNameChange} className="form-control" placeholder="Name" required /> */}
// // //                 <div>User Name:</div> 
// // //                 <input type = "text"/>
// // //                 <br />
// // //                 <div className="form-group">
// // //                   <div>Email:</div>
// // //                   <input type = "text"/>
// // //                 </div>
// // //                 <br />
// // //                 </div>
// // //                 <div className="form-group">
// // //                   {/* <input value={this.state.password} type="password" onChange={this.handlePasswordChange} className="form-control" placeholder="Password" required /> */}
// // //                   <div>Password:</div>
// // //                   <input type = "text"/>
// // //                 </div>
// // //                 <button type="button" onClick={this.updateProfile} id="submit" name="submit" className="btn btn-primary pull-right">Update</button>
// // //           </div>
// // //         </div>
// // //       )
// // //     }
// // // }
