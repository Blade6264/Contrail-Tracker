export interface AirlineDataResponse {
    airlineCode: string,
    airlineName: string,
    ContrailCoverageArea: number,
    PowerTrapped: number,
    EstimatedFlightDistance: number,
}

export interface Flight {
    date: string;
    distance: number;
    contrail: number;
    power: number;
}

export interface AirlineData {
    airline_code: string;
    flights: Flight[];
}