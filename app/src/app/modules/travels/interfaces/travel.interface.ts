
export interface TravelsItem {
    id: string;
    userId: string;
    destination: string;
    comment: string;
    startDate: Date;
    endDate: Date;
}

export interface DisplayTravel extends TravelsItem {
    daysLeft: number;
}

export interface TravelResponse {
    items: TravelsItem[];
    total: number;
    limit: number;
    page: number;
}
