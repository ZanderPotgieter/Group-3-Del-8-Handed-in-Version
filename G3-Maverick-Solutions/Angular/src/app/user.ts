import {Container} from './container-management/container';

export class User {
   UserID: number;
        UserTypeID: number;
        ContainerID: number;
        SessionID: string;
        UserPassword: string;
        UserName: string;
        UserSurname: string;
        UserCell: string;
        UserEmail: string;
        Container: Container;
}
