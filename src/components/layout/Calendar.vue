<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="primary darken-2" @click="dialog = true">
            Nuevo evento
          </v-btn>
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="grey darken-2" @click="next">
            <v-icon small>
              mdi-chevron-right
            </v-icon>
          </v-btn>
          <v-toolbar-title v-if="$refs.calendar">
            {{ $refs.calendar.title }}
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-menu bottom right>
            <template v-slot:activator="{ on, attrs }">
              <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                <span>{{ typeToLabel[type] }}</span>
                <v-icon right>
                  mdi-menu-down
                </v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="type = 'day'">
                <v-list-item-title>Día</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'week'">
                <v-list-item-title>Semana</v-list-item-title>
              </v-list-item>
              <v-list-item @click="type = 'month'">
                <v-list-item-title>Mes</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="800">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :type="type"
          @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange" locale="es" :weekdays="weekday"></v-calendar>

        <!-- Modal de agregar competición -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card class="box">
            <v-container>
              <v-form @submit.prevent="addEvent">
                <v-card-title>
                  <span class="text-h5">Nuevo evento</span>
                </v-card-title>
                <v-text-field type="text" label="Nombre" v-model="name"></v-text-field>
                <v-text-field type="text" label="Detalle" v-model="details"></v-text-field>
                <v-text-field type="date" label="Fecha" v-model="start"></v-text-field>
                <v-text-field type="color" label="Color" v-model="color"></v-text-field>
                <v-card-actions>
                  <v-spacer></v-spacer>
                  <v-btn color="blue darken-1" text @click="dialog = false;">
                      Cancelar
                  </v-btn>
                  <v-btn type="submit" color="blue darken-1" text @click.stop="dialog = false">
                      Guardar
                  </v-btn>
                </v-card-actions>
              </v-form>
            </v-container>
          </v-card>
        </v-dialog>

        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="350px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent)" icon>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
             <v-form v-if="currentlyEditing !== selectedEvent.id">
               {{ selectedEvent.details }}
             </v-form>
             <v-form v-else>
                <v-text-field type="text" v-model="selectedEvent.name" label="Nombre"></v-text-field>
                <v-text-field type="text" v-model="selectedEvent.details" label="Detalle"></v-text-field>
             </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false">
                Cerrar
              </v-btn>
              <v-btn text color="secondary" @click.prevent="editEvent(selectedEvent.id)" v-if="currentlyEditing !== selectedEvent.id">
                Editar
              </v-btn>
              <v-btn text v-else @click.prevent="updateEvent(selectedEvent)">Guardar cambios</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
import firebase from 'firebase'
//import moment from 'moment'

export default {
  props: ['email'],
  data: () => ({
    focus: '',
    type: 'month',
    typeToLabel: {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
    },
    weekday: [1, 2, 3, 4, 5, 6, 0],
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
    start: null,
    end: null,
    name: null,
    details: null,
    color: '#1976D2',
    dialog: false,
    currentlyEditing: null
  }),
  mounted () {
    this.$refs.calendar.checkChange()
  },
  created () {
    this.getEvents();
  },
  methods: {
    async updateEvent(ev) {
      try {
        await firebase.firestore().collection('events').doc(ev.id).update({
          name: ev.name,
          details: ev.details
        });
        this.selectedOpen = false;
        this.currentlyEditing = null;

      } catch (error) {
        console.log(error);
      }
    },
    editEvent(id) {
      this.currentlyEditing = id;
    },
    async deleteEvent(ev) {
      try {
        await firebase.firestore().collection('events').doc(ev.id).delete();
        this.selectedOpen = false;
        this.getEvents();
      } catch (error) {
        console.log(error);
      }
    },
    async addEvent() {
      try {
        if(this.name && this.start) {
          await firebase.firestore().collection('events').add({
            name: this.name,
            details: this.details,
            start: new Date(this.start).toISOString().substring(0,10),
            end: new Date(this.start).toISOString().substring(0,10),
            color: this.color
          })
          .then((docRef) => {
            console.log("Document written with ID: ", docRef.id);
          })
          .catch((error) => {
            console.error("Error adding document: ", error);
          });

          this.getEvents();

          this.name = null;
          this.details = null;
          this.start = null;
          this.color = '#1976D2';
        } else {
          console.log("Campos obligatorios");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEvents() {
      try {
        //const snapshot = await firebase.firestore().collection('competitions').where('email', "==", this.email).get();
        const snapshot = await firebase.firestore().collection('events').get();
        const events = [];

        snapshot.forEach(doc => {
          console.log("Eventos: ", doc.data());
          let eventoData = doc.data();
          eventoData.id = doc.id;
          /*eventoData.date = moment.unix(doc.data().date.seconds).format("DD/MM/YYYY");
          eventoData.email = doc.data().email;
          eventoData.end = moment.unix(doc.data().end.seconds).format("YYYY-MM-DD");
          eventoData.place = doc.data().place;
          eventoData.result = doc.data().result;
          eventoData.start = moment.unix(doc.data().start.seconds).format("YYYY-MM-DD");
          eventoData.track = doc.data().email;*/
          console.log("EventoData: ", eventoData);
          events.push(eventoData);
        })
        this.events = events;
      } catch (error) {
        console.log(error)
      }
    },
    viewDay ({ date }) {
      this.focus = date
      this.type = 'day'
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    updateRange ({ start, end }) {
      this.start = start
      this.end = end 
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
    },
  },
}
</script>