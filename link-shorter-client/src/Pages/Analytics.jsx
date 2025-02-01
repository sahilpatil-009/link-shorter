import React, { useEffect, useState } from "react";
import styles from "../styles/links.module.css";
import { getAllClicks } from "../services/dashboardApi";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import Loader from "../components/Loader";

const Analytics = () => {
  const [clicksData, setClicksData] = useState();
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

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

  const getAllLinkClicks = async () => {
    try {
      setLoading(true);
      const res = await getAllClicks(limit, offset);
      if (res.status === 200) {
        const data = await res.json();
        // console.log(data);
        setClicksData(data.clciks);
        setCount(data.count);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllLinkClicks();
  }, [limit, offset]);

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
                  <th>TimeStamp</th>
                  <th>Original Link</th>
                  <th>Short Link</th>
                  <th>ip address</th>
                  <th>User Device</th>
                </tr>
              </thead>
              <tbody>
                {clicksData &&
                  clicksData.map((link, index) => (
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
                      </td>
                      <td className={styles.overflowText}>{link.ipAddress}</td>
                      <td>{link.userDevice}</td>
                    </tr>
                  ))}
              </tbody>
            </table>

            <table className={styles.tableTwo}>
              <tbody>
                {clicksData &&
                  clicksData.map((link, index) => (
                    <React.Fragment key={index}>
                      <tr>
                        <th>TimeStamp</th>
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
                            className={styles.overflowText}
                            href={link.shortLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            https://shortlink-whlp.onrender.com/{link.shortLink}
                          </a>
                        </td>
                      </tr>
                      <tr>
                        <th>IP Address</th>
                        <td className={styles.overflowText}>
                          {link.ipAddress}
                        </td>
                      </tr>
                      <tr>
                        <th>User Device</th>
                        <td>{link.userDevice}</td>
                      </tr>
                      <tr className={styles.SpaceTr}>
                        <td colSpan="2">
                          <div className={styles.spacer}></div>
                        </td>
                      </tr>
                    </React.Fragment>
                  ))}
              </tbody>
            </table>
            <div className={styles.paging}>
              <button
                disabled={offset === 0}
                onClick={() => setOffset((prev) => Math.max(prev - 1, 0))}
                className={styles.Applybtn}
              >
                <IoIosArrowBack />
              </button>
              <select
                value={limit}
                className={styles.skillsOptns}
                onChange={(e) => {
                  const newLimit = Number(e.target.value);
                  setLimit(newLimit);
                  setOffset(0); // Reset offset when limit changes to start from the first page
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
              </select>
              <button
                disabled={offset + limit >= count}
                onClick={() => setOffset((prev) => prev + limit)}
                className={styles.Applybtn}
              >
                <IoIosArrowForward />
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Analytics;
