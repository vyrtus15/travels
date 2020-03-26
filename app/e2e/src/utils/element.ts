import { by, element, ElementFinder } from 'protractor';

export function getElementByCss(selector: string, target?: ElementFinder) {
    return target ? target.element(by.css(selector)) : element(by.css(selector));
}

export function fillInput(input: ElementFinder, value: string) {
    return input.sendKeys(value);
}
