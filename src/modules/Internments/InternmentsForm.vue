<template>
  <v-container grid-list-lg='grid-list-lg' fluid='fluid'>
    <v-layout row='row' wrap='wrap'>
      <v-flex xs12>
        <v-card>
          <v-container grid-list-lg='grid-list-lg' fluid='fluid'>
            <v-layout row='row' wrap='wrap'>
              <v-flex col xs12>
                <h4 class='grey--text'>Dados do Internamento</h4>
              </v-flex>

              <v-flex col xs12 sm6='sm6'>
                <AnimalComplete label="Animal" :animal="internment.animal.id" :model.sync="internment.animalId" :key="internment.id"></AnimalComplete>
              </v-flex>

              <v-flex col xs12 sm3='sm3'>
                <v-menu
                  ref='menuBusyAt'
                  :close-on-content-click='false'
                  v-model='menuBusyAt'
                  :nudge-right='40'
                  lazy
                  transition='scale-transition'
                  offset-y
                  full-width
                  max-width='290px'
                  min-width='290px'
                >
                  <v-text-field
                    required
                    :rules='[rules.empty]'
                    :mask='dateMask'
                    slot='activator'
                    v-model='internment.busyAt.date'
                    label='Data de entrada'
                    prepend-icon='event'
                    @blur='dateBusyAt = parseDate(internment.busyAt.date)'
                  ></v-text-field>
                  <v-date-picker
                    v-model='dateBusyAt'
                    no-title
                    locale='pt-br'
                    @input='menuBusyAt=false'
                    >
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex col xs12 sm3='sm3'>
                <v-text-field
                  required
                  :rules='[rules.empty, rules.hour]'
                  :mask='hourMask'
                  name='name'
                  label='Horário de entrada'
                  id='hour'
                  prepend-icon='access_time'
                  v-model='internment.busyAt.hour'
                  key='name'
                  >
                </v-text-field>
              </v-flex>

              <v-flex col xs12 sm6='sm6'>
                <BedComplete label="Leito" :bed="internment.bed.id" :model.sync="internment.bedId" :key="internment.id"></BedComplete>
              </v-flex>

              <v-flex col xs12 sm3='sm3'>
                <v-menu
                  ref='menuBusyUntil'
                  :close-on-content-click='false'
                  v-model='menuBusyUntil'
                  :nudge-right='40'
                  lazy
                  transition='scale-transition'
                  offset-y
                  full-width
                  max-width='290px'
                  min-width='290px'
                >
                  <v-text-field
                    :mask='dateMask'
                    slot='activator'
                    v-model='internment.busyUntil.date'
                    label='Data de saída'
                    prepend-icon='event'
                    @blur='dateBusyUntil = parseDate(internment.busyUntil.date)'
                  ></v-text-field>
                  <v-date-picker
                    v-model='dateBusyUntil'
                    no-title
                    locale='pt-br'
                    @input='menuBusyUntil=false'
                    >
                  </v-date-picker>
                </v-menu>
              </v-flex>

              <v-flex col xs12 sm3='sm3'>
                <v-text-field
                  :mask='hourMask'
                  :rules='[rules.empty, rules.hour]'
                  name='name'
                  label='Horário de saída'
                  id='hour'
                  prepend-icon='access_time'
                  v-model='internment.busyUntil.hour'
                  key='name'
                  >
                </v-text-field>
              </v-flex>

              <v-flex col xs12>
                <v-btn
                  color='primary'
                  :disabled='!formIsValid'
                  @click='saveInternment()'
                >Salvar
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import InternmentsService from './InternmentsService'
import BedComplete from '../Enumerators/AutocompleteBed'
import AnimalComplete from '../Animals/AutocompleteAnimal'
import moment from 'moment'

export default {
  components: { BedComplete, AnimalComplete },
  data () {
    return {
      internment: {
        animal: {},
        bed: {},
        animalId: '',
        bedId: '',
        busyAt: {
          date: null,
          hour: null
        },
        busyUntil: {
          date: null,
          hour: null
        }
      },
      menuBusyAt: false,
      menuBusyUntil: false,
      dateBusyAt: null,
      dateBusyUntil: null,
      hourMask: 'time',
      dateMask: 'date',
      rules: {
        empty: value => (value || '').length > 0 || 'Preenchimento obrigatório!',
        hour: value => {
          const pattern = /([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]/
          return pattern.test(moment(value, 'HH:mm').format('HH:mm')) || 'Horário inválido!'
        }
      }
    }
  },
  watch: {
    dateBusyAt (val) {
      this.internment.busyAt.date = this.formatDate(this.dateBusyAt)
    },
    dateBusyUntil (val) {
      this.internment.busyUntil.date = this.formatDate(this.dateBusyUntil)
    }
  },
  computed: {
    formIsValid () {
      return (
        this.internment.animal &&
        this.internment.bed &&
        this.internment.busyAt.date &&
        this.internment.busyAt.hour
      )
    }
  },
  methods: {
    saveInternment () {
      const internmentFinal = { ...this.internment }

      internmentFinal.busyAt = moment.utc(
        `${this.internment.busyAt.date} ${this.internment.busyAt.hour}`,
        'DD/MM/YYYY HH:mm'
      )
      internmentFinal.busyUntil = moment.utc(
        `${this.internment.busyUntil.date} ${this.internment.busyUntil.hour}`,
        'DD/MM/YYYY HH:mm'
      )

      InternmentsService.saveInternment(internmentFinal, res => {
        if (internmentFinal.busyUntil < internmentFinal.busyAt) {
          return this.$toasted.error('A saída do animal não pode ser anterior à entrada!', {
            icon: 'warning'
          })
        }
        this.$toasted.success('Internamento salvo com sucesso!', {
          icon: 'check'
        })

        this.$router.push('/internments/')
      })
    },
    getDataForEdit () {
      InternmentsService.getInternmentDetails(
        this.$route.params.id,
        internment => {
          this.internment.id = internment.id
          this.internment.animalId = internment.animal.id
          this.internment.bedId = internment.bed.id
          this.internment.busyAt.date =
            moment(internment.busyAt)
            .format('DD/MM/YYYY')
          this.internment.busyAt.hour =
            moment(internment.busyAt)
            .format('HH:mm')

          if (internment.busyUntil) {
            this.internment.busyUntil.date =
              moment(internment.busyUntil)
              .format('DD/MM/YYYY')
            this.internment.busyUntil.hour =
              moment(internment.busyUntil)
              .format('HH:mm')
          }
        }
      )
    },
    formatDate (date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },
    parseDate (date) {
      if (!date) return null

      const [month, day, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getDataForEdit()
    }
  }
}
</script>
