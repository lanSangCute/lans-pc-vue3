export class FormUtils{
    constructor(){}
    handleNumberKeyPress(event:KeyboardEvent){
        const invalidChars = ['-', '+', 'e', '.', 'E']
        if(invalidChars.includes(event.key)){
            event.preventDefault()
        }
    }
}