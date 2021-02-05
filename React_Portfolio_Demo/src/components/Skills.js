import React, { Component } from 'react';

export class Skills extends Component {
    render() {
        return (
        <div className="section-vcardbody section-page" id="page-skills">
            <div className="section-skills">

              {/*  Section title */}
                <h2 className="section-title">SKILLS</h2>
                {/*  /Section title */}


                {/*  Subtitle */}
                <h3 className="section-item-title-2"><i className="fa fa-users"></i>&nbsp;&nbsp; Techniques</h3>
                {/*  /Subtitle */}

              {/*  Skils List */}
              <ul className="skills-list">
                  {/*  item-list */}
                  <li>
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" data-percent="85%" style={{"width":"85%"}}>
                          <span className="sr-only">85% Complete</span>
                      </div>
                      <span className="progress-type">Object Oriented Programming</span>
                      <span className="progress-completed">85%</span>
                    </div>
                  </li>
                  {/*  /item list */}
                  {/*  item-list */}
                  <li>
                    <div className="progress">
                      <div className="progress-bar progress-bar-2" role="progressbar" data-percent="80%" style={{"width":"80%"}}>
                          <span className="sr-only">80% Complete</span>
                      </div>
                      <span className="progress-type">Functional Programming</span>
                      <span className="progress-completed">80%</span>
                    </div>
                  </li>
                  {/*  /item list */}
                  {/*  item-list */}
                  <li>
                    <div className="progress">
                      <div className="progress-bar progress-bar-3" role="progressbar" data-percent="75%" style={{"width":"75%"}}>
                          <span className="sr-only">75% Complete</span>
                      </div>
                      <span className="progress-type">Agile Software Development</span>
                      <span className="progress-completed">75%</span>
                    </div>
                  </li>
                  {/*  /item list */}
                  {/*  item-list */}
                  <li>
                    <div className="progress">
                      <div className="progress-bar" role="progressbar" data-percent="75%" style={{"width":"75%"}}>
                          <span className="sr-only">75% Complete</span>
                      </div>
                      <span className="progress-type">Responsive Web Design</span>
                      <span className="progress-completed">75%</span>
                    </div>
                  </li>
                  {/*  /item list */}
                  {/*  item-list */}
                  <li>
                    <div className="progress">
                      <div className="progress-bar progress-bar-2" role="progressbar" data-percent="70%" style={{"width":"70%"}}>
                          <span className="sr-only">70% Complete</span>
                      </div>
                      <span className="progress-type">Design Patterns</span>
                      <span className="progress-completed">70%</span>
                    </div>
                  </li>
                  {/*  /item list */}
              </ul>
              {/*  /Skils List */}

              {/*  Subtitle */}
              <h3 className="section-item-title-2"><i className="fa fa-laptop"></i>&nbsp;&nbsp; Frameworks</h3>
              {/*  /Subtitle */}

              {/*  Skils List */}
              <ul className="skills-list">
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar" data-percent="85%" role="progressbar" style={{"width":"85%"}}>
                        <span className="sr-only">85% Complete</span>
                    </div>
                    <span className="progress-type">React & Redux</span>
                    <span className="progress-completed">85%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-2" data-percent="85%" role="progressbar" style={{"width":"85%"}}>
                        <span className="sr-only">85% Complete</span>
                    </div>
                    <span className="progress-type">AngularJS</span>
                    <span className="progress-completed">85%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-3" data-percent="70%" role="progressbar" style={{"width":"70%"}}>
                        <span className="sr-only">70% Complete</span>
                    </div>
                    <span className="progress-type">Vue.js</span>
                    <span className="progress-completed">70%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-1" data-percent="65%" role="progressbar" style={{"width":"65%"}}>
                        <span className="sr-only">65% Complete</span>
                    </div>
                    <span className="progress-type">Spring Framework</span>
                    <span className="progress-completed">65%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-2" data-percent="65%" role="progressbar" style={{"width":"65%"}}>
                        <span className="sr-only">65% Complete</span>
                    </div>
                    <span className="progress-type">Jasmine / Jest / Spock / JUnit</span>
                    <span className="progress-completed">65%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-3" data-percent="60%" role="progressbar" style={{"width":"60%"}}>
                        <span className="sr-only">60% Complete</span>
                    </div>
                    <span className="progress-type">MeteorJS</span>
                    <span className="progress-completed">60%</span>
                  </div>
                </li>
                {/*  /item list */}
              </ul>
              {/*  /Skils List */}

              {/*  Subtitle */}
              <h3 className="section-item-title-2"><i className="fa fa-code"></i>&nbsp;&nbsp; Languages</h3>
              {/*  /Subtitle */}

              {/*  Skils List */}
              <ul className="skills-list">
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar" data-percent="85%" role="progressbar" style={{"width":"85%"}}>
                      <span className="sr-only">85% Complete</span>
                    </div>
                    <span className="progress-type">Javascript</span>
                    <span className="progress-completed">85%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-2" data-percent="75%" role="progressbar" style={{"width":"75%"}}>
                      <span className="sr-only">75% Complete</span>
                    </div>
                    <span className="progress-type">Typescript</span>
                    <span className="progress-completed">75%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-3" data-percent="70%" role="progressbar" style={{"width":"70%"}}>
                      <span className="sr-only">70% Complete</span>
                    </div>
                    <span className="progress-type">Java</span>
                    <span className="progress-completed">70%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-1" data-percent="65%" role="progressbar" style={{"width":"65%"}}>
                      <span className="sr-only">65% Complete</span>
                    </div>
                    <span className="progress-type">Groovy</span>
                    <span className="progress-completed">65%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-2" data-percent="65%" role="progressbar" style={{"width":"65%"}}>
                      <span className="sr-only">65% Complete</span>
                    </div>
                    <span className="progress-type">PHP</span>
                    <span className="progress-completed">65%</span>
                  </div>
                </li>
                {/*  /item list */}
                {/*  item-list */}
                <li>
                  <div className="progress">
                    <div className="progress-bar progress-bar-3" data-percent="60%" role="progressbar" style={{"width":"60%"}}>
                      <span className="sr-only">60% Complete</span>
                    </div>
                    <span className="progress-type">SQL</span>
                    <span className="progress-completed">60%</span>
                  </div>
                </li>
                {/*  /item list */}
              </ul>
              {/*  /Skils List */}

            </div>
        </div>);
    }
}