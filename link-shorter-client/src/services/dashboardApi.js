const URL = "https://shortlink-whlp.onrender.com";


// get links data
export const getLinkData = async (data) => {
  return fetch(`${URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  
};
// get links for LinksTable
export const getLinkDataForTable = async (limit, offset, search) => {
  return fetch(`${URL}/dashboard/links?limit=${limit}&offset=${offset}&search=${search}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

// get all clicks
export const getAllClicks = async (limit, offset) => {
  return fetch(`${URL}/dashboard/getClicks?limit=${limit}&offset=${offset}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

// add new link
export const addNewLink = async (data) => {
  return fetch(`${URL}/dashboard/addlink`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

// get clicks data
export const getLinkDetailsByid = async (id) => {
  return fetch(`${URL}/dashboard/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

// edit link details
export const editLinkById = async (id, data) => {
  return fetch(`${URL}/dashboard/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

// delete link
export const deletLink = async (id) => {
  return fetch(`${URL}/dashboard/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};
