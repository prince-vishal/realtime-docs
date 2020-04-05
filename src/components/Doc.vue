<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="app">
        <Layout>
            <template v-slot:header>
                <Header :doc_id="$route.params.id"></Header>
            </template>
            <template v-slot:main>
                <Main :doc_id="$route.params.id">
                </Main>
            </template>

        </Layout>
    </div>
</template>

<script>
    import Layout from './Layout.vue'
    import Header from './Header.vue'
    import Main from './Main.vue'
    import Echo from "laravel-echo";

    export default {
        name: 'Doc',
        components: {
            Layout,
            Header,
            Main
        },
        data:function() {
            return {
            }
        },

        created() {
            this.$store.dispatch('docs/fetchDocument', {id: this.$route.params.id});

            window.Echo = new Echo({
                broadcaster: 'pusher',
                key: "8cbe849dd186fe39a1b4",
                cluster: "ap2",
                encrypted: true,
                authEndpoint: this.$http.defaults.baseURL + '/broadcasting/auth',
                auth: {
                    headers: {
                        Authorization: localStorage.getItem('token'),
                        Accept: 'application/json',
                    },
                }

            });

        },
        beforeMount() {
            this.fetchViewers();
            let channel = 'presence-doc-' + this.$route.params.id;


            window.Echo.join(channel) //Should be Channel Name
                .here((users) => {
                    // console.table(users);

                    // remove current user from current viewers
                    let userData = localStorage.getItem('user') || "{}";
                    let user = JSON.parse(userData);

                    this.$store.commit('docs/current_viewers', users);
                    this.$store.commit('docs/remove_current_viewer', user);

                })
                .joining((user) => {
                    console.table(user);
                    this.$store.commit('docs/add_current_viewer', user);

                })
                .leaving((user) => {
                    console.table(user);
                    this.$store.commit('docs/remove_current_viewer', user);


                });

        },

        beforeRouteEnter(to, from, next) {
            next(vm => {
                vm.fetchViewers();
                vm.$store.dispatch('docs/fetchDocument', {id: vm.$route.params.id});

            })

        },
        watch: {
            showViewers() {
                if (this.showViewers === true) {
                    this.fetchViewers();
                }
            }

        },
        computed: {
            showViewers() {
                return this.$store.getters['docs/showViewers'];
            },


        },
        methods: {
            fetchViewers: function () {
                let doc = {id: this.$route.params.id};
                this.$store
                    .dispatch("docs/fetchViewers", doc)
                    .then(() => {
                        console.log("Fetched Viewers");

                    })
                    .catch((err) => {
                        console.log(err);
                        if (err !== undefined && !err.response.success)
                            this.error = err.response.data.error;
                    });
            }
        }
    }
</script>

<style lang="scss">

</style>

<style>
    #app {

    }
</style>
