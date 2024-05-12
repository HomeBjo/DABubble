import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class ToggleBooleanService {

  constructor() { }

  openSearchWindow: boolean = false;
  openChannelMemberWindow: boolean = false;
  closeChannelMemberWindow: boolean = false;
  openSearchWindowHead: boolean = false;
  selectUserInMsgBox:boolean = false;
  isSidebarOpen: boolean = true;
  
  /**
   * Opens or closes the add member window based on the provided boolean value.
   * @param boolean A boolean value to determine whether to open or close the add member window.
   */
  openAddMemberWindow(boolean : boolean){
    this.closeChannelMemberWindow = boolean;
  }
}
