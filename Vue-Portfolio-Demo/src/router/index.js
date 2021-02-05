import Vue from 'vue'
import Router from 'vue-router'

import content from './../data/content.json';
import Home from './../views/Home.vue';
import About from './../views/About.vue';
import Project1 from './../views/Project1.vue';
import Project2 from './../views/Project2.vue';
import Project3 from './../views/Project3.vue';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/about',
      name: 'about',
      component: About
    },
    {
      path: `/projects/${content.projects[0].slug}`,
      name: 'project1',
      component: Project1
    },
    {
      path: `/projects/${content.projects[1].slug}`,
      name: 'project2',
      component: Project2
    },
    {
      path: `/projects/${content.projects[2].slug}`,
      name: 'project3',
      component: Project3
    }
  ]
})
