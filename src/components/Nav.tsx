"use client";

import Link from 'next/link';
import { JSX, SVGProps } from 'react';
import {usePathname} from "next/navigation";

export default function Nav() {
    const path = usePathname()

    return (
        <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
            <nav
                className="hidden gap-6 text-lg font-medium md:flex md:items-center md:gap-5 md:text-sm lg:gap-6">
                <Link
                    className="flex items-center gap-2 text-lg font-semibold md:text-base"
                    href="/">
                    <PlaneIcon className="w-6 h-6"/>
                    <span className="sr-only">Airline Emissions</span>
                </Link>
                <Link className={`${path === '/' ? 'font-bold' : 'text-gray-500'}`} href="/">
                    Search
                </Link>
                <Link className={`${path === '/ranking' ? 'font-bold' : 'text-gray-500'}`} href="/ranking">
                    Ranking
                </Link>
            </nav>
        </header>
    )
}

function PlaneIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        (<svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round">
            <path
                d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
        </svg>)
    );
}