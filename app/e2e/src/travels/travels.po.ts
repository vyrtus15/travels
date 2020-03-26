import { ElementFinder } from 'protractor';
import { navigate } from '../utils';
import { getElementByCss } from '../utils/element';

export class TravelsPage {
  navigateTo(userId: string) {
    return navigate(`travels/${userId}`);
  }

  getTitle() {
    return getElementByCss('app-travels > div:nth-child(1) > h1').getText() as Promise<string>;
  }

  getFirstTravelDetails() {
    return this.getTravelDetails(this.getNthTravel(1));
  }

  getNthTravel(n: number = 1) {
    return getElementByCss(`app-travels table tbody tr:nth-child(${n})`);
  }

  getTravelDetails(travel: ElementFinder) {
    return {
      destination: getElementByCss('td:nth-child(1)', travel).getText(),
      startDate: getElementByCss('td:nth-child(2)', travel).getText(),
      endDate: getElementByCss('td:nth-child(3)', travel).getText(),
      comment: getElementByCss('td:nth-child(5)', travel).getText(),
      editBtn: getElementByCss('td:nth-child(6) button', travel),
      deleteBtn: getElementByCss('td:nth-child(7) button', travel),
    };
  }

}
