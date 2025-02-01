import React, { useEffect, useRef, useState } from "react";
import styles from "../styles/addlink.module.css";
import { RxCross1 } from "react-icons/rx";
import { addNewLink } from "../services/dashboardApi";
import Loader from "../components/Loader";

const AddLink = ({ onClose, onLoad }) => {
  const modelRef = useRef();
  const closeModel = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  const [originalLink, setOriginalLink] = useState("");
  const [remark, setRemark] = useState("");
  const [date, setDate] = useState("");
  const [ckecked, setckecked] = useState(false);
  const [EmptyLink, setEmptyLink] = useState(false);
  const [EmptyRemark, setEmptyRemark] = useState(false);

  const [loading, setLoading] = useState(false);

  let todayDate = new Date().toISOString().split("T")[0];
  const formatDate = (dateString) => {
    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
    };
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const handelNewLinkSubmit = async () => {
    if (originalLink) {
      setEmptyLink(false);
    } else {
      setEmptyLink(true);
      return 0;
    }

    if (remark) {
      setEmptyRemark(false);
    } else {
      setEmptyRemark(true);
      return 0;
    }
    let NewLinkData = null;
    if (date) {
      NewLinkData = {
        originalLink,
        remark,
        expireDate: date,
      };
    } else {
      NewLinkData = {
        originalLink,
        remark,
      };
    }

    try {
      setLoading(true);
      const res = await addNewLink(NewLinkData);
      if (res.status === 200) {
        const data = await res.json();
        alert(data.message);
        onClose();
        onLoad();
      } else {
        alert(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handelClear = () => {
    console.log("clear clicked");
    setOriginalLink("");
    setRemark("");
    setDate("");
    setckecked(false);
    setEmptyLink(false);
    setEmptyRemark(false);
  };
  return (
    <>
      {loading ? <Loader /> :(
      <>
        <div className={styles.main} ref={modelRef} onClick={closeModel}>
          <div className={styles.container}>
            <div className={styles.topNav}>
              <p>New Link</p>
              <button onClick={() => onClose()}>
                <RxCross1 size={22} />
              </button>
            </div>
            <form className={styles.formStyles}>
              <div className={styles.formInp}>
                <p>
                  Destination Url<span>*</span>
                </p>
                <input
                  type="text"
                  value={originalLink}
                  placeholder="http://web.whatsapp.com/"
                  onChange={(e) => setOriginalLink(e.target.value)}
                  style={{ border: EmptyLink ? "1px solid red" : "" }}
                />
                <p style={{ visibility: EmptyLink ? "visible" : "hidden" }}>
                  This field is mandatory
                </p>
              </div>
              <div className={styles.formInp}>
                <p>
                  Remarks<span>*</span>
                </p>
                <textarea
                  type="text"
                  rows="10"
                  cols="55"
                  value={remark}
                  placeholder="Add remarks"
                  style={{ border: EmptyRemark ? "1px solid red" : "" }}
                  onChange={(e) => setRemark(e.target.value)}
                />
                <p style={{ visibility: EmptyRemark ? "visible" : "hidden" }}>
                  This field is mandatory
                </p>
              </div>
              <div>
                <div className={styles.formInp}>
                  <div className={styles.dateSwitch}>
                    <p>Link Expirations</p>
                    <div className={styles.toggle}>
                      <input
                        type="checkbox"
                        name="checkbox"
                        id="toggle"
                        checked={ckecked}
                        onChange={() => setckecked(!ckecked)}
                      />
                      <label htmlFor="toggle"></label>
                    </div>
                  </div>
                  <input
                    type="date"
                    className={styles.pickDate}
                    disabled={!ckecked}
                    min={todayDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>
            </form>
            <div className={styles.bottom}>
              <button onClick={handelClear}>Clear</button>
              <button onClick={handelNewLinkSubmit}>Create new</button>
            </div>
          </div>
        </div>
      </>)}
    </>
  );
};

export default AddLink;
