<template>

    <div class="container ">
        <div class="row">
            <div class="col-8 bg-white card mt-2 mx-auto px-0">
                <div class="card-header mx-0 px-0">
                    <h3 class="card-title mx-auto text-center">Create Doc</h3>
                </div>
                <div class="card-body container">
                    <div class="row">
                        <div class="col-10 mx-auto">
                            <form @submit.prevent="createDoc">
                                <div class="alert alert-danger" v-show="error.length > 0">{{error}}</div>
                                <div class="form-group">
                                    <label for="title" class="bmd-label-floating">Title</label>
                                    <input id="title" class="form-control" required v-model="title" type="text">
                                </div>
                                <div class="form-group">
                                    <label for="data" class="bmd-label-floating">Data</label>
                                    <input type="text" class="form-control" id="data"
                                           v-model="data">
                                </div>
                                <button type="submit" class="btn btn-raised btn-primary">Create</button>
                            </form>
                        </div>
                    </div>

                </div>


            </div>
        </div>


    </div>
</template>
<script>
    export default {
        data() {
            return {
                title: "",
                data: "",
                error: ""
            };
        },
        watch: {

            title() {
                this.error = "";
            },
            data() {
                this.error = "";
            }


        },
        methods: {
            createDoc: function () {
                // let email = this.email;
                // let password = this.password;
                // this.$store
                //     .dispatch("auth/login", {email, password})
                //     .then(() => {
                //         this.$router.push({ name: 'doc', params: { id: '1' } });
                //         console.log("Logged In");
                //
                //     })
                //     .catch((err) => {
                //         console.log(err);
                //         if (err != undefined && !err.response.success)
                //             this.error = err.response.data.error;
                //     });
            }
        }
    };
</script>
