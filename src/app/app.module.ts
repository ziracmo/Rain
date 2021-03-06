import {NgModule, ErrorHandler} from '@angular/core';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import {EventPage} from '../pages/event/event';
import {ProfilPage} from '../pages/profil/profil';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {ngEvent} from "../pages/home/ngEvent/ngEvent";
import {EventDescriptionPage} from "../pages/event/event-description/event-description";
import {CloudSettings, CloudModule} from '@ionic/cloud-angular';
import {GlobalEvents} from './providers/events';
import {UserData} from "./providers/user";

const cloudSettings: CloudSettings = {
  'core': {
    'app_id': 'bc6d90d8'
  }
};


@NgModule({
  declarations: [
    MyApp,
    EventPage,
    ProfilPage,
    HomePage,
    TabsPage,
    ngEvent,
    EventDescriptionPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    CloudModule.forRoot(cloudSettings)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    EventPage,
    ProfilPage,
    HomePage,
    TabsPage,
    ngEvent,
    EventDescriptionPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GlobalEvents,
    UserData
  ]
})
export class AppModule {
}
