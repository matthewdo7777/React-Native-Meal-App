import React, { createContext, useState, useContext } from "react";

const IDListContext = createContext();

export const IDListProvider = ({ children }) => {
  const [idList, setIDList] = useState([]);

  const changeIDList = (newList) => {
    setIDList(newList);
  };

  const clearIDList = () => {
    setIDList([]);
  };
  return (
    <IDListContext.Provider
      value={{ idList, changeIDList, clearIDList}}>
      {children}
    </IDListContext.Provider>
  );
};

export const useIDList = () => useContext(IDListContext);