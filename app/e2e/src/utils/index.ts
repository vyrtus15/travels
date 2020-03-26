import { browser } from 'protractor';

export function navigate(path: string) {
    return browser.get(`${browser.baseUrl}${path}`);
}

export function wait(timeout: number) {
    return new Promise((resolve) => setTimeout(resolve, timeout));
}