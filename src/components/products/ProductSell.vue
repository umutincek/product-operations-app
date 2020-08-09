<template>
  <div class="container">
    <div class="loading" :style="isLoading">
      <div class="lds-ripple">
        <div></div>
        <div></div>
      </div>
    </div>
    <div class="row">
      <div class="col-6 offset-3 pt-3 card mt-5 shadow">
        <div class="card-body">
          <h3>Ürün Çıkışı</h3>
          <hr>
          <div class="form-group">
            <label>Ürün Adı</label>
            <select class="form-control" v-model="selectedProduct" @change="productSelected">
              <option selected disabled></option>
              <option 
                v-for="product in getProducts" 
                :key="product.key" 
                :value="product.key"
                :disabled="product.count == 0"
              > 
                {{product.title}} 
              </option>
            </select>
          </div>
          <transition name="fade" mode="out-in">
            <div class="card mb-2 border border-danger" v-if="product !== null">
            <div class="card-body">
              <div class="row">
                <div class="col-12 text-center">
                  <div class="mb-3">
                    <span class="badge badge-info">Stok : {{product.count}} </span>
                    <span class="badge badge-primary">Fiyat : {{product.price || currency}} </span>
                  </div>
                  <p class="border border-warning p-2 text-secondary"> {{product.description}} </p>
                </div>
              </div>
            </div>
          </div>
          </transition>
          <div class="form-group">
            <label>Adet</label>
            <input v-model="productCount" :style="errorMessage" type="text" class="form-control" placeholder="Ürün adetini giriniz..">
            <p v-if="errorCount" style="color: red;">Stokta o kadar adet bulunmamaktadır!</p>
          </div>
          <hr>
          <button @click="save" :disabled="isDisable" class="btn btn-primary">Kaydet</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        selectedProduct: null,
        product: null,
        productCount: null,
        saveButtonClicked: false,
        errorCount: false,
      }
    },
    computed: {
      ...mapGetters([
        'getProducts',
      ]),
      isDisable() {
        if(this.selectedProduct !== null && this.productCount > 0 && !this.errorCount) {
          return false
        } else {
          return true
        }
      },
      isLoading() {
        if(this.saveButtonClicked) {
          return {
            display: "block"
          }
        } else {
          return {
            display: "none"
          }
        }
      },
      errorMessage() {
        if(this.errorCount) {
          return {
            border: '2px solid red'
          }
        } else {
          return {
            border: 'none'
          }
        }
      }
    },
    beforeRouteLeave(to, from, next) {
      if((this.selectedProduct !== null || this.productCount > 0) && !this.saveButtonClicked) {
        if(confirm('Kaydedilmemiş veriler var. Çıkmak istediğinize emin misiniz ?')) {
          next()
        } else {
          next(false)
        }
      } else {
        next()
      }
    },
    methods: {
      productSelected() {
        this.product = this.$store.getters.getProduct(this.selectedProduct)[0]
      },
      save() {
        this.saveButtonClicked = true
        let product = {
          key : this.selectedProduct,
          count : this.productCount,
        }
        setTimeout(() => {
          this.$store.dispatch('sellProduct', product)
          this.saveButtonClicked = false
        }, 700)
        
      }
    },
    watch: {
      productCount() {
        let index = this.getProducts.findIndex(item => item.key == this.selectedProduct)
        if(parseFloat(this.productCount) > parseFloat(this.getProducts[index].count)) {
          this.errorCount = true
        } else {
          this.errorCount = false
        }
      }
    },
  }
</script>
<style scoped>
  .border-danger {
    border-style: dashed !important;
  }
</style>
