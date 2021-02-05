import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';

class ProjectItem extends Component {

    gotoProject = () => {
        const { history, id } = this.props;
        history.push(`/project/${id}`);
    };

    render() {
        const { id, name, description, images } = this.props;
        const imgSrc = images[0];
        return (
            <div className="blog-item">
                <div className="blog-item-wrapper">
                {/*  blog item thumbnail */}
                <div className="blog-item-thumb">
                    <img src={imgSrc.url} alt="" onClick={this.gotoProject}/>
                </div>
                {/*  /blog item thumbnail */}
                {/*  Blog item - infos */}
                <div className="blog-item-infos">
                    {/*  blog-item-title */}
                    <div className="blog-item-title-wrapper">
                        <h2 className="blog-item-title title-border">
                            <Link to={{ pathname: `/project/${id}`}}>{name}</Link>
                        </h2>
                    </div>
                    {/*  /blog-item-title */}
                    {/*  blog item - description */}
                    <div className="blog-item-description">
                        <p onClick={this.gotoProject}>{description}</p>
                    </div>
                    {/*  /blog-item-description */}
                    {/*  blog item - link */}
                    <div className="blog-item-link">
                        <button className="btn btn-default" onClick={this.gotoProject}>See More</button>
                    </div>
                    {/*  /blog item - link */}
                </div>
                {/*  /blog item - infos */}
                </div>
            </div>
        )
    }
}

export default withRouter(ProjectItem);