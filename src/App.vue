<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bb-0 bg-white px-3" v-if="!isLoggedIn || !currentPage.includes('/doc/')">
            <a class="navbar-brand" href="#">Postman Docs</a>
            <ul class="navbar-nav ml-auto flex-sm-row flex-column">
                <li class="nav-item" :class="[currentPage=='/'?'active':'']">
                    <router-link class="nav-link" to="/">Home</router-link>
                </li>
                <li class="nav-item" :class="[currentPage=='/login'?'active':'']">
                    <router-link class="nav-link" to="/login" v-if="!isLoggedIn">Login</router-link>
                </li>
                <li class="nav-item" :class="[currentPage=='/register'?'active':'']">
                    <router-link class="nav-link" to="/register" v-if="!isLoggedIn">Register</router-link>
                </li>
                <li class="nav-item" v-if="isLoggedIn" style="cursor: pointer">
                    <a class="nav-link" @click.prevent="logout">Logout</a>
                </li>
                <li class="nav-item" v-if="isLoggedIn" :class="[currentPage.includes('/doc')?'active':'']">
                    <router-link class="nav-link" to="/doc/1">View Doc</router-link>
                </li>
            </ul>
        </nav>
        <router-view/>
    </div>
</template>

<script>

    export default {
        name: 'App',
        components: {},
        computed: {
            isLoggedIn: function () {
                return this.$store.getters['auth/isLoggedIn'];
            },
            currentPage() {
                return this.$route.path;
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch("logout").then(() => {
                    this.$router.push("/login");
                });
            }
        }
    }
</script>

<style lang="scss">
    .progress-bar,.progress
    {
        height: 2px;
    }
</style>

<style>
    #app {

    }
</style>
