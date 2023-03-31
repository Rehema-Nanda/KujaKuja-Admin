import React from "react";
import "./GlobalFooter.css";

const footerLogo = require("../img/footer-logo.svg");

const GlobalFooter = () => {
    return (
        <section className="footer">
            <div className="footer-details">
                <div className="footer-logo">
                    <img alt="Logo" src={footerLogo} />
                </div>
                <div className="footer-social">
                    <div
                        className="social-instagram"
                        onClick={() => {
                            window.open("https://www.instagram.com/kujakujaglobal/", "_blank");
                        }}
                    />
                    <div
                        className="social-fb"
                        onClick={() => {
                            window.open("https://www.facebook.com/KujaKujaGlobal", "_blank");
                        }}
                    />
                    <div
                        className="social-twitter"
                        onClick={() => {
                            window.open("https://twitter.com/kujakujaglobal", "_blank");
                        }}
                    />
                    <div
                        className="social-medium"
                        onClick={() => {
                            window.open("https://medium.com/@KujaKujaGlobal", "_blank");
                        }}
                    />
                </div>
            </div>
        </section>
    );
};

export default GlobalFooter;
