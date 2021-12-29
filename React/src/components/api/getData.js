import axios from "axios";

export function getData(url) {
  return axios.get(url, {
    withCredentials: true,
  });
}
