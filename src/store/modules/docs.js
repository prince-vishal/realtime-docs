import Api from './../../Api'
import utility from './../../utilities';
import {loadProgressBar} from 'axios-progress-bar'

const docsEndPoint = "/api/v1/docs";

const axios = Api();
loadProgressBar({}, axios);

axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
axios.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('token');
        if (token) config.headers.Authorization = `${token}`;
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const state = {
    viewers: new Map(),
    ownedDocs: [],
    recentlyViewedDocs: [],
    token: localStorage.getItem('token') || '',
    user: localStorage.getItem('user') || "",
    showViewers: false,
    showShareDialog: false,
    isAuthorized: false,
    currentDoc: {},
    currentViewers: new Map(),
    reRenderKey: utility.makeid(6),
    users: []
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

        if (Object.prototype.hasOwnProperty.call(data, 'doc'))
            state.ownedDocs.push(data.doc);

        if (Object.prototype.hasOwnProperty.call(data, 'isAuthorized'))
            state.isAuthorized = data.isAuthorized;

        if (Object.prototype.hasOwnProperty.call(data, 'recentlyViewedDocs'))
            state.recentlyViewedDocs = data.recentlyViewedDocs;

        if (Object.prototype.hasOwnProperty.call(data, 'currentDoc'))
            state.currentDoc = data.currentDoc;

        if (Object.prototype.hasOwnProperty.call(data, 'users'))
            state.users = data.users;

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
    * Show Share modal
    * */
    show_share_dialog(state) {
        state.showShareDialog = true;
    },

    /*
    * Hide Share modal
    * */
    hide_share_dialog(state) {
        state.showShareDialog = false;
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
    checkIfAuthenticated({rootGetters}) {
        return new Promise((resolve, reject) => {
            if (!rootGetters['auth/isLoggedIn']) {
                reject("Unauthenticated");
            } else {
                axios.defaults.headers.common['Authorization'] = localStorage.getItem('token');
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
    * Fetch a list of docs created by this user
    *
    * */
    fetchOwnedDocs({dispatch, commit}) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint, method: 'GET'})
                        .then(resp => {
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
    * Fetch viewed docs for current user
    * */
    fetchViewedDocs({dispatch, commit}) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/viewed', method: 'GET'})
                        .then(resp => {
                            commit('docs_success', {"recentlyViewedDocs": resp.data.data});
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
    /*
    * Fetch doc details
    * */
    checkIsAuthorized({dispatch, commit}, docData) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/' + docData.id + '/is_authorized', method: 'GET'})
                        .then(resp => {
                            commit('docs_success', {"isAuthorized": true});
                            resolve(resp.data)
                        })
                        .catch(err => {
                            commit('docs_success', {"isAuthorized": false});
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
    * Share this doc with users
    * */
    shareDoc({dispatch, commit}, docData) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            let data ={};
            data['accessRole'] = "edit";
            data['sharingTo'] = docData['sharing_to'];
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint + '/' + docData.id + '/share', data: data, method: 'PUT'})
                        .then(resp => {
                            commit('docs_success', {"shared": true});
                            resolve(resp.data)
                        })
                        .catch(err => {
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
    * Share this doc with users
    * */
    fetchUsers({dispatch, commit}) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: '/api/v1/users', method: 'GET'})
                        .then(resp => {
                            commit('docs_success', {"users": resp.data.data});
                            resolve(resp.data)
                        })
                        .catch(err => {
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


    create({dispatch, commit}, docData) {
        return new Promise((resolve, reject) => {
            commit('docs_request');
            dispatch('checkIfAuthenticated')
                .then(() => {
                    axios({url: docsEndPoint, data: docData, method: 'POST'})
                        .then(resp => {
                            commit('docs_success', {"doc": resp.data.data});
                            resolve(resp.data)
                        })
                        .catch(err => {
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
    recentlyViewedDocs: state => state.recentlyViewedDocs,
    viewers: state => state.viewers,
    showViewers: state => state.showViewers,
    currentViewers: state => state.currentViewers,
    currentDoc: state => state.currentDoc,
    reRenderKey: state => state.reRenderKey,
    isAuthorized: state => state.isAuthorized,
    showShareDialog: state => state.showShareDialog,
    users: state => state.users,

};


export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
