import React, { useState } from "react";
import loginImg from "../assets/login.png";
import styles from "../styles/register.module.css";
import { useNavigate } from "react-router-dom";
import { userRegister } from "../services/userApi";
import Loader from "../components/Loader";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    newUserEmail: "",
    userMobile: "",
    newUserPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newError = {};
    if (!formData.userName.trim()) newError.userName = "Name is Required";
    if (!formData.newUserEmail.trim())
      newError.newUserEmail = "Email is Required";
    if (!formData.userMobile.trim()) newError.userMobile = "Mobile is Required";
    if (formData.userMobile.trim().length !== 10)
      newError.userMobile = "Invalid Mobile";
    if (!formData.newUserPassword.trim())
      newError.newUserPassword = "Password is Required";
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  const handelRegisterUser = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return console.log("fields required");
    }
    try {
        setLoading(true);
        const formattedData = {
          username: formData.userName,
          email: formData.newUserEmail,
          mobile: formData.userMobile,
          password: formData.newUserPassword,
        };
        const res = await userRegister(formattedData);
        const data = await res.json();
        if(res.status === 200){
          console.log(data);
          alert("Register Succefully", data.message);
        }else{
          alert(data.message);
        }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
      setFormData({
        userName: "",
        newUserEmail: "",
        userMobile: "",
        newUserPassword: "",
      });
    }
  };

  return (
    <>{ loading ? <Loader /> : 
    <div className={styles.main}>
      <div className={styles.cover}>
        <div className={styles.imageSection}>
          <img src={loginImg} alt="cover image" />
        </div>
      </div>
      <div className={styles.login}>
        <div className={styles.UserBtns}>
          <button onClick={() => navigate("/register")}>SignUp</button>
          <button onClick={() => navigate("/login")}>Login</button>
        </div>
        <form className={styles.formData}>
          <div className={styles.headtitle}>
            <h1>Join us Today !</h1>
          </div>
          <div className={styles.userInput}>
            <input
              className={styles.inputFiled}
              type="text"
              placeholder="Name"
              name="userName"
              value={formData.userName}
              required
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <p
              style={{ visibility: errors.userName ? "visible" : "hidden" }}
              className={styles.worningMsg}
            >
              {errors.userName || "Field is Required"}
            </p>
            <input
              className={styles.inputFiled}
              type="email"
              placeholder="Email"
              name="newUserEmail"
              value={formData.newUserEmail}
              required
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <p
              style={{ visibility: errors.newUserEmail ? "visible" : "hidden" }}
              className={styles.worningMsg}
            >
              {errors.newUserEmail || "Field is Required"}
            </p>
            <input
              className={styles.inputFiled}
              type="mobile"
              placeholder="Mobile"
              name="userMobile"
              value={formData.userMobile}
              required
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <p
              style={{ visibility: errors.userMobile ? "visible" : "hidden" }}
              className={styles.worningMsg}
            >
              {errors.userMobile || "Field is Required"}
            </p>
            <input
              className={styles.inputFiled}
              type="password"
              placeholder="Password"
              name="newUserPassword"
              value={formData.newUserPassword}
              required
              onChange={(e) =>
                setFormData({ ...formData, [e.target.name]: e.target.value })
              }
            />
            <p
              style={{
                visibility: errors.newUserPassword ? "visible" : "hidden",
              }}
              className={styles.worningMsg}
            >
              {errors.newUserPassword || "Field is Required"}
            </p>
          </div>
          <div className={styles.formBottom}>
            <button className={styles.submitBtn} onClick={handelRegisterUser}>
              Register
            </button>
            <p>
              Already have an account??{" "}
              <a onClick={() => navigate("/login")}>Sign In</a>{" "}
            </p>
          </div>
        </form>
      </div>
    </div>
    }
    </>
  );
};

export default Register;
