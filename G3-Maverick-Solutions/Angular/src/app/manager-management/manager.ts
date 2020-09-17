import { Container } from '../container-management/container';



export class Manager {
    ManagerID: number;
    UserID: number;
    ManQualification: string;
    ManNationality: string;
    ManIDNumber: string;
    ManNextOfKeenFName: string;
    ManNextOfKeenCell: string;
    Containers: Container[] = [];
    
}
