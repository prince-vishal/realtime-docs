<template>
    <nav class="navbar navbar-expand-lg navbar-light bb-0 bg-white px-3">
        <router-link class="navbar-brand" to="/">Postman Docs</router-link>
        <div class="ml-auto" style="display: inline-flex">
            <div id="docs-presence-container" class="presence-inline-block docs-titlebar-button d-flex">
                <div id="docs-presence" class="presence-inline-block mr-auto"
                     v-show="current_viewers && current_viewers.length > 0" :key="reRenderKey">
                    <div class="docs-presence-plus-widget presence-inline-block" style="max-width: 170px;">
                        <div class="docs-presence-plus-widget-inner presence-inline-block"
                             @mouseover="showUserDetails(user)" @mouseleave="hideUserDetails"
                             v-for="(user,index) in current_viewers.slice(0,4)" :key="user.email"
                             :style="index === 0 ? '': 'left:'+(-10*index)+'px'">
                            <img
                                    :src="'https://ui-avatars.com/api/?name='+user.name.replace(/ /g,'+')+'&size=50'"
                                    alt="" class="rounded-circle mw-100 mh-100 user-img-thumb">
                        </div>
                        <div class="docs-presence-plus-widget-inner presence-inline-block"
                             v-if="current_viewers.length > 4" :style="'left:'+(-10*4)+'px'"
                             :title="'and '+ (current_viewers.length - 4) + ' more members'">
                            <div class="rounded-circle mw-100 mh-100 extra-user" @click="showViewers">

                                <span>+{{ current_viewers.length - 4 }}</span>

                            </div>
                        </div>

                    </div>
                    <div class=" user-details" aria-labelledby="" v-show="showDetails">
                        <div class="row mx-0 px-2 py-4">
                            <div class="col-3">
                                <img
                                        src="https://ui-avatars.com/api/?name=John+Doe&size=50"
                                        alt="" class="rounded-circle user-img-thumb">
                            </div>
                            <div class="col-9">
                                <span class="user-name d-block">{{currentDetails.name}}</span>
                                <a href="mailto:" class="user-email">{{currentDetails.email}}</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="d-inline view-history-btn" v-if="viewers.length>0" @click="showViewers"
                     title="View all viewers">
                    <i class="rounded-circle mw-100 mh-100 fa fa-line-chart"></i>
                </div>
            </div>
            <button type="button" class="share-btn"><i class="fa fa-user mr-1"></i> Share</button>
        </div>

    </nav>


</template>

<style lang="scss" scoped>
    .share-btn {
        box-shadow: none;
        box-sizing: border-box;
        font-family: "Google Sans", Roboto, RobotoDraft, Helvetica, Arial, sans-serif;
        font-weight: 500;
        font-size: 14px;
        height: 36px;
        letter-spacing: 0.25px;
        line-height: 16px;
        color: rgb(255, 255, 255);
        text-transform: capitalize;
        border-radius: 4px;
        background: rgb(26, 115, 232);
        padding: 9px 16px 10px 12px;
        border-width: 1px !important;
        border-style: solid !important;
        border-color: transparent !important;
        border-image: initial !important;
    }

    #docs-presence {
        vertical-align: bottom;
    }

    .presence-inline-block {
        position: relative;
        display: inline-block;
        height: 100%;
    }

    .docs-material #docs-presence-container {
        display: flex;
        align-items: center;
        height: 36px;
        margin: 0px 8px 0px 0px;
    }

    #docs-presence-container {
        height: 2rem;
        margin-right: 10px;
        vertical-align: middle;
    }

    .docs-material .docs-titlebar-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }

    .docs-material .docs-presence-plus-widget {
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    .docs-presence-plus-widget {
        max-width: 250px;
        text-align: left;
        outline: 0px;
    }

    .docs-presence-plus-widget-inner {
        vertical-align: top;
    }

    .docs-presence-plus-widget-status {
        color: rgb(34, 34, 34);
        display: none;
        text-align: right;
        margin: 8px 10px 0px 0px;
    }

    .docs-material .docs-presence-plus-widget-collabs {
        height: 36px;
    }

    .docs-material .docs-presence-plus-collab-widget-container {
        height: auto;
        width: auto;
        margin: 0px 0px 0px -8px;
        overflow: visible;
    }


    .docs-presence-plus-collab-widget-image-border {
        height: 24px;
        border-bottom: 1px solid rgb(255, 255, 255);
    }

    .view-history-btn {
        background: white;
        height: 100%;
        border-radius: 50%;
        padding: 0.5rem;
        vertical-align: bottom;
        cursor: pointer;
    }

    .view-history-btn:hover {
        background: #ccc;
    }

    /*
        .docs-presence-plus-widget .docs-presence-plus-widget-inner:not(:first-child) {
            left: -15px;
        }*/

    .user-img-thumb {
        border: 2px solid indianred;
        cursor: pointer;
    }

    .user-img-thumb:hover {
        border: 2px solid #fa6a6a;
        -webkit-box-shadow: -4px 6px 8px -5px #917F5E;
        -moz-box-shadow: -4px 6px 8px -5px #917F5E;
        box-shadow: -4px 6px 8px -5px #917F5E;
    }

    .user-details {
        background-color: #fff;
        border-radius: 4px;
        box-shadow: 0 1px 2px 0 rgba(60, 64, 67, .3), 0 2px 6px 2px rgba(60, 64, 67, .15);
        opacity: 1;
        position: absolute;
        width: 340px;
        z-index: 2201;
        left: -212px;
        margin-top: 0.5rem;
    }

    .user-name {
        font-size: 18px;
        line-height: 24px;
    }

    .user-email {
        color: #3c4043;
        cursor: pointer;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

    }

    .extra-user {
        background: lightgrey;
        color: darkgray;
        width: 32px;
        height: 32px;
        text-align: center;
        display: flex;
        align-items: center;
        cursor: pointer;

    }

    .extra-user span {
        margin: auto;
    }

    .current-viewers-dialog {
        max-width: 50vh;
        overflow-y: auto;
    }


</style>

<script>
    export default {
        name: 'Header',
        props: ['doc_id'],
        watch: {

            reRenderKey() {
                this.current_viewers = Array.from(this.$store.getters['docs/currentViewers'].values());
            }

        },
        computed: {

            reRenderKey() {
                return this.$store.getters['docs/reRenderKey'];
            },
            viewers() {
                return [...this.$store.getters['docs/viewers'].values()];
            },

            user() {
                let userData = localStorage.getItem("user");
                if (userData !== undefined && userData !== null) {
                    return userData;
                } else {
                    return false;

                }
            }
        },

        data: () => ({
            menuVisible: false,
            showDetails: false,
            currentDetails: {},
            current_viewers: []
        }),
        methods: {

            showUserDetails(user) {
                this.currentDetails = user;
                this.showDetails = true;
            },

            showViewers() {
                this.$store.commit('docs/show_viewers');
            },
            hideUserDetails() {
                this.showDetails = false;
                this.currentDetails = {};
            }
        }
    }
</script>
