<template lang="pug">
  v-container(grid-list-lg fluid)
    v-layout(row wrap)
      v-flex(xs12)
        v-card
          v-card-text 
            v-text-field(
              name="input"
              label="Buscar endereço à partir de um CEP"
              v-model="cep"
              mask="##.###-###"
            )
            v-btn(dark @click="buscar" top right)
              v-icon search
      v-flex(xs12)
        v-card
          v-card-text 
            h1 Pesquisando por: {{ cep }}
      v-flex(xs12)
        v-card
          v-card-text 
            h1 Output: {{ output }}
</template>

<script>
export default {
  data () {
    return {
      cep: '',
      output: 'Nada para exibir'
    }
  },
  methods: {
    buscar () {
      this.output = 'Pesquisando... '
      this.$http.get('http://viacep.com.br/ws/' + this.cep + '/json/').then(response => {
        this.output = response.body
      })
    }
  }
}
</script>
