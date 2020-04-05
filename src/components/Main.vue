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
    </div>
</template>

<style>
    .current-viewers-dialog {
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

    export default {
        name: 'Main',
        props: ['doc_id'],

        data: () => ({
            menuVisible: false,
            currentViewers: [1, 2, 3, 4, 5, 6],
            showDetails: false,
        }),
        computed: {
            showViewers() {
                return this.$store.getters['docs/showViewers'];
            },
            viewers() {
                return [...this.$store.getters['docs/viewers'].values()];
            },


        },
        methods: {
            hideViewers() {
                this.$store.commit('docs/hide_viewers');
            },
            timeSinceNow(time) {
                return utility.timeSince(time);

            }
        }
    }
</script>



