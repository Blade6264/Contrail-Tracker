"use client";

import React, { JSX, useEffect, useState } from "react";
import Nav from "@/components/Nav";
import { Card, CardHeader } from "@nextui-org/card";
import { CardBody, Divider } from "@nextui-org/react";
import { Image } from "@nextui-org/image";
import Footer from "@/components/Footer";
import { AirlineDataResponse } from "@/typings/AirlineData";
import airlineDataJson from '@/app/data/total_flight_data.json';

export default function Page() {
    const [data, setData] = useState<AirlineDataResponse[] | undefined>(undefined);
    const [cards, setCards] = useState<JSX.Element[]>([]);

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

    useEffect(() => {
        // Process the data directly from the JSON
        const processRankingData = () => {
            const ranking: AirlineDataResponse[] = [];

            // Process each airline's data
            for (const airline of airlineDataJson) {
                const processedData: AirlineDataResponse = {
                    airlineCode: airline.airline_code,
                    airlineName: getAirlineNameByCode(airline.airline_code),
                    ContrailCoverageArea: 0,
                    PowerTrapped: 0,
                    EstimatedFlightDistance: 0,
                };

                // Calculate totals for each flight
                for (const flight of airline.flights) {
                    processedData.ContrailCoverageArea += flight.contrail;
                    processedData.PowerTrapped += flight.power;
                    processedData.EstimatedFlightDistance += flight.distance;
                }

                ranking.push(processedData);
            }

            // Sort by distance (same as in the API)
            ranking.sort((a, b) => b.EstimatedFlightDistance - a.EstimatedFlightDistance);

            // Round the values to 2 decimal places
            ranking.forEach((airline) => {
                airline.ContrailCoverageArea = Math.round(airline.ContrailCoverageArea * 100) / 100;
                airline.PowerTrapped = Math.round(airline.PowerTrapped * 100) / 100;
                airline.EstimatedFlightDistance = Math.round(airline.EstimatedFlightDistance * 100) / 100;
            });

            // Take top 5 airlines
            const top5 = ranking.slice(0, 5);
            setData(top5);

            // Create cards for the top 5 airlines
            const newCards = top5.map((airline, i) => (
                <Card key={airline.airlineCode} className="my-5 min-w-96 max-w-3xl px-5">
                    <CardHeader className="flex gap-3">
                        <Image
                            alt="airline logo"
                            height={40}
                            radius="sm"
                            src={`/images/logos/${airline.airlineCode}.png`}
                            width={40}
                        />
                        <div className="flex flex-col">
                            <p className="text-md">{airline.airlineName}</p>
                        </div>
                    </CardHeader>
                    <Divider/>
                    <CardBody className="items-start">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Estimated flight distance: {airline.EstimatedFlightDistance} km</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Contrail Coverage: {airline.ContrailCoverageArea} km<sup>2</sup></p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Power trapped: {airline.PowerTrapped} kW</p>
                    </CardBody>
                </Card>
            ));

            setCards(newCards);
        };

        // Call the function to process data
        processRankingData();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            <Nav/>
            <main
                className="flex flex-1 flex-col items-center justify-center px-4 text-center md:px-6">
                <div className="flex flex-col gap-4 pb-7 mt-5">
                    <h1 className="text-5xl font-bold tracking-tight">Airline Environmental Impact</h1>
                    <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
                        Top 5 Airlines by Contrail Production
                    </p>
                </div>
                <div className="flex flex-col items-center w-full overflow-auto">
                    {cards}
                </div>
            </main>
            <Footer/>
        </div>
    );
}