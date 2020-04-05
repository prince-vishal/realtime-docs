<template>
  <div class="container">

    <div class="row px-0 mx-0 mt-5">
      <div class="col-sm-10 col-md-10 mx-auto">
        <div class="card-body">
          <h5 class="text-danger text-uppercase text-center">You are not authorized to view this document</h5>
          <div class="row mt-5">
            <div class="d-flex w-100 align-content-center justify-content-center">
              <router-link to="/" tag="button" class="btn btn-raised btn-info">Return Home</router-link>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'Error',
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
