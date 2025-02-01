import React, { useCallback, useEffect, useState } from "react";
import styles from "../styles/links.module.css";
import { MdEdit } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import UpdateLink from "./UpdateLink";
import DeleteModel from "./DeleteModel";
import { deletLink, getLinkDataForTable } from "../services/dashboardApi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "../components/Loader";
import { useOutletContext } from "react-router-dom";
import useDebounce from "../customeHook/useDebounce";

const Links = () => {
  const [allLinksData, setAllLinksData] = useState();

  const { search=""} = useOutletContext();
  const debounceSearch = useDebounce(search, 500);

  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showDeleteModel, setDeleteModel] = useState(false);
  const [updateLink, setUpdateLink] = useState("");
  const [deleteLink, setDeleteLink] = useState("");
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const getLinksData = async () => {
    try {
      setLoading(true);
      const res = await getLinkDataForTable(limit, offset * limit, debounceSearch);
      if (res.status === 200) {
        const data = await res.json();
        setAllLinksData(data.LinkData);
        setCount(data.count);
      } else {
        console.log(res.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Function to format the date and time
  const formatDateTime = (dateString) => {
    const dateObj = new Date(dateString);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };
    return new Intl.DateTimeFormat("en-US", options).format(dateObj);
  };

  const handleCopyClick = (link) => {
    navigator.clipboard
      .writeText("https://shortlink-whlp.onrender.com/" + link.shortLink)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((error) => {
        console.error("Failed to copy text: ", error);
      });
  };

  const handleEditlink = async (link) => {
    setUpdateLink(link);
    setShowUpdateModel(true);
  };

  const handelDlt = async (link) => {
    setDeleteLink(link);
    setDeleteModel(true);
  };

  const handleDeleteLink = async (confirm) => {
    if (confirm == "Yes") {
      console.log("Deleting Link...");
      try {
        const res = await deletLink(deleteLink);
        const data = await res.json();
        if (res.status == 200) {
          alert(data.message);
          setDeleteModel(false);
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      setDeleteModel(false);
    }
  };

  useEffect(() => {
    getLinksData();
  }, [showUpdateModel, showDeleteModel, limit, offset, debounceSearch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <div className={styles.linksContainer}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>Remark</th>
                  <th>Clicks</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {allLinksData &&
                  allLinksData.map((link, index) => (
                    <tr key={index}>
                      <td>{formatDateTime(link.createdAt)}</td>
                      <td className={styles.overflowText}>
                        {link.originalLink}
                      </td>
                      <td className={styles.linkColum}>
                        <a
                          className={styles.overflowText}
                          href={link.shortLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          https://shortlink-whlp.onrender.com/{link.shortLink}
                        </a>
                        <button
                          className={styles.copyBtn}
                          onClick={() => handleCopyClick(link)}
                        >
                          <IoCopyOutline size={25} />
                        </button>
                      </td>
                      <td className={styles.overflowText}>{link.remark}</td>
                      <td>{link.totalClicks}</td>
                      <td
                        className={
                          link.activeStatus === "Active"
                            ? styles.activeStatus
                            : styles.inactiveStatus
                        }
                      >
                        {link.activeStatus}
                      </td>
                      <td>
                        <button
                          className={styles.actionButton}
                          onClick={() => handleEditlink(link._id)}
                        >
                          <MdEdit size={20} />
                        </button>
                        <button
                          className={styles.actionButton}
                          onClick={() => handelDlt(link._id)}
                        >
                          <RiDeleteBin6Line size={20} />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <table className={styles.tableTwo}>
              <tbody>
                {allLinksData &&
                  allLinksData.map((link, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th>Date</th>
                        <td>{formatDateTime(link.createdAt)}</td>
                      </tr>
                      <tr>
                        <th>Original Link</th>
                        <td className={styles.overflowText}>
                          {link.originalLink}
                        </td>
                      </tr>
                      <tr>
                        <th>Short Link</th>
                        <td className={styles.linkColum}>
                          <a
                            href={link.shortLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            https://shortlink-whlp.onrender.com/{link.shortLink}
                          </a>
                          <button
                            className={styles.copyBtn}
                            onClick={() => handleCopyClick(link)}
                          >
                            <IoCopyOutline size={25} />
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <th>Remark</th>
                        <td className={styles.overflowText}>{link.remark}</td>
                      </tr>
                      <tr>
                        <th>Clicks</th>
                        <td>{link.totalClicks}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td
                          className={
                            link.activeStatus === "Active"
                              ? styles.activeStatus
                              : styles.inactiveStatus
                          }
                        >
                          {link.activeStatus}
                        </td>
                      </tr>
                      <tr>
                        <th>Action</th>
                        <td>
                          <button
                            className={styles.actionButton}
                            onClick={() => handleEditlink(link._id)}
                          >
                            <MdEdit size={20} />
                          </button>
                          <button
                            className={styles.actionButton}
                            onClick={() => handelDlt(link._id)}
                          >
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </td>
                      </tr>
                      <tr className={styles.SpaceTr}><td colSpan="2"><div className={styles.spacer}></div></td></tr>                      
                    </React.Fragment>
                    
                  ))}
              </tbody>
            </table>
            <div className={styles.paging}>
              <button
                disabled={offset === 0}
                onClick={() => setOffset((offset) => offset - 1)}
                className={styles.Applybtn}
              >
                <IoIosArrowBack />
              </button>
              <select
                value={limit}
                className={styles.skillsOptns}
                onChange={(e) => setLimit(e.target.value)}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
              <button
                disabled={offset * limit + limit >= count}
                onClick={() => setOffset((offset) => offset + 1)}
                className={styles.Applybtn}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
          {showUpdateModel && (
            <UpdateLink
              onClose={() => setShowUpdateModel(false)}
              updateLink={updateLink}
            />
          )}
          {showDeleteModel && (
            <DeleteModel
              onClose={() => setDeleteModel(false)}
              onConfirm={handleDeleteLink}
              ofType={false}
            />
          )}
        </>
      )}
    </>
  );
};

export default Links;
