import axios from 'axios'

const authEndPoint = "/auth/v1";
axios.defaults.headers.common['Accept'] = 'application/json';// for all requests

const state = {
    status: '',
    token: localStorage.getItem('token') || '',
    user: {}
};
const mutations = {
    auth_request(state) {
        state.status = 'loading'
    },
    auth_success(state, data) {
        state.status = 'success';
        state.token = data.token;
        state.user = data.user
    },
    auth_error(state) {
        state.status = 'error'
    },
    logout(state) {
        state.status = '';
        state.token = ''
    },
};

const actions = {
    /*
    * Register an user, save token and user to localstorage
    * */
    register({commit}, user) {
        return new Promise((resolve, reject) => {
            commit('auth_request');
            axios({url: authEndPoint + '/register', data: user, method: 'POST'})
                .then(resp => {
                    const token = 'Bearer' + ' ' + resp.data.access_token;
                    localStorage.setItem('token', token);
                    // Add the following line:
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('auth_success', {'token': token, 'user': resp.data.user});
                    localStorage.setItem('user', JSON.stringify(resp.data.user));
                    resolve(resp)
                })
                .catch(err => {
                    commit('auth_error', err);
                    localStorage.removeItem('token');
                    reject(err)
                });
        });
    },
    /*
    * Login an user, save token and user in localstorage
    * */
    login({commit}, userData) {
        return new Promise((resolve, reject) => {
            commit('auth_request');
            axios({url: authEndPoint + '/login', data: userData, method: 'POST'})
                .then(resp => {
                    const token = 'Bearer' + ' ' + resp.data.access_token;
                    localStorage.setItem('token', token);
                    axios.defaults.headers.common['Authorization'] = token;
                    commit('auth_success', {'token': token, 'user': resp.data.user});
                    localStorage.setItem('user', JSON.stringify(resp.data.user));

                    resolve()
                })
                .catch(err => {
                    commit('auth_error');
                    localStorage.removeItem('token');
                    reject(err)
                });
        });
    },
    /*
    * Logout an user by removing token and user from localstorage
    * */
    logout: {
        root: true,
        handler({commit}) {
            return new Promise((resolve) => {
                commit('logout');
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                delete axios.defaults.headers.common['Authorization'];
                resolve()
            })
        }
    }
};
const getters = {
    isLoggedIn: state => !!state.token,
    authStatus: state => state.status,
};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
