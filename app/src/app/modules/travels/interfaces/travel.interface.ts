
export interface TravelsItem {
    id: string;
    userId: string;
    destination: string;
    comment: string;
    startDate: Date | string;
    endDate: Date | string;
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

export interface MappedTravels {
    items: DisplayTravel[];
    total: number;
}

export interface TravelFilter {
    destination: string;
    startDate: Date | string;
    endDate: Date | string;
}
