<template>
    <div class="container">
        <div class="bg-white doc-container"></div>
        <div class="current-viewers-dialog " tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header border border-bottom-1">
                        <h5 class="modal-title">Current Viewers</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body px-0 mx-0 pt-2" v-show="true">

                        <div class=" modal-user-details border-bottom " aria-labelledby="" v-for="user in currentViewers" :key="user">
                            <div class="row mx-0 py-2">
                                <div class="col-2 col-offset-1">
                                    <img
                                            src="https://ui-avatars.com/api/?name=John+Doe&size=50"
                                            alt="" class="rounded-circle user-img-thumb">
                                </div>
                                <div class="col-9">
                                    <span class="user-name d-block">Seema Poonia</span>
                                    <a href="mailto:" class="user-email">seema@gmail.com</a>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

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
        max-height: 85vh;
    }

    .doc-container {
        height: 85vh;
    }

    .modal-user-details:last-child
    {
        border: none!important;
    }

</style>


<script>
    export default {
        name: 'Main',
        data: () => ({
            menuVisible: false,
            currentViewers: [1, 2, 3, 4, 5, 6],
            showDetails: false
        }),
        methods: {

            showUserDetails(user) {
                this.showDetails = true;
                console.log(user);
            },

            showCurrentViewers() {

            }
        }
    }
</script>



