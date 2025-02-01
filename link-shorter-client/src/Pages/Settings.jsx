import React, { useEffect, useState } from "react";
import styles from "../styles/settings.module.css";
import {
  deleteUser,
  getUserDetails,
  updateUserDetials,
} from "../services/userApi";
import DeleteModel from "./DeleteModel";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setmobile] = useState("");
  const [showDeleteModel, setShowDeleteModel] = useState(false);
  const [loading, setLoading] = useState(false);

  const naviaget = useNavigate();

  const getuser = async () => {
    try {
      setLoading(true);
      const res = await getUserDetails();
      const data = await res.json();
      if (res.status == 200) {
        setUsername(data.username);
        setEmail(data.email);
        setmobile(data.mobile);
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const updateUser = async (e) => {
    e.preventDefault();
    if (mobile.trim().length !== 10) {
      return alert("Invalid Mobile No.");
    }
    try {
      setLoading(true);
      const data = {
        username,
        email,
        mobile,
      };
      const res = await updateUserDetials(data);
      if (res.status == 200) {
        const data = await res.json();
        alert(data.message);
        getuser();
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoading(false);
    }
  };

  const handleDeleteAccount = async (confirm) => {
    if (confirm == "Yes") {
      try {
        setLoading(true);
        const res = await deleteUser();
        const data = await res.json();
        if (res.status == 200) {
          alert(data.message);
          setShowDeleteModel(false);
          localStorage.removeItem("token");
          naviaget("/login");
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }finally{
        setLoading(false);
      }
    }else{
      setShowDeleteModel(false);
    }
  };

  useEffect(() => {
    getuser();
  }, []);

  return (
    <>{ loading ? <Loader /> : (<>
      <div className={styles.conatiner}>
        <form className={styles.UpdateForm}>
          <div className={styles.UserInp}>
            <p>Name</p>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.UserInp}>
            <p>Email id</p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.UserInp}>
            <p>Mobile no.</p>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setmobile(e.target.value)}
            />
          </div>
          <div className={styles.userBtns}>
            <button type="button" onClick={updateUser}>
              Save changes
            </button>
            <button type="button" onClick={() => setShowDeleteModel(true)}>
              Delete Account
            </button>
          </div>
        </form>
      </div>
      {showDeleteModel && (
        <DeleteModel
          onClose={() => setShowDeleteModel(false)}
          onConfirm={handleDeleteAccount}
          ofType={true}
        />
      )}
      </>)}
    </>
  );
};

export default Settings;
