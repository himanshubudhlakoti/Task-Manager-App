export function setItemToLocal(key: string, value: string): boolean {
    localStorage.setItem(key, value)
    return true
}

export function getItemFromLocal(key: string): string | null {
    return localStorage.getItem(key);
}

export function clearLocalStorage(): boolean {

    localStorage.clear();
    return true;
}

export function getFileData(fileEvent: any): FormData {

    let formData = new FormData();
    formData.append("file", fileEvent.target.files[0]);
    return formData;
}

export function getRandomNumber(): any {

    let randomNumber = Math.ceil(Math.random() * 1000) + 1;
    let date = Math.ceil(Date.now() / 1000);
    let randomNumberUpdated = (randomNumber * date) <= 0 ? Math.ceil(Date.now() / 100) : (randomNumber * date);

    console.log("randomNumber", randomNumber, "date", date)
    return randomNumberUpdated;
}