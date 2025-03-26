export class User {
    id: number;
    name: string;
    email: string;
    password: string;

    constructor(initilizer: {
        id: number,
        name: string,
        email: string,
        password: string 
    }) {
        this.id = initilizer.id;
        this.name = initilizer.name;
        this.email = initilizer.email;
        this.password = initilizer.password;
    }
}
