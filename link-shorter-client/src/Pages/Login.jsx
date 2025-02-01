import React, { useContext, useEffect, useState } from "react";
import styles from "../styles/login.module.css";
import loginImg from "../assets/login.png";
import { useNavigate } from "react-router-dom";
import { userLogin } from "../services/userApi";
import { AuthUserContext } from "../Contexts/AutUserProvider";
import Loader from "../components/Loader";

const Login = () => {
  const navigate = useNavigate();
  const { userAuth, setUserAuth } = useContext(AuthUserContext);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      setUserAuth(true);
      navigate("/dashboard");
    }
  }, []);
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [emailRquire, setEmailRequire] = useState(false);
  const [passwordRquire, setPasswordRequire] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleloginbutton = async (e) => {
    e.preventDefault();
    if (!loginData.email) setEmailRequire(true);
    if (!loginData.password) setPasswordRequire(true);
    try {
      setLoading(true);
      const res = await userLogin(loginData);
      const data = await res.json();
      if (res.status === 200) {
        localStorage.setItem("token", data.token);
        setUserAuth(true);
        navigate("/dashboard");
      } else {
        alert(data.message);
        setLoginData({
          email: "",
          password: "",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setLoginData({
        email: "",
        password: "",
      });
    }
  };

  return (
    <>
      { loading ? <Loader /> : (
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
                <h1>Login</h1>
              </div>
              <div className={styles.userInput}>
                <input
                  type="Email"
                  placeholder="Email"
                  name="email"
                  required
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <p
                  style={{ visibility: emailRquire ? "visible" : "hidden" }}
                  className={styles.worningMsg}
                >
                  Field is Required
                </p>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  required
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({
                      ...loginData,
                      [e.target.name]: e.target.value,
                    })
                  }
                />
                <p
                  style={{ visibility: passwordRquire ? "visible" : "hidden" }}
                  className={styles.worningMsg}
                >
                  Field is Required
                </p>
              </div>
              <div className={styles.formBottom}>
                <button
                  className={styles.submitBtn}
                  onClick={handleloginbutton}
                >
                  Sign in
                </button>
                <p>
                  Don't have an account?
                  <a onClick={() => navigate("/register")}> Sign Up</a>{" "}
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
