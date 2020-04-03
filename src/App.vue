<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <div id="app">
        <Layout>
            <template v-slot:header>
                <Header></Header>
            </template>
            <template v-slot:main>
               <Main>
               </Main>
            </template>

        </Layout>
    </div>
</template>

<script>
    import Header from './components/Header.vue'
    import Layout from './components/Layout.vue'
    import Main from './components/Main.vue'

    export default {
        name: 'App',
        components: {
            Layout,
            Header,
            Main
        }
    }
</script>

<style lang="scss">

</style>

<style>
    #app {

    }
</style>
