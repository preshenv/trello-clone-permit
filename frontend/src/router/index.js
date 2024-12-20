import { createRouter, createWebHistory } from 'vue-router'
import BoardsList from '../components/BoardsList.vue'
import Board from '../components/Board.vue'
import LoginView from '../views/LoginView.vue'
const routes = [
    {
        path: '/',
        name: 'LoginView',
        component: LoginView
    },
    {
        path: '/boards',
        name: 'boards',
        component: BoardsList
    },
    {
        path: '/board/:id',
        name: 'board',
        component: Board,
        props: true
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/LoginView.vue')
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: () => import('@/views/NotFoundView.vue')
    }
]

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
})

export default router