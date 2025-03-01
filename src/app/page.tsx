"use client";

import React, {useEffect, useState} from "react";
import {Input} from "@nextui-org/input";
import {Card} from "@nextui-org/card";
import {AirlineDataResponse} from "@/typings/AirlineData";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {Image} from "@nextui-org/image";

export default function Home() {
    const [search, setSearch] = useState("")
    const [data, setData] = useState<AirlineDataResponse | undefined>(undefined)
    const [graphs, setGraphs] = useState<JSX.Element[]>([])

    useEffect(() => {
        let tempData: AirlineDataResponse = {} as AirlineDataResponse;

        async function fetchData() {
            const urlencoded = new URLSearchParams();
            urlencoded.append("action", "GET_DATA");
            urlencoded.append("airlineCode", search);
            const response = await fetch("/api/backend", {
                method: "POST",
                body: urlencoded,
            });
            if (!response.ok) {
                setData(undefined);
                return;
            }
            const data = await response.json();
            setData(data);
            tempData = data;
        }

        async function createGraphs() {
            const imageNames = ['Est_Contrail_Coverage_', 'Est_Flight_Distance_', 'Est_Power_Trapped_'];
            const graphs: JSX.Element[] = imageNames.map((name, index) => (
                <div key={`${name}${tempData.airlineCode}-${index}`}>
                    <Image
                        alt="airline"
                        radius="sm"
                        src={`/images/graphs/${name}${tempData.airlineCode}.png`}
                        width={250}
                    />
                </div>
            ));
            setGraphs(graphs);
        }

        fetchData().then(() => createGraphs())

    }, [search]);

    return (
        <>
            <div className="flex flex-col min-h-screen">
                <Nav/>
                <div className="flex flex-1 flex-col items-center justify-center px-4 text-center md:px-6">
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-bold tracking-tight">Search US Airline Emissions</h1>
                        <p className="max-w-[800px] text-gray-500 dark:text-gray-400">
                            Enter an airline name to get contrail data produced by US major
                            airlines.
                        </p>
                        <div className="mx-auto max-w-[400px]">
                            <div className="flex rounded-lg">
                                <Input
                                    radius={"sm"}
                                    className="min-w-[250px] flex-1 caret-black"
                                    placeholder="Search by airline..."
                                    type="search"
                                    isInvalid={data == undefined && search.length > 0}
                                    errorMessage={data == undefined && search.length > 0 ? "No images found" : undefined}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>
                    {data != undefined && <div className="mx-auto my-12 grid gap-4 w-full lg:max-w-4xl">
                        <Card>
                            <div className="grid gap-2 p-4">
                                <h2 className="text-xl font-semibold">{data.airlineCode} ({data.airlineName})</h2>
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
                    </div>}
                </div>
                <Footer/>
            </div>
        </>
    );
}