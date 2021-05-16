import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom';
import ProjectItem from './ProjectItem';
import $ from 'jquery';

export class ProjectList extends PureComponent {
    state = {
      projects: [],
      projectsToDisplay: [],
      pageNumbers: [],
      projectPerPage: 5
    };

    componentDidUpdate(prevProps) {
      const currentPage = this.props.match.params.page;
      const prevPage = prevProps.match.params.page;
      const allProjects = this.state.projects;
      if(currentPage !== prevPage) {
        this.setState({ projectsToDisplay: this.getProjectsToDisplay(currentPage, allProjects)} );
        console.log('window.innerWidth=',window.innerWidth);
        if(window.innerWidth >= 992) {
          $('#page-projects').animate({
            scrollTop: 0
          }, 500, () => $(this).remove());
        } else {
          $('html, body').animate({
            scrollTop: $('#page-projects').offset().top
          },500, () => $(this).remove());  
        }
      }
    }

    componentDidMount() {
      this.fetchProjects();
    }

    fetchProjects() {
      fetch('/projects.json')
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        const projects = response.projects;
        const currentPage = this.props.match.params.page;
        const projectPerPage = this.state.projectPerPage;
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(projects.length / projectPerPage); i++) {
          pageNumbers.push(i);
        }
        this.setState({ pageNumbers: pageNumbers, 
                        projects: projects, 
                        projectsToDisplay: this.getProjectsToDisplay(currentPage, projects) });
      });
    }

    getProjectsToDisplay(currentPage, allProjects) {
      const projectPerPage = this.state.projectPerPage;
      const indexOfLastProject = currentPage * projectPerPage;
      const indexOfFirstProject = indexOfLastProject - projectPerPage;
      return allProjects.slice(indexOfFirstProject, indexOfLastProject);
    }

    render() {
        const { projectsToDisplay, pageNumbers } = this.state;
        const currentPage = this.props.match.params.page;
        return (
            <div className="section-vcardbody section-page" id="page-projects">
            <div className="section-blog">
              {/*  Section title */}
                    <h2 className="section-title">Projects</h2>
              {/*  /Section title */}

              {/*  BLOG POSTS */}
              <div className="blog-posts">
                {projectsToDisplay.map(p => <ProjectItem key={p.name} id={p.id} name={p.name} description={p.description} images={p.images.img}></ProjectItem>)}
              </div>
              {/*  /BLOG POSTS */}
              {/*  Pagination */}
              <div className="section-pagination">
                <div className="row">
                  <div className="col-xs-12">
                    <span className="pagination-numbers">
                      {pageNumbers.map(pageNo => <Link className={parseInt(currentPage) === pageNo ? 'pageActive margin-right' : 'margin-right'} key={['page',pageNo].join('-')} to={{ pathname: '/projects/' + pageNo }}>{pageNo}</Link>)}
                    </span>
                  </div>
                </div>
              </div>
              {/*  /Pagination */}
            </div>
          </div>
        );
    }
}