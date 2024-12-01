import { combineReducers } from "@reduxjs/toolkit";

import propertyFormReducer from "./api/property/formState.slice";
import { baseApi } from "./baseApi";

const reducers = {
  propertyForm: propertyFormReducer,
  [baseApi.reducerPath]: baseApi.reducer,
};

export const whitelist = ["propertyForm"];

export const combineReducer = combineReducers<typeof reducers>(reducers);
