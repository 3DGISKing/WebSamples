import React, {Component, Fragment} from 'react';
import {Route, Link} from 'react-router-dom'
import {ProjectList} from './components/ProjectList';
import {slide as Menu} from 'react-burger-menu'
import {Skills} from './components/Skills';
import {Resume} from './components/Resume';
import {Contact} from './components/Contact';
import {ProjectDetails} from './components/ProjectDetails';
import RouterLastLocation from './hoc/RouterLastLocation';
import './css/styles.css';
//import $ from 'jquery'

class App extends Component {
    state = {
        menuOpen: false
    };

    componentDidMount() {
      const $ = window.$;
      // const jQuery = window.$;

        // TODO: all of the below functions should be rewriten in React
        $(window).load(function () {
            //==============___Page Loader___================
            $('#page-loader').delay(300).fadeOut(400, function () {
            });
            $('#loader-name').addClass('loader-left');
            $('#loader-job').addClass('loader-right');
            $('#loader-animation').addClass('loader-hide');
        });

        let linkHome = 0;

        $(document).ready(function () {
            const location = window.location.pathname;
            if (location.includes('/resume')) {
                menuLinkClicked('#page-resume');
            } else if (location.includes('/skills')) {
                menuLinkClicked('#page-skills');
            } else if (location.includes('/projects/')) {
                menuLinkClicked('#page-projects');
            } else if (location.includes('/project/')) {
                loadProjectByDirectURL();
            } else if (location.includes('/contact')) {
                menuLinkClicked('#page-contact');
            }
            //==============___Page Loader___================
            $('#loading-wraper').fadeIn(300);

            //==============_Map_================
            $('.map').on('click', function () {
                $('.map-overlay').hide();
            });

            $('.map').on('mouseleave', function () {
                $('.map-overlay').show();
            });

            //==============_Lightbox_================
            //Nivo Lightbox
            $('a.nivobox').nivoLightbox({effect: 'fade'});


            //==============___Scrollbars___================
            $('.section-vcardbody').perfectScrollbar({
                 wheelSpeed: 0.9
             });

            //==============___Menu & Pages Animation___================

            function pageOn() {
                $('#main-menu').addClass('main-menu-pgactive');
                $('#section-home').addClass('section-vcardbody-pgactive');
                $('.profileActive').removeClass('profileActive');
                $('#profile2').addClass('profileActive');

                linkHome = 1;
            }

            function pageOff() {
                $('.section-page-active').removeClass('section-page-active');
                $('#main-menu').removeClass('main-menu-pgactive');
                $('#section-home').removeClass('section-vcardbody-pgactive');
                $('.profileActive').removeClass('profileActive');
                $('#profile1').addClass('profileActive');
                linkHome = 0;
            }

            function menuLinkClicked(linkPage) {
                $('.menuActive').removeClass('menuActive');
                $('a[data-menu-item-id="' + linkPage + '"]').addClass('menuActive');
                $('.section-page-active').removeClass('section-page-active');
                $(linkPage).addClass('section-page-active');
                pageOn();
            }

            function loadProjectByDirectURL() {
                $('a[data-menu-item-id="#page-projects"]').addClass('menuActive');
                pageOn();
            }

            $(".link-page").on('click', function (event) {
                //event.preventDefault();
                setTimeout(() => {
                    // We need to wait for react to finish its job
                    // TODO: move these functions to react component
                    menuLinkClicked($(this).attr('data-menu-item-id'));
                }, 0);
            });


            $(".link-home").on('click', function (event) {
                event.preventDefault();

                if (linkHome === 0) {
                    //pageOn();
                } else if (linkHome === 1) {
                    $('.menuActive').removeClass('menuActive');
                    $(this).addClass('menuActive');
                    pageOff();
                }
            });
            //End - Document Ready
        });
    }

    componentDidUpdate(prevProps) {
        // if user came from project page
        if (prevProps.location.pathname.includes('/project/')) {
            window.$('#page-projects').addClass('section-page-active');
        }
    }

    handleBurgerMenuStateChange(state) {
        this.setState({menuOpen: state.isOpen});
    }

    closeBurgerMenu() {
        this.setState({menuOpen: false}, () => {
            window.$('html, body').animate({
                scrollTop: window.$('div.section-page').offset().top
            }, 500, () => window.$(this).remove());
        });
    }

    renderPageLoader() {
        return (
            <div className="loader-container" id="page-loader">
                <div className="loading-wrapper">
                    <div className="loader-animation" id="loader-animation">
                        <span className="loader"><span className="loader-inner"/></span>
                    </div>
                    <div className="loader-name" id="loader-name">
                        Zhefeng<strong>Jin</strong>
                    </div>
                    <p className="loader-job" id="loader-job">GIS Software Developer</p>
                </div>
            </div>
        )
    }

    renderMenu() {
        return (
            <Menu isOpen={this.state.menuOpen} right onStateChange={(state) => this.handleBurgerMenuStateChange(state)}>
                <ul className="main-menu-list">
                    <li><Link to="/resume" onClick={() => this.closeBurgerMenu()} className="link-page"
                              data-menu-item-id="#page-resume">RESUME</Link></li>
                    <li><Link to="/skills" onClick={() => this.closeBurgerMenu()} className="link-page"
                              data-menu-item-id="#page-skills">SKILLS</Link></li>
                    <li><Link to={{pathname: '/projects/1'}} onClick={() => this.closeBurgerMenu()}
                              className="link-page" data-menu-item-id="#page-projects">PROJECTS</Link></li>
                    <li><Link to="/contact" onClick={() => this.closeBurgerMenu()} className="link-page"
                              data-menu-item-id="#page-contact">CONTACT</Link></li>
                </ul>
            </Menu>
        )
    }

