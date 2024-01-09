"use client";
import Image from "next/image";
import Head from "next/head";
import SideNavbar from "@/components/SideNavbar";
import Navbar from "@/components/Navbar";
import Card from "@/components/Card";

export default function Home() {
  return (
    <>
      <div className="">
        {/* <SideNavbar /> */}
        <Navbar />
        <Card />
      </div>
    </>
  );
}
