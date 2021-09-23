import React, { useState, useEffect, useContext } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import reducer from "./reducer";
import axios from "axios";

const rootUrl = "https://api.github.com";

// three steps to create contex
// #1 Create a variable and then call the create context
// #2 create a separate compunets where return the context variable with .provider and warp it with the main index.js componennts
// #3 create a custom hooks to access the context value throughout the app

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  // REDUCHER HOOK
  const intiState = {
    githubUser: mockUser,
    followers: mockFollowers,
    repos: mockRepos,
    request: 0,
    isLoading: false,
    error: { show: false, msg: "" },
  };
  const [state, dispatch] = React.useReducer(reducer, intiState);

  // SEARCH USER
  const searchUser = async (user) => {
    dispatch({ type: "LOADING-START" });
    const response = await axios(`https://api.github.com/users/${user}`).catch(
      (err) => {
        console.log(err);
      }
    );

    if (response) {
      dispatch({ type: "SET_USER_DATA", payload: response.data });
      const { followers_url, repos_url } = response.data;

      // SETTING UP REPOS AND FOLLOWER SECTIONS DATA
      Promise.allSettled([
        axios(`${repos_url}?per_page=100`),
        axios(`${followers_url}?per_page=100`),
      ]).then((response) => {
        const status = "fulfilled";
        const [repos, followers] = response;

        if (repos.status === status) {
          dispatch({ type: "SET_REPOS", payload: repos.value.data });
        }
        if (followers.status === status) {
          dispatch({ type: "SET_FOLLOWERS", payload: followers.value.data });
        }
      });
    } else {
      dispatch({
        type: "NO_USER_FOUND",
        payload: "sorry the user is not found!",
      });
    }
    dispatch({ type: "LOADING-STOP" });
  };

  // REMAINING REQUEST
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then(({ data }) => {
        let {
          rate: { remaining },
        } = data;
        dispatch({ type: "SET_REMAIMING_REQUEST", payload: remaining });
        if (remaining === 0) {
          dispatch({
            type: "TWROW_ERROR",
            payload:
              "sorry you have reched the limit for your request. plese try 1 houre latter again",
          });
        }
      })
      .catch(() => {
        throw new Error();
      });
  };

  useEffect(checkRequest, []);
  return (
    <GithubContext.Provider value={{ ...state, searchUser }}>
      {children}
    </GithubContext.Provider>
  );
};

const useGlobalContaxt = () => {
  return useContext(GithubContext);
};

export { useGlobalContaxt, GithubProvider };
