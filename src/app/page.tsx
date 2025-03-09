"use client";

import React, { useState, useEffect } from "react";
import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownSection,
    DropdownItem
} from "@nextui-org/dropdown";
import { Card } from "@nextui-org/card";
import { AirlineDataResponse } from "@/typings/AirlineData";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { Image } from "@nextui-org/image";
import airlineDataJson from '@/app/data/total_flight_data.json';

export default function Home() {
    const [search, setSearch] = useState("");
    const [data, setData] = useState<AirlineDataResponse | undefined>(undefined);
    const [graphs, setGraphs] = useState<JSX.Element[]>([]);

    // Create a static map of airline names by code (from the original route.ts file)
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

    // Function to get airline name by code
    const getAirlineNameByCode = (code: string): string => {
        return airlineNames[code] || "Unknown";
    };

    // Process the data directly from the JSON
    const processAirlineData = (airlineCode: string) => {
        // Find the airline in the JSON data
        const airline = airlineDataJson.find(airline => airline.airline_code === airlineCode);

        if (!airline) {
            setData(undefined);
            return;
        }

        // Calculate totals (similar to what was done in the API)
        const processedData: AirlineDataResponse = {
            airlineCode: airlineCode,
            airlineName: getAirlineNameByCode(airlineCode),
            ContrailCoverageArea: 0,
            PowerTrapped: 0,
            EstimatedFlightDistance: 0,
        };

        // Process each flight's data
        for (const flight of airline.flights) {
            processedData.ContrailCoverageArea += flight.contrail;
            processedData.PowerTrapped += flight.power;
            processedData.EstimatedFlightDistance += flight.distance;
        }

        // Round the values to 2 decimal places
        processedData.ContrailCoverageArea = Math.round(processedData.ContrailCoverageArea * 100) / 100;
        processedData.PowerTrapped = Math.round(processedData.PowerTrapped * 100) / 100;
        processedData.EstimatedFlightDistance = Math.round(processedData.EstimatedFlightDistance * 100) / 100;

        // Set the data
        setData(processedData);

        // Create the graphs
        const imageNames = ['Est_Contrail_Coverage_', 'Est_Flight_Distance_', 'Est_Power_Trapped_'];
        const newGraphs: JSX.Element[] = imageNames.map((name, index) => (
            <div key={`${name}${airlineCode}-${index}`}>
                <Image
                    alt="airline"
                    radius="sm"
                    src={`../images/graphs/${name}${airlineCode}.png`}
                    width={250}
                />
            </div>
        ));

        setGraphs(newGraphs);
    };

    // Trigger data processing when search changes
    useEffect(() => {
        if (search) {
            processAirlineData(search);
        }
    }, [search]);

    const airlineDropdownItems = airlineDataJson.map((airline) => (
        <DropdownItem key={airline.airline_code} onClick={() => setSearch(airline.airline_code)}>
            {airline.airline_name}
        </DropdownItem>
    ));

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Nav/>
                <div className="flex flex-1 flex-col items-center justify-center px-4 text-center md:px-6">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-bold tracking-tight">Search US Airline Emissions</h1>
                        <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
                            Choose an airline name to get contrail data produced by US major
                            airlines.
                        </p>
                        <div className="mx-auto max-w-[400px]">
                            <div className="flex rounded-lg">
                                <Dropdown>
                                    <DropdownTrigger>
                                        <button className="btn btn-primary text-gray-400 bg-gray-700 w-[200px] p-2 rounded-2xl">Start Here</button>
                                    </DropdownTrigger>
                                    <DropdownMenu>
                                        <DropdownSection className="text-gray-400">
                                            {airlineDropdownItems}
                                        </DropdownSection>
                                    </DropdownMenu>
                                </Dropdown>
                            </div>
                        </div>
                    </div>
                    {data !== undefined && (
                        <div className="mx-auto my-6 grid gap-4 w-full lg:max-w-4xl">
                            <Card>
                                <div className="grid gap-2 p-4">
                                    <h2 className="text-xl font-semibold">{data.airlineName}</h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Estimated flight
                                        distance: {data.EstimatedFlightDistance} km</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Contrail
                                        Coverage: {data.ContrailCoverageArea} km<sup>2</sup></p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Power
                                        trapped: {data.PowerTrapped} kW</p>
                                    <div className={"flex flex-row items-center justify-center"}>
                                        {graphs}
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
                <Footer/>
            </div>
        </>
    );
}