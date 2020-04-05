<template>

    <div class="container">
        <div class="row px-0">
            <div class="col-11 mx-auto mt-2 px-0">

                <div class="row px-0 mx-0">
                    <div class="card px-3 py-5 col-md-2 col-sm-6 mb-1 doc-card doc-create-card mr-2">

                        <span class="mx-auto my-auto text-dark">Create Doc</span>
                        <span class="fa fa-plus fa-2x mx-auto my-auto"></span>
                    </div>
                    <div class="card col-md-2 col-sm-6 doc-card mr-1 mb-1" v-for="doc in ownedDocs" :key="doc.id">

                        <router-link :to="'/doc/'+ doc.id" tag="div" class="card-body d-flex">
                            <p class="mx-auto my-auto">{{doc.title}}</p>

                        </router-link>
                    </div>
                </div>

                <hr>

                <div class="row mt-2 mb-2 mx-0 px-0">
                    <h5 class="">Recently Viewed</h5>
                </div>

                <div class="row px-0 mx-0 mt-3">

                    <div class="card col-md-2 col-sm-6 doc-card mr-1 mb-1" v-for="doc in viewedDocs"
                         :key="'viewed'+doc.id">

                        <router-link :to="'/doc/'+ doc.id" tag="div" class="card-body d-flex">
                            <p class="mx-auto my-auto">{{doc.title}}</p>

                        </router-link>
                    </div>
                </div>


                <div class="mt-2" v-if="ownedDocs.length<=0">
                    <div class="card-header">
                        <h6> You have not created any document yet</h6>
                    </div>
                </div>


            </div>
        </div>


    </div>
</template>

<style scoped>
    .doc-card {
        height: 200px;
        cursor: pointer;
    }

    .doc-create-card {
        opacity: 0.9;
    }
</style>
<script>
    export default {
        name: 'Docs',
        data() {
            return {
                email: "",
                password: "",
                error: ""
            };
        },
        beforeMount() {
            this.fetchOwnedDocs();
            this.fetchViewedDocs();
        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.fetchOwnedDocs();
                vm.fetchViewedDocs();
            })

        },
        watch: {},
        computed: {

            ownedDocs() {
                return this.$store.getters['docs/ownedDocs'] || [];
            },
            viewedDocs() {
                return this.$store.getters['docs/recentlyViewedDocs'] || [];
            }

        },
        methods: {
            fetchOwnedDocs: function () {
                this.$store
                    .dispatch("docs/fetchOwnedDocs")
                    .then(() => {
                        console.log("Fetched Owned Docs");

                    })
                    .catch((err) => {
                        console.log(err);
                        if (err != undefined && !err.response.success)
                            this.error = err.response.data.error;
                    });
            },
            fetchViewedDocs: function () {
                this.$store
                    .dispatch("docs/fetchViewedDocs")
                    .then(() => {
                        console.log("Fetched Viewed Docs");

                    })
                    .catch((err) => {
                        console.log(err);
                        if (err != undefined && !err.response.success)
                            this.error = err.response.data.error;
                    });
            }
        }
    };
</script>
