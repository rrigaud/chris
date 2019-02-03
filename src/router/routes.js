// Accueil
import Home_Layout from 'layouts/Home'
import Home_Page from 'pages/Home'
// LAYOUT principal de l'application
import Main_Layout from 'layouts/Main'
// PAGES : Gestion des coureurs, des courses,...
import Management_Sidebar_Page from 'pages/Management_Sidebar'
import Management_Home_Page from 'pages/Management_Home'
import Management_Runners_Page from 'pages/Management_Runners'
import Management_Races_Page from 'pages/Management_Races'
import Management_Options_Page from 'pages/Management_Options'
import Management_Admin_Page from 'pages/Management_Admin'
// PAGES : Saisie des arrivées de chaque course
import Races_Sidebar_Page from 'pages/Races_Sidebar'
import Races_Home_Page from 'pages/Races_Home'
import Races_Race_Page from 'pages/Races_Race'

const routes = [
  {
    path: '/',
    component: Home_Layout,
    children: [
      {
        path: '',
        component: Home_Page
      }
    ]
  },
  {
    path: '/cross/:cross_id/management',
    component: Main_Layout,
    children: [
      {
        path: '',
        components: {
          default: Management_Home_Page,
          sidebar: Management_Sidebar_Page
        }
      },
      {
        path: 'runners',
        components: {
          default: Management_Runners_Page,
          sidebar: Management_Sidebar_Page
        }
      },
      {
        path: 'races',
        components: {
          default: Management_Races_Page,
          sidebar: Management_Sidebar_Page
        }
      },
      {
        path: 'options',
        components: {
          default: Management_Options_Page,
          sidebar: Management_Sidebar_Page
        }
      },
      {
        path: 'admin',
        components: {
          default: Management_Admin_Page,
          sidebar: Management_Sidebar_Page
        }
      }
    ]
  },
  {
    path: '/cross/:cross_id/races',
    component: Main_Layout,
    children: [
      {
        path: '',
        components: {
          default: Races_Home_Page,
          sidebar: Races_Sidebar_Page
        }
      },
      {
        path: 'race/:race_id',
        components: {
          default: Races_Race_Page,
          sidebar: Races_Sidebar_Page
        }
      }
    ]
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
