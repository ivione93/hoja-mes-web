<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat>
          <v-btn class="mr-4" dark color="#212B39" depressed @click="dialogTraining = true">
            Añadir entrenamiento
          </v-btn>
          <v-btn class="mr-4" dark color="#039BE5" depressed @click="dialog = true">
            Añadir competición
          </v-btn>
          <v-btn outlined class="mr-4" color="#212B39" @click="setToday">
            Hoy
          </v-btn>
          <v-btn fab text small color="#212B39" @click="prev">
            <v-icon small>
              mdi-chevron-left
            </v-icon>
          </v-btn>
          <v-btn fab text small color="#212B39" @click="next">
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
              <v-btn outlined color="#212B39" v-bind="attrs" v-on="on">
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
      <v-sheet height="650">
        <v-calendar ref="calendar" v-model="focus" color="primary" :events="events" :event-color="getEventColor" :type="type"
          @click:event="showEvent" @click:more="viewDay" @click:date="viewDay" @change="updateRange" locale="es" :weekdays="weekday"></v-calendar>

        <!-- Modal de agregar entrenamiento -->
        <v-dialog v-model="dialogTraining" persistent max-width="600px">
          <v-card>
            <v-form @submit.prevent="addTraining">
              <v-toolbar color="#212B39" dark>Nuevo entrenamiento</v-toolbar>
              <v-card-text class="mr-4">
                <v-container>
                  <v-row><br></v-row>
                  <v-row>
                    <v-text-field type="date" label="Fecha" v-model="start" outlined></v-text-field>
                  </v-row>
                  <v-row align="center">
                    <v-text-field type="text" label="Tiempo" v-model="time" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field type="number" label="Distancia" v-model="distance" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field type="text" label="Observaciones" v-model="observes" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    Datos adicionales: series, cuestas, fartlek y gym
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#212B39" text @click="dialogTraining = false;">
                    Cancelar
                </v-btn>
                <v-btn type="submit" color="#212B39" dark @click.stop="dialogTraining = false">
                    Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <!-- Modal de agregar competición -->
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card class="box">
            <v-form @submit.prevent="addEvent">
              <v-toolbar color="#039BE5" dark>Nueva competición</v-toolbar>
              <v-card-text>
                <v-container>
                  <v-row><br></v-row>
                  <v-row align="center">
                    <v-text-field type="text" label="Lugar" v-model="place" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field type="text" label="Campeonato" v-model="name" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field type="date" label="Fecha" v-model="start" outlined></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field type="text" label="Prueba" v-model="track" style="margin-right: 5px" outlined></v-text-field>
                    <v-text-field type="text" label="Marca" v-model="result" style="margin-left: 5px" outlined></v-text-field>
                  </v-row>
                </v-container>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="#039BE5" text @click="dialog = false;">
                    Cancelar
                </v-btn>
                <v-btn type="submit" color="#039BE5" dark @click.stop="dialog = false">
                    Guardar
                </v-btn>
              </v-card-actions>
            </v-form>
          </v-card>
        </v-dialog>

        <v-menu v-model="selectedOpen" :close-on-content-click="false" :activator="selectedElement" offset-x>
          <v-card color="grey lighten-4" min-width="400px" flat>
            <v-toolbar :color="selectedEvent.color" dark>
              <v-btn @click="deleteEvent(selectedEvent)" icon v-if="selectedEvent.name != 'Entrenamiento'">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
               <v-btn @click="deleteTraining(selectedEvent)" icon v-else>
                <v-icon>mdi-delete</v-icon>
              </v-btn>
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-card-text>
             <v-form v-if="currentlyEditing !== selectedEvent.id && selectedEvent.name != 'Entrenamiento'">
               <p><v-icon>mdi-map-marker</v-icon>{{ selectedEvent.place }}</p>
               <p>{{ selectedEvent.track }} - <strong>{{ selectedEvent.result }}</strong></p>
             </v-form>
             <v-form v-else-if="currentlyEditing !== selectedEvent.id && selectedEvent.name == 'Entrenamiento'">
               <p>{{ selectedEvent.distance }} kms - <strong>{{ selectedEvent.time }} ({{ selectedEvent.partial }}/km)</strong></p>
             </v-form>
             <v-form v-else-if="currentlyEditing === selectedEvent.id && selectedEvent.name == 'Entrenamiento'">
              <v-text-field type="date" v-model="selectedEvent.start" label="Fecha" outlined></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.time" label="Tiempo" outlined></v-text-field>
              <v-text-field type="number" v-model="selectedEvent.distance" label="Distancia" outlined></v-text-field>
             </v-form>
             <v-form v-else>
              <v-text-field type="text" v-model="selectedEvent.place" label="Lugar" outlined></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.name" label="Nombre" outlined></v-text-field>
              <v-text-field type="date" v-model="selectedEvent.start" label="Fecha" outlined></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.track" label="Prueba" outlined></v-text-field>
              <v-text-field type="text" v-model="selectedEvent.result" label="Marca" outlined></v-text-field>
             </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn text color="secondary" @click="selectedOpen = false; currentlyEditing = null; getEvents(); getTrainings();">
                Cerrar
              </v-btn>
              <v-btn text color="secondary" @click.prevent="editEvent(selectedEvent.id)" v-if="currentlyEditing !== selectedEvent.id">
                Editar
              </v-btn>
              <v-btn text v-else-if="currentlyEditing === selectedEvent.id && selectedEvent.name != 'Entrenamiento'" @click.prevent="updateEvent(selectedEvent)">Guardar cambios</v-btn>
              <v-btn text v-else-if="currentlyEditing === selectedEvent.id && selectedEvent.name == 'Entrenamiento'" @click.prevent="updateTraining(selectedEvent)">Guardar cambios</v-btn>
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
    // Comun
    id: null,
    uuid: null,
    name: null,
    date: null,
    start: null,
    end: null,
    details: null,
    //Competitions
    place: null,
    track: null,
    result: null,
    color: '#039BE5',
    dialog: false,
    // Training
    time: null,
    distance: null,
    observes: null,
    colorTraining: '#212B39',
    dialogTraining: false,
    currentlyEditing: null
  }),
  mounted () {
    this.$refs.calendar.checkChange()
  },
  created () {
    this.getEvents();
    this.getTrainings();
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
    async updateTraining(training) {
      try {
        await firebase.firestore().collection('trainings').doc(training.id).update({
          date: firebase.firestore.Timestamp.fromDate(new Date(training.start)),
          time: training.time,
          distance: training.distance,
          partial: '5.00 (t)',
          details: training.distance + " kms: " + training.time,
          start: new Date(training.start).toISOString().substring(0,10),
          end: new Date(training.start).toISOString().substring(0,10)
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
        this.getTrainings();
      } catch (error) {
        console.log(error);
      }
    },
    async deleteTraining(training) {
      try {
        await firebase.firestore().collection('trainings').doc(training.id).delete();
        this.selectedOpen = false;
        this.getEvents();
        this.getTrainings();
      } catch (error) {
        console.log(error);
      }
    },
    async addEvent() {
      try {
        if(this.place && this.name && this.start && this.track && this.result) {
          this.uuid = uuidv4();
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
            console.log("Competition saved with ID: ", docRef);
          })
          .catch((error) => {
            console.error("Error adding competition: ", error);
          });

          this.getEvents();
          this.getTrainings();

          this.id = null;
          this.uudi = null;
          this.place = null;
          this.name = null;
          this.date = null;
          this.track = null;
          this.result = null;
          this.details = null;
          this.start = null;
        } else {
          console.log("Campos obligatorios");
        }
      } catch (error) {
        console.log(error);
      }
    },
    async addTraining() {
      try {
        if(this.start && this.time && this.distance) {
          this.uuid = uuidv4();
          await firebase.firestore().collection('trainings').doc(this.uuid).set({
            id: this.uuid,
            email: this.email,
            name: 'Entrenamiento',
            date: firebase.firestore.Timestamp.fromDate(new Date(this.start)),
            distance: this.distance,
            time: this.time,
            observes: this.observes,
            partial: '5.00 (t)',
            details: this.distance + "kms: " + this.time,
            start: new Date(this.start).toISOString().substring(0,10),
            end: new Date(this.start).toISOString().substring(0,10),
            color: this.colorTraining
          })
          .then((docRef) => {
            console.log("Training saved with ID: ", docRef);
          })
          .catch((error) => {
            console.error("Error adding training: ", error);
          });

          this.getEvents();
          this.getTrainings();

          this.id = null;
          this.uudi = null;
          this.start = null;
          this.time = null;
          this.distance = null;
          this.observes = null;
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
    async getTrainings() {
      try {
        const snapshot = await firebase.firestore().collection('trainings').where('email', "==", this.email).get();
        const events = this.events;

        snapshot.forEach(doc => {
          console.log("Trainings: ", doc.data());
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
  }
}
</script>