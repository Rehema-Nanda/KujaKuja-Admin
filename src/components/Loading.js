import React from "react";
import "./Loading.css";

export default class Loading extends React.PureComponent {
    render() {
        return (
            <div className="loading-container">
                <div className="loader" />
            </div>
        );
    }
}
