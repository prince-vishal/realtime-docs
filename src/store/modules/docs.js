import axios from 'axios'
import utility from './../../utilities';

const docsEndPoint = "/api/v1/docs";
axios.defaults.headers.common['Accept'] = 'application/json';// for all requests

const state = {
    viewers: new Map(),
    ownedDocs: [],
    recentlyViewedDocs: [],
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || "",
    showViewers: false,
    currentDoc: {},
    currentViewers: new Map(),
    reRenderKey: utility.makeid(6)
};
const mutations = {
    /*
    * Update status to loading when api calls are ongoing
    * */
    docs_request(state) {
        state.status = 'loading'
    },

    /*
    * On doc api request success, update data
    * */
    docs_success(state, data) {
        state.status = 'success';
        if (Object.prototype.hasOwnProperty.call(data, 'ownedDocs'))
            state.ownedDocs = data.ownedDocs;

        if (Object.prototype.hasOwnProperty.call(data, 'recentlyViewedDocs'))
            state.recentlyViewedDocs = data.recentlyViewedDocs;

        if (Object.prototype.hasOwnProperty.call(data, 'currentDoc'))
            state.currentDoc = data.currentDoc;

        if (Object.prototype.hasOwnProperty.call(data, 'viewers')) {
            state.viewers = new Map();
            for (let i = 0; i < data.viewers.length; i++) {
                let user = data.viewers[i];
                state.viewers.set(user.email, user);
            }
        }
    },
    docs_error(state) {
        state.status = 'error'
    },

    /*
    * show viewers modal
    * */
    show_viewers(state) {
        state.showViewers = true;
    },

    /*
    * Hide viewers modal
    * */
    hide_viewers(state) {
        state.showViewers = false;
    },



    /*
    * Create a map of current viewers
    * */
    current_viewers(state, data) {
        state.currentViewers = new Map();
        for (let i = 0; i < data.length; i++) {
            let user = data[i];
            state.currentViewers.set(user.email, user);
        }
        state.reRenderKey = utility.makeid(6);

    },

    /*
    * Add a current to currentViewers map
    * */
    add_current_viewer(state, data) {
        state.currentViewers.set(data.email, data);
        state.viewers.set(data.email, data);
        state.reRenderKey = utility.makeid(6);
    },

    /*
    * Remove a viewer from currentViewers Map
    * */
    remove_current_viewer(state, data) {
        state.currentViewers.delete(data.email);
        state.reRenderKey = utility.makeid(6);

    }
};

const actions = {

    /*
    * Check if the user is authenticated
    * */
    checkIfAuthenticated({rootGetters, state}) {
        return new Promise((resolve, reject) => {
            if (!rootGetters['auth/isLoggedIn']) {
                reject("Unauthenticated");
            } else {
                axios.defaults.headers.common['Authorization'] = state.token || localStorage.getItem('token');
                resolve()
            }
        });
    },

    /*
    * Check if user is authenticated , else Logout
    * */
    checkAndLogout({dispatch}, err) {
        if (err.response.status === undefined) {
            console.log("checkAndLogout error : ", err);
            return;
        }
        switch (err.response.status) {
            case 401:
                dispatch('logout', null, {root: true});
                break;
            default:
                console.log(err.response)
        }

    },

    /*
    * Fet a list of docs created by this user
    *
    * */
    fetchOwnedDocs({dispatch, commit}) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/', method: 'GET'})
                        .then(resp => {
                            console.log(resp.data.data);
                            commit('docs_success', {"ownedDocs": resp.data.data});
                            resolve(resp.data)
                        })
                        .catch(err => {
                            dispatch('checkAndLogout', err);
                            commit('docs_error', err);
                            reject(err)
                        });

                })
                .catch(err => {
                    commit('docs_error', err);
                    reject(err)
                });

        });
    },

    /*
    * Fetch all past viewers of this doc
    * */
    fetchViewers({dispatch, commit}, docData) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/' + docData.id + '/viewers', method: 'GET'})
                        .then(resp => {
                            console.log(resp.data.data);
                            commit('docs_success', {"viewers": resp.data.data});
                            resolve(resp.data)
                        })
                        .catch(err => {
                            dispatch('checkAndLogout', err);
                            commit('docs_error', err);
                            reject(err)
                        });

                })
                .catch(err => {
                    commit('docs_error', err);
                    reject(err)
                });

        });
    },
    /*
    * Fetch doc details
    * */
    fetchDocument({dispatch, commit}, docData) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/' + docData.id, method: 'GET'})
                        .then(resp => {
                            console.log(resp.data.data);
                            commit('docs_success', {"currentDoc": resp.data.data});
                            resolve(resp.data)
                        })
                        .catch(err => {
                            dispatch('checkAndLogout', err);
                            commit('docs_error', err);
                            reject(err)
                        });

                })
                .catch(err => {
                    commit('docs_error', err);
                    reject(err)
                });

        });
    },
};
const getters = {
    isLoggedIn: state => !!state.token,
    ownedDocs: state => state.ownedDocs,
    recentlyViewedDocs: state => state.viewedDocs,
    viewers: state => state.viewers,
    showViewers: state => state.showViewers,
    currentViewers: state => state.currentViewers,
    currentDoc: state => state.currentDoc,
    reRenderKey: state => state.reRenderKey,

};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