    renderForms() {
        return (
            <div>

                {/* Contact Form - Ajax Messages */}
                {/* Form Sucess */}
                <div className="form-result modal-wrap" id="contactSuccess">
                    <div className="modal-bg"/>
                    <div className="modal-content">
                        <h4 className="modal-title"><i className="fa fa-check-circle"/> Success!</h4>
                        <p>Your message has been sent to us.</p>
                    </div>
                </div>
                {/* /Form Sucess */}
                {/* form-error */}
                <div className="form-result modal-wrap" id="contactError">
                    <div className="modal-bg"/>
                    <div className="modal-content">
                        <h4 className="modal-title"><i className="fa fa-times"/> Error</h4>
                        <p>There was an error sending your message.</p>
                    </div>
                </div>
                {/* /form-error */}
                {/* Contact Form - Ajax Messages */}

            </div>
        )
    }

    renderFooter() {
        return (

            <div className="vcard-footer">
                {/*  Social Icons */}
                <div className="footer-social-icons">
                    <a href="https://github.com/3DGISKing/" rel="noopener noreferrer" target="_blank"
                       className="margin-right"><i className="fa fa-github"/></a>
                    <a href="https://twitter.com/zhefengjingis" rel="noopener noreferrer"
                       target="_blank" className="margin-right"><i className="fa fa-twitter"/></a>
                    <a href="https://www.instagram.com/3dgisking/" rel="noopener noreferrer"
                       target="_blank" className="margin-right"><i className="fa fa-instagram"/></a>
                    <a href="https://www.linkedin.com/in/zhefeng-jin-4ab9b3145/"
                       rel="noopener noreferrer" target="_blank" className="margin-right">
                        <i className="fa fa-linkedin"/>
                    </a>
                    <a href="https://www.xing.com" rel="noopener noreferrer" target="_blank"
                       className="margin-right"><i className="fa fa-xing-square"/></a>
                </div>
                {/*  /Social Icons */}
            </div>
        )
    }

    renderMainMenu() {
        return (

            <div className="main-menu" id="main-menu">
                <ul className="main-menu-list">
                    <li><a href="#page-resume" className="link-home" data-menu-item-id="#page-home">Home</a>
                    </li>
                    <li><Link to="/resume" className="link-page"
                              data-menu-item-id="#page-resume">Resume</Link></li>
                    <li><Link to="/skills" className="link-page"
                              data-menu-item-id="#page-skills">Skills</Link></li>
                    <li><Link to={{pathname: '/projects/1'}} className="link-page"
                              data-menu-item-id="#page-projects">Projects</Link></li>
                    <li><Link to="/contact" className="link-page"
                              data-menu-item-id="#page-contact">Contact</Link></li>
                </ul>
            </div>

        )
    }

    renderBody() {
        return (
            <div className="section-vcardbody section-home" id="section-home">
                {/*  Profile pic*/}
                <div className="vcard-profile-pic">
                    <img src="/img/profile2.png" id="profile2" alt=""/>
                    <img src="/img/profile1.png" id="profile1" className="profileActive" alt=""/>
                </div>
                {/*  /Profile pic */}

                {/*  Description */}
                <div className="vcard-profile-description">
                    {/*  Profile title */}
                    <h1 className="profile-title">Hi, i'm <span className="color1">Zhefeng Jin!</span></h1>
                    <h2 className="profile-subtitle">Web GIS Software Developer</h2>
                    {/*  /Profile Title */}

                    {/*  Description Text */}
                    <hr className="hr1"/>
                    <div className="vcard-profile-description-text">
                        <p>Professional GIS Software Developer based on Yanji city. Sometimes works as a
                            freelancer. </p>
                    </div>
                    {/* / Description Text */}

                    {/*  Description feature */}
                    <div className="vcard-profile-description-feature">
                        {/*  item */}
                        <div className="vcard-profile-description-ft-item">
                            <p>contact: wugis1219@gmail.com / +86 155 6766 8040</p>
                        </div>
                        {/*  item */}
                    </div>
                    {/*  /Description feature */}
                </div>

                {this.renderFooter()}
            </div>
        )
    }

    render() {
        const self = this;

        return (
            <Fragment>
                {self.renderPageLoader()}
                {self.renderMenu()}

                <section id="body" className="">
                    <div className="container">
                        {self.renderMainMenu()}
                        {self.renderBody()}

                        <RouterLastLocation>
                            <Route exact path='/projects/:page' component={ProjectList}/>
                            <Route exact path='/project/:projectName' component={ProjectDetails}/>
                            <Route exact path='/resume' component={Resume}/>
                            <Route exact path='/skills' component={Skills}/>
                            <Route exact path='/contact' component={Contact}/>
                        </RouterLastLocation>
                    </div>
                </section>

                {self.renderForms()}
            </Fragment>
        );
    }
}

export default App;
