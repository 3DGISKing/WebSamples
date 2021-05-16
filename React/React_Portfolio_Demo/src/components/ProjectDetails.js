import React, { Component } from 'react';
import  { getLastLocationPath }  from '../hoc/RouterLastLocation';
import {Helmet} from "react-helmet"
import $ from 'jquery';

export class ProjectDetails extends Component {
    state = {
        details: {__html: ''},
        images: [],
        metaData: [],
        name: ''
    };

    componentDidMount() {
        this.fetchProjects();
    }

    fetchProjects() {
        fetch('/projects.json')
        .then((response) => {
            return response.json();
        })
        .then((response) => {
            const projectName = this.props.match.params.projectName;
            const projects = response.projects;
            const project = projects.find(p => p.id === projectName);
            if(project) {
                this.setState({name: project.shortName ? project.shortName : project.name, details: {__html: project.details ? project.details : project.description}, images: project.images.img, metaData: project.metaData});
            } else {
                console.error(`Project was not found by given id ${projectName}!`);
            }
        });
    }

    routeToProjectList = () => {
        const { history } = this.props;
        if(getLastLocationPath()) {
            history.goBack();
        } else {
            history.push('/projects/1');
        }
    };



    render() {
        const { name, details, images, metaData } = this.state;
        // TODO: improve it in the next version with the react-addons-css-transition-group package
        let metaDataJsx;
        $(document).ready(function(){
            $('#page-blog-single').addClass('section-page-active');
        });
        if(metaData) {
            metaDataJsx = <Helmet>
                            <title>{metaData.title}</title>
                            <meta name="description" content={metaData.description} />
                          </Helmet>
        }
        return (
            <div className="section-vcardbody section-page section-page-single" id="page-blog-single">
                {metaDataJsx}
                <div className="blog-single-post" id="blogPost">
                    {/* post image */}
                    <div className="post-header-image">
                        <img src={images.length ? images[0].url : ''} alt=""/>
                    </div>
                    {/* /post-image */}

                    {/* post title */}
                    <h2 className="blog-single-title title-border">{name}</h2>
                    {/* /post title */}

                    {/* post content */}
                    <div className="blog-single-content">
                        <p dangerouslySetInnerHTML={details}></p>
                        <button className="btn btn-default btn-back-to-projects" onClick={this.routeToProjectList}><i className="fa fa-arrow-left"></i>&nbsp; Back to projects</button>
                    </div>
                    {/* /post content */}
                </div>
            </div>
        )
    }
}
