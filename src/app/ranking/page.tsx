"use client";

import React, {JSX, SVGProps, useEffect, useMemo, useState} from "react";
import Nav from "@/components/Nav";
import {Card, CardFooter, CardHeader} from "@nextui-org/card";
import {Button, CardBody, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/react";
import {Image} from "@nextui-org/image";
import Footer from "@/components/Footer";
import {AirlineDataResponse} from "@/typings/AirlineData";

export default function Page() {
    const [data, setData] =  useState<AirlineDataResponse[] | undefined>(undefined)
    const [cards, setCards] = useState<JSX.Element[]>([]);

    useEffect(() => {
        const tempData: AirlineDataResponse[] = [];
        async function fetchData() {
            const urlencoded = new URLSearchParams();
            urlencoded.append("action", "GET_RANKING");
            const response = await fetch("/api/backend", {
                method: "POST",
                body: urlencoded
            });
            if (!response.ok) {
                setData(undefined);
                return;
            }
            const data = await response.json();
            setData(data);
            data.forEach((airline: AirlineDataResponse) => {
                tempData.push(airline);
            });
        }

        async function createCards() {
            const cards: JSX.Element[] = [];
            for (let i = 0; i < tempData.length; i++) {
                const airline = tempData[i];
                console.log(airline);
                cards.push(
                    <Card className="my-5 min-w-96 max-w-3xl px-5">
                        <CardHeader className="flex gap-3">
                            <Image
                                alt="nextui logo"
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
                );
            }
            setCards(cards);
        }
        fetchData().then(() => createCards());
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