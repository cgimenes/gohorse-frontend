<template>
  <v-layout row="row" wrap="wrap" id="address-form">
    <v-flex col xs12 sm2>
      <v-text-field required :rules='[rules.empty]' name="zipcode" mask="#####-###" v-model="address.postalCode.code" label="CEP" id="address"></v-text-field>
    </v-flex>
    <v-flex col xs12 sm8>
      <v-text-field name="address" :disabled="(matched && address.postalCode.hasStreet)" v-model="address.postalCode.streetName" label="Endereço" id="address"></v-text-field>
    </v-flex>
    <v-flex col xs12 sm2>
      <v-text-field required :rules='[rules.empty]' name="number" v-model="address.number" label="Número" id="number"></v-text-field>
    </v-flex>
    <v-flex col xs12 sm3>
      <v-text-field name="complement" v-model="address.complement" label="Complemento" id="complement"></v-text-field>
    </v-flex>
    <v-flex col xs12 sm4>
      <v-text-field name="neighbourhood" :disabled="(matched && address.postalCode.hasStreet)" v-model="address.postalCode.neighbourhood" label="Bairro" id="neighbourhood"></v-text-field>
    </v-flex>
    <v-flex col xs8 sm4>
      <v-text-field required :rules='[rules.empty]' name="city" :disabled="matched" v-model="address.postalCode.city" label="Cidade" id="city"></v-text-field>
    </v-flex>
    <v-flex col xs4 sm1>
      <v-text-field required :rules='[rules.empty]' name="state" :disabled="matched" v-model="address.postalCode.state" label="Estado" id="state"></v-text-field>
    </v-flex>
  </v-layout>
</template>

<script>
import AddressService from './AddressService'

export default {
  props: {
    address: {
      type: Object,
      default () {
        return {
          number: null,
          complement: null,
          hasStreet: false,
          postalCode: {
            code: null,
            streetName: '',
            neighbourhood: '',
            city: '',
            state: '',
            country: 'Brasil'
          }
        }
      }
    }
  },
  data: function () {
    return {
      matched: false,
      rules: {
        empty: value => (value || '').length > 0 || 'Preenchimento obrigatório!'
      }
    }
  },
  computed: {
    addressTypes () {
      return AddressService.getAddressTypes()
    }
  },
  methods: {
    setZipcode (zipcode, address) {
      AddressService.getZipcode(zipcode, function (postalCode) {
        address.postalCode.streetName = postalCode.logradouro || address.postalCode.streetName
        address.postalCode.city = postalCode.localidade
        address.postalCode.state = postalCode.uf
        address.postalCode.neighbourhood = postalCode.bairro || address.postalCode.neighbourhood
        address.hasStreet = postalCode.logradouro !== ''
      })
    }
  },
  watch: {
    'address.postalCode.code': function (zipcode) {
      this.matched = false

      if (zipcode.length === 8) {
        this.setZipcode(zipcode, this.address)
        this.matched = true
      }
    }
  }
}
</script>
