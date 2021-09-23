import React from "react";

const reducer = (state, action) => {
  switch (action.type) {
    case (action.type = "SET_REMAIMING_REQUEST"): {
      return { ...state, request: action.payload };
    }
    case (action.type = "TWROW_ERROR"): {
      return { ...state, error: { show: true, msg: action.payload } };
    }
    case (action.type = "LOADING-START"): {
      return { ...state, isLoading: true };
    }
    case (action.type = "LOADING-STOP"): {
      return { ...state, isLoading: false };
    }
    case (action.type = "NO_USER_FOUND"): {
      return {
        ...state,
        error: { show: true, msg: action.payload },
      };
    }
    case (action.type = "SET_USER_DATA"): {
      console.log(state.isLoading);
      return {
        ...state,
        githubUser: action.payload,
        error: { show: false, msg: "" },
      };
    }
    case (action.type = "SET_FOLLOWERS"): {
      return { ...state, followers: action.payload };
    }
    case (action.type = "SET_REPOS"): {
      return { ...state, repos: action.payload };
    }

    default: {
      throw new Error(action.type);
    }
  }
};

export default reducer;
