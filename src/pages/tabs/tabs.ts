import { Component } from '@angular/core';

import { HomePage } from '../home/home';
import { EventPage } from '../event/event';
import { ProfilPage } from '../profil/profil';

@Component({
  templateUrl: 'tabs.html',
})
export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = EventPage;
  tab2Root: any = HomePage;
  tab3Root: any = ProfilPage;

  constructor() {

  }
}
