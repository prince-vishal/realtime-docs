<template>

    <div class="container ">
        <div class="row">
            <div class="col-6 bg-white card mt-2 mx-auto px-0">
                <div class="card-header mx-0 px-0">
                    <h3 class="card-title mx-auto text-center">Login</h3>
                </div>
                <div class="card-body container">
                    <div class="row">
                        <div class="col-10 mx-auto">
                            <form @submit.prevent="login">
                                <div class="alert alert-danger" v-show="error.length > 0">{{error}}</div>
                                <div class="form-group">
                                    <label for="email" class="bmd-label-floating">Email address</label>
                                    <input id="email" class="form-control" required v-model="email" type="email">
                                </div>
                                <div class="form-group">
                                    <label for="password" class="bmd-label-floating">Password</label>
                                    <input type="password" class="form-control" id="password" required
                                           v-model="password">
                                </div>
                                <button type="submit" class="btn btn-raised btn-primary">Login</button>
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
                email: "",
                password: "",
                error: ""
            };
        },
        watch: {

            email() {
                this.error = "";
            },
            password() {
                this.error = "";
            }


        },
        methods: {
            login: function () {
                let email = this.email;
                let password = this.password;
                this.$store
                    .dispatch("auth/login", {email, password})
                    .then(() => {
                        this.$router.push({ name: 'doc', params: { id: '1' } });
                        console.log("Logged In");

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
