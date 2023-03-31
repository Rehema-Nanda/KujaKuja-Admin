// https://mobx-react.js.org/recipes-context

import React from "react";
import PropTypes from "prop-types";
import RootStore from "./stores/RootStore";

export const StoreContext = React.createContext(null);

export const StoreProvider = ({ children }) => {
    const store = new RootStore();
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};
StoreProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const StoreConsumer = StoreContext.Consumer;

export const useStore = () => {
    const store = React.useContext(StoreContext);
    if (!store) {
        // this is especially useful in TypeScript so you don't need to be checking for null all the time
        throw new Error("useStore must be used within a StoreProvider.");
    }
    return store;
};
