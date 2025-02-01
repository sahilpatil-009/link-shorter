import React, { useRef } from "react";
import styles from "../styles/dltmodel.module.css";
import { RxCross1 } from "react-icons/rx";
const DeleteModel = ({ onClose, onConfirm , ofType }) => {
  const modelRef = useRef();

  const closeModel = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div className={styles.main}  ref={modelRef} onClick={closeModel}>
      <div className={styles.container}>
        <div className={styles.dltbtn}>
          <button onClick={() => onClose()}>
            <RxCross1 size={20} />
          </button>
        </div>
        <div className={styles.concentBox}>
            <p className={styles.concentMsg}>
              {ofType ? "Are you sure want to delete the account ?" : " Are you sure, you want to remove it ?"
              }
            </p>
          <div className={styles.ctrlBtn}>
            <button onClick={() => onClose()}>NO</button>
            <button onClick={() => onConfirm("Yes")}>YES</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteModel;
