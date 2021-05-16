import React, { PureComponent } from 'react';

export class Resume extends PureComponent {
    componentDidMount() {
        const $ = window.$;
        $("#testimonial-carousel").owlCarousel({
            navigation : false, // Show next and prev buttons
            slideSpeed : 300,
            paginationSpeed : 400,
            responsiveRefreshRate : 200,
            responsiveBaseWidth: window,
            pagination: true,
            singleItem: true,
            navigationText: ["<span class='fa fa-chevron-left'></span>","<span class='fa fa-chevron-right'></span>"],
          });
    }
    render() {
        return (
          <div className="section-vcardbody section-page" id="page-resume">
            {/*  SECTION: WORK EXPERIENCE */}
            <div className="section-education">
                {/*  Section title */}
                <h2 className="section-title">Resume</h2>
                {/*  /Section title */}

                {/*  Buttons */}
                <div className="resume-buttons header-page-buttons">
                {/*  Download CV button */}
                <a href="/assets/cv.pdf"  target="_blank" className="btn btn-default btn-default2 margin-right"><i className="fa fa-download"></i>&nbsp; Download my resume</a>
                {/*  /Download CV button */}
                {/*  Get in Touch button */}
                <a href="/contact" className="btn btn-default btn-default2 link-page"><i className="fa fa-download"></i>&nbsp;  Get in Touch</a>
                {/*  /Get in Touch button */}
                </div>
                {/*  /Buttons */}
                <h2 className="section-title2"><i className="fa fa-flag"></i>&nbsp; Work Experience</h2>

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title1</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">JavaScript Developer / Owner - <span className="job-date">May 2010 - Current</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>My responsibilities are gathering requirements, analyzing problems, designing system architecture, coding, testing, server administration, and deployment. In a number of projects, I managed small teams (with up to three developers). I worked for a number of the world's biggest digital agencies and startup teams from the USA, the UK, Austria, Sweden, the Netherlands, Brazil and many more.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title2</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Full Stack Developer - <span className="job-date">Jul 2018 - Current</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p> Working as a JavaScript / Java developer for the new digital delivery arm of one of the largest insurers in Germany.
                        Constant cooperation between teams in Warsaw, Berlin and Nuremberg</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title3</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Full Stack Developer - <span className="job-date">Nov 2017 - Apr 2018</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>I worked on B2B SaaS startup for Business Intelligence that enables more people to make use of data by increasing the visibility, relevance and ease of access to analytics. I was actively involved in technological advising, helping define company rules, building and scaling SaaS application.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title4</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Java / Javascript Contractor - <span className="job-date">Nov 2013 - Oct 2017</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>I build software for the healthcare industry, working remotely as a Java contractor for the world's largest biotech company.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title5</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Co-Owner - <span className="job-date">May 2009 - May 2010</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>Together with my friends, I ran an interactive agency. Besides developing software I worked on other things, such as management, marketing and general issues concerning the company's development.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title6</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Software developer - <span className="job-date">Nov 2007 - Apr 2009</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>Responsible for development and delivery of highly optimized code (Action Script 3) for MashON platform. As a member of the flash developers team, I build the Comic Book Creator, a fully skinnable and CMS driven flash application.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Job Title7</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Mid-level PHP developer - <span className="job-date">Sep 2006 - Oct 2007</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>Designed and developed software solutions on time and synchronized with press articles for the largest Polish media corporation, Agora SA. Build an internal system that centralized information about products of four different brands owned by Euromark, one of the biggest Polish outdoor clothing companies.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}

                {/*  Resume Item */}
                <div className="resume-item">
                {/*  Work Place */}
                <h3 className="section-item-title-1">Hob Title8</h3>
                {/*  /Work Place */}
                {/*  Job Time */}
                <h4 className="job">Junior PHP developer - <span className="job-date">Nov 2005 - Aug 2006</span></h4>
                {/*  /Job Time*/}
                {/*  content */}
                <div className="graduation-description">
                    <p>Implemented in-house CMS system (SimpleCMS). Created customized online stores based on osCommerce platform.</p>
                </div>
                {/*  /Content */}
                </div>
                {/*  /Resume Item */}
            </div>
            {/* / SECTION: WORK EXPERIENCE */}

            {/*  SECTION: Education */}
            <div className="section-education">

                <h2 className="section-title2"><i className="fa fa-university"></i>&nbsp; Education</h2>

                    {/*  Resume Item */}
                <div className="resume-item">
                {/*  Graduation title */}
                            <h3 className="section-item-title-1">Master's Degree in Computer Science</h3>
                            {/*  /Graduation title */}
                            {/*  Graduation time */}
                            <h4 className="graduation-time">University of XXXX</h4>
                            {/*  /Graduation time */}
                            {/*  content */}
                            <div className="graduation-description">
                            <p>I specialized in the Design of computer systems and developed my own CMS system in Java language as part of my Master's thesis work.</p>
                            </div>
                            {/*  /Content */}
                </div>
                    {/*  /Resume Item */}

                    {/*  Resume Item */}
                <div className="resume-item">
                {/*  Graduation title */}
                            <h3 className="section-item-title-1">Bachelor's Degree in Computer Science</h3>
                {/*  /Graduation title */}
                            {/*  /Graduation title */}
                            {/*  Graduation time */}
                            <h4 className="graduation-time">XXXXXX University College of Technology and Business</h4>
                            {/*  /Graduation time */}
                            {/*  content */}
                            <div className="graduation-description">
                            <p>I specialized in computer science and built an online auction system based on the open source PHP script as a Bachelor's thesis project.</p>
                            </div>
                            {/*  /Content */}
                </div>
                    {/*  /Resume Item */}
            </div>
            {/* / SECTION: Education */}


            <h2 className="section-title2"><i className="fa fa-commenting"></i>&nbsp; Testimonials</h2>

            {/*  Testimonials */}
            <div className="testimonials">
                {/*  Testimonial Slides */}
                <div className="testimonial-slides" id="testimonial-carousel">
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"He is a motivated, hard working and experienced developer with a broad knowledge of various web issues. We were pleased to have had him on our team.
                        He has always met deadlines and responds quickly to changes.I highly recommend he for any kind of project."</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client 1</p>
                    <p className="testimonial-firm">Owner, T-sign Studios Los Angeles</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"He is an outstanding developer with a deep knowledge on the subjects he is working on. Working with him was a pleasure."</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="./img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client 2</p>
                    <p className="testimonial-firm">Managing Director, Lightmaker Amsterdam</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"He is very talented programmer with broad knowledge of various web issues. He is skilled in PHP, MySQL, HTML, JavaScript. Apart from that he delivered his solutions on time and flawlessly. <a href="/assets/3e.jpg" rel="noopener noreferrer" target="_blank">See Reference Letter</a>"</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client3</p>
                    <p className="testimonial-firm">Managment Board Member, 3e</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"We have been working with him for over a year. It has been nothing but great experience, that proved even the toughest problems can be solved. We completely rely on this team for building amazing staff at the top levels both technically and creatively."</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client4</p>
                    <p className="testimonial-firm">Digital Producer, New York City</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"He has delivered us a technologically advanced solution for consumer's mini site of a well known tobacco brand. The site required coming up with a module for user authorisation via text messaging and enabled the registration of special codes placed on products. Thanks to them we were able to produce a cutting edge consumer's mini site in Adobe Flash technology."</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client5</p>
                    <p className="testimonial-firm">Managing Director, Argonauts</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"I have a great pleasure to work with him for the last year on many diverse projects. He has a wide range of development skills, as well as communicative skills. Easy-going and open-minded, He is a very good team player and intelligent person. He is always there for you to help with development challenges. Hopefully there is more to come in our cooperation!"</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client6</p>
                    <p className="testimonial-firm">Project Manager, Lightmaker Amsterdam</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                {/*  item */}
                <div className="testimonial-item">
                    {/*  Testimonial Content */}
                    <div className="testimonial-content">
                    <p>"I had the opportunity to work with him on several projects.
                        He is a very professional, well-organized, and responsible developer with a deep knowledge of many different technologies.
                        If you need someone who provides you with complex, efficient and reliable solutions and always on time, I can certainly say that you should consider him your business partner."</p>
                    </div>
                    {/*  /Testimonial Content */}
                    {/*  Testimonial Author */}
                    <div className="testimonial-credits">
                    {/*  picture */}
                    <div className="testimonial-picture">
                        <img src="img/client.png" alt=""/>
                    </div>
                    {/*  /picture */}
                    <p className="testimonial-author">Your Client7</p>
                    <p className="testimonial-firm">Data scientist, Berlin</p>
                    </div>
                    {/*  /Testimonial Author */}
                </div>
                {/*  /item */}
                </div>
                {/*  Testimonial Slides */}
            </div>
            {/*  /testimonials */}

            <div className="page-footer">
                {/*  Buttons */}
                <div className="resume-buttons">
                {/*  Download CV button */}
                <a href="/assets/cv.pdf" rel="noopener noreferrer" target="_blank" className="btn btn-default btn-default2 margin-right"><i className="fa fa-download"></i>&nbsp; Download my resume</a>
                {/*  /Download CV button */}
                {/*  Get in Touch button */}
                <a href="/contact" className="btn btn-default btn-default2 link-page"><i className="fa fa-download"></i>&nbsp;  Get in Touch</a>
                {/*  /Get in Touch button */}
                </div>
                {/*  /Buttons */}
                {/*  Quote */}
                <p className="footer-quote">"Whether you think you can or you think you can't, you're right"<br /><i>Henry Ford</i></p>
                {/*  /Quote */}
            </div>
        </div>
        );
    }
}
