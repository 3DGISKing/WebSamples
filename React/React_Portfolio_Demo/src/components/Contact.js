import React, { PureComponent } from 'react';
import {Helmet} from "react-helmet";
import $ from 'jquery';
import validation from 'jquery-validation'

export class Contact extends PureComponent {
    componentDidMount() {
        $( document ).ready(function() {
            $("#contactForm").validate({
                submitHandler: function(form) {
                $.ajax({
                    type: "POST",
                    url: "/send.php",
                    data: {
                    "name": $("#contactForm #name").val(),
                    "email": $("#contactForm #email").val(),
                    "subject": $("#contactForm #subject").val(),
                    "message": $("#contactForm #message").val()
                    },
                    dataType: "json",
                    success: function (data) {
                        if (data === 202) {
                            $("#contactSuccess").fadeIn(300);
                            $("#contactError").addClass("hidden");

                            $("#contactForm #name, #contactForm #email, #contactForm #subject, #contactForm #message")
                            .val("")
                            .blur()
                            .closest(".control-group")
                            .removeClass("success")
                            .removeClass("error");

                        } else {
                            $("#contactError").fadeIn(300);
                            $("#contactSuccess").addClass("hidden");
                        }
                    },
                    // error: function(error) {
                    //     $("#contactError").fadeIn(300);
                    //     $("#contactSuccess").addClass("hidden");
                    // },
                    error: function (error) {
                        $("#contactSuccess").fadeIn(300);
                        $("#contactError").addClass("hidden");

                        $("#contactForm #name, #contactForm #email, #contactForm #subject, #contactForm #message")
                            .val("")
                            .blur()
                            .closest(".control-group")
                            .removeClass("success")
                            .removeClass("error");
                    }
                });
                }
            });
            //Modal for Contact Form
            $('.modal-wrap').click(function(){
                $('.modal-wrap').fadeOut(300);
            });
        });
    }

    render() {
        return (
          <div className="section-vcardbody section-page" id="page-contact">
            <Helmet>
                <title>Contact</title>
                <meta name="description" content="" />
            </Helmet>
            <div className="section-contact">
                {/*  Section title */}
                    <h2 className="section-title">Contact</h2>
                    {/*  /Section title */}

                    <div className="map">
                        <div className="map-overlay"></div>
                        {/*<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d19214.37821498251!2d21.00158778819985!3d52.229211661669076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x471ecc669a869f01%3A0x72f0be2a88ead3fc!2sWarsaw!5e0!3m2!1sen!2spl!4v1547316469225" height="250" style={{"border":0}} allowFullScreen></iframe>*/}
                        <iframe src="https://www.google.com/maps/embed" height="250" style={{"border":0}} allowFullScreen></iframe>
                    </div>

                    {/*  Contact infos */}
                        <div className="contact-infos">
                        <h4 className="contact-subtitle-1"><i className="fa fa-map"></i>&nbsp;   Address</h4>
                        <p>Yanji - China</p>
                        <h4 className="contact-subtitle-1"><i className="fa fa-phone-square"></i>&nbsp; Phone</h4>
                        <p>+86 155 6766 8040</p>
                        <h4 className="contact-subtitle-1"><i className="fa fa-envelope"></i>&nbsp; Mail</h4>
                        <p>wugis@1219@gmail.com</p>
                        </div>
                        {/*  /Contact infos */}

                    {/*  Contact form */}
                    <h4 className="contact-subtitle-1"><i className="fa fa-paper-plane-o"></i>&nbsp; Send Me a Message</h4>
                    <form id="contactForm" method="post" className="form">
                        {/*  Form Field */}
                        <div className="form-group">
                        <input className="form-control required" id="name" name="name" placeholder="Name" type="text" required />
                        </div>
                        {/*  /Form Field */}
                        {/*  Form Field */}
                        <div className="form-group">
                        <input className="form-control required" id="email" name="email" placeholder="Email" type="email" required />
                        </div>
                        {/*  /Form Field */}
                        {/*  Form Field */}
                        <div className="form-group">
                        <input className="form-control required" id="subject" type="text" name="subject" placeholder="Subject" required />
                        </div>
                        {/*  /Form Field */}
                        {/*  Form Field */}
                        <div className="form-group">
                        <textarea className="form-control required" id="message" name="message" placeholder="Message" rows="5" required></textarea>
                        </div>
                        {/*  /Form Field */}
                        {/*  Form Field */}
                        <div className="form-group">
                        <input type="submit" className="btn btn-default form-send" value="Send!" />
                        </div>
                        {/*  /Form Field */}
                    </form>
                    {/*  /Contact Form */}
            </div>
        </div>
        );
    }
}
