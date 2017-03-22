import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { EventPage } from '../pages/event/event';
import { ProfilPage } from '../pages/profil/profil';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import {ngEvent} from "../pages/ngEvent/ngEvent";
import {EventDescriptionPage} from "../pages/event/event-description/event-description";

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
    IonicModule.forRoot(MyApp)
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
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
