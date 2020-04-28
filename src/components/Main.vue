<template>
    <div class="container">
        <div class="bg-white doc-container"></div>
        <transition name="fade" :duration="200">
            <div class="current-viewers-dialog " tabindex="-1" role="dialog" v-if="showViewers">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header border-bottom">
                            <h5 class="modal-title mb-3">Viewers</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                                    @click="hideViewers">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body px-0 mx-0 pt-2">

                            <div class=" modal-user-details border-bottom " aria-labelledby="" v-for="user in viewers"
                                 :key="user.email">
                                <div class="row mx-0 py-2">
                                    <div class="col-2 col-offset-1">
                                        <img
                                                :src="'https://ui-avatars.com/api/?name='+user.name.replace(/ /g,'+')+'&size=50'"
                                                alt="" class="rounded-circle user-img-thumb">
                                    </div>
                                    <div class="col-9">
                                        <span class="user-name d-block">{{user.name}}</span>
                                        <a :href="'mailto:'+user.email" class="user-email">{{user.email}}</a>
                                        <span class="d-block text-muted">{{ timeSinceNow(user.pivot.updated_at)
                                            }}</span>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </transition>

        <transition name="fade" :duration="200">
            <div class="share-dialog " tabindex="-1" role="dialog" v-if="showShareDialog">
                <div class="modal-dialog" role="document">
                    <div class="modal-content">
                        <div class="modal-header border-bottom">
                            <h5 class="modal-title mb-3">Share Doc</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close"
                                    @click="hideShareDialog">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body px-0 mx-0 pt-2">
                            <div class="alert alert-success mx-2" v-if="shared">
                                <p class="text-center my-auto">This document has been successfully shared</p>
                            </div>
                            <div class="alert alert-danger mx-2" v-if="error">
                                <p class="text-center my-auto">{{message || 'Something went wrong'}}</p>
                            </div>
                            <div class="row mx-0 px-0">
                                <div class="col-8 mx-auto">
                                    <div class="form-group">
                                        <label for="selectEmails" class="bmd-label-floating">Add Users to Share</label>
                                        <multiselect id="selectEmails" v-model="values" tag-placeholder="Select a user"
                                                     placeholder="Search by email" :option-height="20"
                                                     :custom-label="customLabel" track-by="email"
                                                     :options="userOptions" :multiple="true" :taggable="true"
                                                     @tag="addEmail">

                                        </multiselect>
                                    </div>

                                </div>
                            </div>

                        </div>
                        <div class="modal-footer px-5 pb-3">
                            <button :disabled="!active" class="btn btn-raised btn-primary btn-block"
                                    @click="shareDocWithEmails">Share
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<style>
    .current-viewers-dialog, .share-dialog {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 1050;
        outline: 0;
    }

    .current-viewers-dialog .modal-body {
        overflow-y: auto;
        max-height: 80vh;
    }

    .share-dialog .modal-body {
        overflow-y: auto;
        height: 50vh;
    }

    .doc-container {
        height: 85vh;
    }

    .modal-user-details:last-child {
        border: none !important;
    }

    .fade-enter-active, .fade-leave-active {
        transition: opacity .5s;
    }

    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>


<script>
    import utility from '../utilities';
    import Multiselect from 'vue-multiselect'

    export default {
        name: 'Main',
        props: ['doc_id'],
        components: {
            Multiselect
        },
        data: () => ({
            menuVisible: false,
            currentViewers: [1, 2, 3, 4, 5, 6],
            showDetails: false,
            values: [],
            active: true,
            shared: false,
            error: false,
            message: false

        }),
        watch: {

            values() {
                this.error = false;
                this.message = "";
            }

        },
        computed: {
            showViewers() {
                return this.$store.getters['docs/showViewers'];
            },
            userOptions() {
                return this.$store.getters['docs/users'];
            },
            showShareDialog() {
                return this.$store.getters['docs/showShareDialog'];
            },
            currentDoc() {
                return this.$store.getters['docs/currentDoc'];
            },
            viewers() {
                return [...this.$store.getters['docs/viewers'].values()];
            },


        },
        methods: {
            hideViewers() {
                this.$store.commit('docs/hide_viewers');
            },
            hideShareDialog() {
                this.$store.commit('docs/hide_share_dialog');
                this.active = true;
                this.shared = false;
            },
            timeSinceNow(time) {
                return utility.timeSince(time);

            },
            addEmail(email) {
                console.log(email);
            },
            shareDocWithEmails() {
                this.active = false;
                this.error = false;
                this.shared = false;
                let emails = [];
                this.values.forEach((value) => {
                    emails.push(value.email);
                });
                this.$store.dispatch('docs/shareDoc', {"id": this.currentDoc.id, "sharingTo": emails})
                    .then(() => {
                        this.active = true;
                        this.shared = true;
                        this.values = [];

                    })
                    .catch((err) => {
                        this.active = true;
                        this.error = true;
                        this.message = err.response.data.message;
                    });

            },
            customLabel({email, name}) {
                return `${email}  ${name}`
            }
        }
    }
</script>



