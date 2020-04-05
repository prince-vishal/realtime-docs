<template>
    <div class="container ">
        <div class="row">
            <div class="col-6 bg-white card mt-2 mx-auto px-0">
                <div class="card-header mx-0 px-0">
                    <h3 class="card-title mx-auto text-center">Register</h3>
                </div>
                <div class="card-body container">
                    <div class="row">
                        <div class="col-10 mx-auto">
                            <form @submit.prevent="register">
                                <div class="form-group">
                                    <label for="name" class="bmd-label-floating">Name</label>
                                    <input id="name" class="form-control" v-model="name" type="text"
                                           placeholder="Enter your name" required autofocus>
                                    <small id="nameHelp" class="form-text text-danger" v-show="error.name"
                                           v-for="err in error.name" :key="err">{{err}}
                                    </small>

                                </div>
                                <div class="form-group">
                                    <label for="company" class="bmd-label-floating">Company (optional)</label>
                                    <input id="company" class="form-control" v-model="company" type="text"
                                           placeholder="Enter company name">
                                    <small id="companyHelp" class="form-text text-danger" v-show="error.company"
                                           v-for="err in error.company" :key="err">{{err}}
                                    </small>

                                </div>
                                <div class="form-group">
                                    <label for="email" class="bmd-label-floating">Email address</label>
                                    <input id="email" class="form-control" required v-model="email" type="email"
                                           placeholder="Enter your email">
                                    <small id="emailHelp" class="form-text text-danger" v-show="error.email"
                                           v-for="err in error.email" :key="err">{{err}}
                                    </small>

                                </div>
                                <div class="form-group">
                                    <label for="password" class="bmd-label-floating">Password</label>
                                    <input class="form-control" id="password" type="password" required
                                           v-model="password"
                                           placeholder="Password">
                                    <small id="passwordHelp" class="form-text text-danger" v-show="error.password"
                                           v-for="err in error.password" :key="err">{{err}}
                                    </small>

                                </div>
                                <button type="submit" class="btn btn-raised btn-primary">Register</button>
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
                name: "",
                email: "",
                password: "",
                company: "",
                error: {}
            };
        },
        watch: {

            email() {
                this.error = {};
            },
            name() {
                this.error = {};
            },
            password() {
                this.error = {};
            },
            company() {
                this.error = {};
            }


        },
        methods: {
            register: function () {
                let data = {
                    name: this.name,
                    email: this.email,
                    password: this.password,
                    company: this.company,
                };
                this.$store
                    .dispatch('auth/register', data)
                    .then(() => this.$router.push("/"))
                    .catch(err => {
                        console.log(err.response);
                        this.error = err.response.data.errors;
                    });
            }
        }
    };
</script>
