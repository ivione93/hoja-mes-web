<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn outlined class="mr-4" color="primary darken-2" @click="dialog = true">
            Nueva competición
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
                  <span class="text-h5">Nueva competición</span>
                </v-card-title>
                <v-text-field type="text" label="Lugar" v-model="place"></v-text-field>
                <v-text-field type="text" label="Campeonato" v-model="name"></v-text-field>
                <v-text-field type="date" label="Fecha" v-model="start"></v-text-field>
                <v-text-field type="text" label="Prueba" v-model="track"></v-text-field>
                <v-text-field type="text" label="Marca" v-model="result"></v-text-field>

                <!-- <v-text-field type="text" label="Nombre" v-model="name"></v-text-field>
                <v-text-field type="text" label="Detalle" v-model="details"></v-text-field>
                <v-text-field type="date" label="Fecha" v-model="start"></v-text-field>
                <v-text-field type="color" label="Color" v-model="color"></v-text-field> -->
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
               <p><v-icon>mdi-map-marker</v-icon>{{ selectedEvent.place }}</p>
               <p>{{ selectedEvent.track }} - <strong>{{ selectedEvent.result }}</strong></p>
             </v-form>
             <v-form v-else>
              <v-text-field type="text" v-model="selectedEvent.place" label="Lugar"></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.name" label="Nombre"></v-text-field>
              <v-text-field type="date" v-model="selectedEvent.start" label="Fecha"></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.track" label="Prueba"></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.result" label="Marca"></v-text-field>
                
             </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false; currentlyEditing = null; getEvents()">
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
import firebase from 'firebase';
import {v4 as uuidv4} from 'uuid';
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
    uuid: null,
    place: null,
    name: null,
    date: null,
    track: null,
    result: null,
    start: null,
    end: null,
    details: null,
    color: '#039BE5',
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
        await firebase.firestore().collection('competitions').doc(ev.id).update({
          place: ev.place,
          name: ev.name,
          date: firebase.firestore.Timestamp.fromDate(new Date(ev.start)),
          track: ev.track,
          result: ev.result,
          details: ev.track + ": " + ev.result,
          start: new Date(ev.start).toISOString().substring(0,10),
          end: new Date(ev.start).toISOString().substring(0,10)
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
        await firebase.firestore().collection('competitions').doc(ev.id).delete();
        this.selectedOpen = false;
        this.getEvents();
      } catch (error) {
        console.log(error);
      }
    },
    async addEvent() {
      try {
        if(this.place && this.name && this.start && this.track && this.result) {
          this.uuid = uuidv4();
          console.log("UUID: ", this.uuid)
          await firebase.firestore().collection('competitions').doc(this.uuid).set({
            id: this.uuid,
            email: this.email,
            place: this.place,
            name: this.name,
            date: firebase.firestore.Timestamp.fromDate(new Date(this.start)),
            track: this.track,
            result: this.result,
            details: this.track + ": " + this.result,
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

          this.uudi = null;
          this.place = null;
          this.name = null;
          this.date = null;
          this.track = null;
          this.result = null;
          this.details = null;
          this.start = null;
          this.color = '#039BE5';
        } else {
          console.log("Campos obligatorios");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async getEvents() {
      try {
        const snapshot = await firebase.firestore().collection('competitions').where('email', "==", this.email).get();
        const events = [];

        snapshot.forEach(doc => {
          console.log("Competiciones: ", doc.data());
          let eventoData = doc.data();
          eventoData.id = doc.id;
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