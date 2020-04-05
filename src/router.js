import Vue from 'vue'
import Router from 'vue-router'
import store from './store'
import Login from './components/auth/Login.vue'
import Register from './components/auth/Register.vue'
import Doc from './components/Doc.vue'
import Docs from './components/Docs.vue'

Vue.use(Router);

let router = new Router({
    base:'/realtime-docs/',
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'home',
            component: Docs,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/login',
            name: 'login',
            component: Login
        },
        {
            path: '/register',
            name: 'register',
            component: Register
        },
        {
            path: '/docs',
            name: 'docs',
            component: Docs,
            meta: {
                requiresAuth: true
            }
        },
        {
            path: '/doc/:id',
            name: 'doc',
            component: Doc,
            meta: {
                requiresAuth: true
            }
        },
    ]
});

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters['auth/isLoggedIn']) {
            next();
            return;
        }
        next('/login')
    } else {
        next()
    }
});


export default router
