import { createLayout } from "@components/layout/layout";
import React from "react";
import Link from "next/link";
import { FilterProvider } from "./states/filter";
import { Filter } from "./components/Filter";
import { ProductsView } from "./components/ProductsView";
import { CategoryFilter } from "./components/CategoryFilter";

import Flicking from "@egjs/react-flicking";
import "@egjs/react-flicking/dist/flicking.css";
import { SearchInput } from "./components/SearchInput";

export default function Page() {
  return (
    <FilterProvider>
      <div className="fixed bottom-12 z-50 flex w-full justify-center p-3 md:hidden">
        <Link
          href="/build"
          className="bottom-0 right-0 mb-4 block rounded-full bg-red px-8 py-3 text-center font-bold text-white"
        >
          의뢰 등록하기
        </Link>
      </div>
      <div className="container flex flex-col">
        <div className="space-y-4 pt-3 pb-5 md:hidden">
          <Flicking
            bound
            moveType="freeScroll"
            align="prev"
            className="bleed"
            cameraClass="[&>*]:mr-3"
            renderOnSameKey
          >
            {CategoryFilter()}
          </Flicking>
          <span className="flex justify-between text-sm">
            <Filter />
          </span>
        </div>
        <div className="hidden h-16 items-center space-x-7 pb-7 md:flex">
          <span className="flex-[0_0_16rem] text-3xl font-bold">의뢰</span>
          <span className="flex flex-1 items-center justify-end space-x-4">
            <Filter />
          </span>
        </div>
        <div className="flex items-start">
          <div className="mr-7 hidden flex-[0_0_16rem] pr-3.5 md:block">
            <Link
              href="/build"
              className="mb-4 block w-full rounded-full bg-red px-4 py-3 text-center font-bold text-white"
            >
              의뢰 등록하기
            </Link>
            <SearchInput />
            <div className="h-8" />
            <div className="flex flex-col items-start space-y-3">
              {CategoryFilter()}
            </div>
          </div>
          <ProductsView />
        </div>
      </div>
    </FilterProvider>
  );
}

const Header = () => {
  return (
    <>
      <div className="container relative flex h-12 items-center justify-between bg-white">
        <span className="absolute top-0 left-0 flex h-full w-full items-center justify-center font-bold">
          의뢰
        </span>
        <span></span>
        <span>
          <img src="/assets/icons/search.svg" className="h-6" />
        </span>
      </div>
    </>
  );
};

Page.getLayout = createLayout({
  mobileNav: true,
  rawHeader: <Header />,
});