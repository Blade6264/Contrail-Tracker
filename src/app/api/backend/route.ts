import {NextRequest, NextResponse} from "next/server";
import {AirlineData, AirlineDataResponse} from "@/typings/AirlineData";
import {promises as fs} from 'fs';

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const action = formData.get("action")
    const file = await fs.readFile(process.cwd() + '/src/app/data/total_flight_data.json', 'utf8');

    //load images from file
    const airlines: AirlineData[] = JSON.parse(file);

    switch (action) {
        case "GET_DATA": {
            const airlineCode = formData.get("airlineCode")!!.toString().toUpperCase()

            if (airlines.find((airline) => airline.airline_code === airlineCode)) {
                const airlineData: AirlineData = airlines.find((airline) => airline.airline_code === airlineCode)!!
                const data: AirlineDataResponse = {
                    airlineCode: airlineCode,
                    airlineName: getAirlineNameByCode(airlineCode),
                    ContrailCoverageArea: 0,
                    PowerTrapped: 0,
                    EstimatedFlightDistance: 0,
                }
                for (const flight of airlineData.flights) {
                    data.ContrailCoverageArea += flight.contrail
                    data.PowerTrapped += flight.power
                    data.EstimatedFlightDistance += flight.distance
                }

                data.ContrailCoverageArea = Math.round(data.ContrailCoverageArea * 100) / 100
                data.PowerTrapped = Math.round(data.PowerTrapped * 100) / 100
                data.EstimatedFlightDistance = Math.round(data.EstimatedFlightDistance * 100) / 100

                return NextResponse.json(data)
            } else {
                return new NextResponse("Airline not found", {status: 404});
            }
        }
        case "GET_RANKING": {
            const ranking: AirlineDataResponse[] = []

            for (const airline of airlines) {
                const data: AirlineDataResponse = {
                    airlineCode: airline.airline_code,
                    airlineName: getAirlineNameByCode(airline.airline_code),
                    ContrailCoverageArea: 0,
                    PowerTrapped: 0,
                    EstimatedFlightDistance: 0,
                }
                for (const flight of airline.flights) {
                    data.ContrailCoverageArea += flight.contrail
                    data.PowerTrapped += flight.power
                    data.EstimatedFlightDistance += flight.distance
                }
                ranking.push(data)
            }

            //sort by distance
            ranking.sort((a, b) => b.EstimatedFlightDistance - a.EstimatedFlightDistance)

            ranking.forEach((airline) => {
                airline.ContrailCoverageArea = Math.round(airline.ContrailCoverageArea * 100) / 100
                airline.PowerTrapped = Math.round(airline.PowerTrapped * 100) / 100
                airline.EstimatedFlightDistance = Math.round(airline.EstimatedFlightDistance * 100) / 100
            })

            return NextResponse.json(ranking.slice(0, 5))
        }

        default:
            return new NextResponse("Invalid action", {status: 400});
    }
}

const airlineNames: { [code: string]: string } = {
    "HAL": "Hawaiian Airlines",
    "UAL": "United Airlines",
    "AAL": "American Airlines",
    "DAL": "Delta Airlines",
    "SWA": "Southwest Airlines",
    "ASA": "Alaska Airlines",
    "RVF": "Redwood Virtual Airlines",
    "JBU": "JetBlue Airlines",
    "FFT": "Frontier Airlines",
    "NKS": "Spirit Airlines",
    "MXY": "Mexicana Airlines",
    "SCX": "Sun Country Airlines",
    "VXP": "Viva Aerobus"
};

function getAirlineNameByCode(code: string): string {
    return airlineNames[code] || "Unknown";
}