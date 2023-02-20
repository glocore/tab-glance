import { useState } from "react";
import "./App.css";
import { proxy, useSnapshot } from "valtio";
import { proxyMap, proxySet } from "valtio/utils";

function App() {
  const { cities, widgets } = useSnapshot(widgetStore);
  console.log(cities, widgets);
  return (
    <div className="grid gap-4 grid-cols-[repeat(auto-fit,450px)] justify-center m-4">
      <Widget />
      <Widget />
      <Widget />
      <Widget />
      <Widget />
    </div>
  );
}

function Widget() {
  return (
    <div className="border rounded-lg px-6 py-5">
      <div className="grid gap-x-2 grid-cols-[min-content_auto_max-content] grid-rows-2">
        <span className="text-2xl">🇮🇳</span>
        <span
          className="min-w-0 truncate text-slate-400"
          title="Mumbai, Maharashtra, India"
        >
          <span className="text-2xl text-black">Mumbai&nbsp;</span>
          <span className="text-lg font-medium">Maharashtra, India</span>
        </span>
        <span className="block row-start-2 col-start-2 text-slate-400 text-sm font-medium">
          6:13 PM (UTC +5.30)
        </span>
        <a href="" className="text-2xl text-right">
          26°C
        </a>
        <a
          href=""
          className="row-start-2 col-start-3 text-slate-400 text-sm font-medium text-right truncate max-w-[80px]"
          title="Scattered Clouds"
        >
          Scattered Clouds
        </a>
      </div>

      <div>
        <a className="font-semibold text-sm my-2 inline-block hover:underline cursor-pointer">
          TOP STORIES
        </a>

        <a className="cursor-pointer text-sm">
          <span className="block hover:underline font-medium text-slate-700">
            Getting Covid in Singapore: after 6 days in isolation, I was free to
            leave
          </span>
          <span className="block text-slate-500 text-xs mt-0.5">
            Fri, 4th Feb 12:11 AM • South China Morning Post
          </span>
        </a>
      </div>
    </div>
  );
}

type Widget = {
  headlines: Headline[];
  weather: Weather;
  time: Time;
};

type Headline = {
  title: string;
  link: string;
};

type Weather = {
  temperatureCelsius: number;
  description: string;
};

type Time = {
  gmtOffset: number;
  dstOffset: number;
};

const widgetStore = proxy<{ cities: string[]; widgets: Map<string, Widget> }>(
  JSON.parse(
    localStorage.getItem("widgets") ??
      '{ "cities": [], "widgets": { "__type": "Map", "value": {} } }',
    reviver
  )
);

function replacer(_: any, value: any) {
  if (value instanceof Map) {
    return { __type: "Map", value: Object.fromEntries(value) };
  }
  if (value instanceof Set) {
    return { __type: "Set", value: Array.from(value) };
  }
  return value;
}

function reviver(_: any, value: any) {
  if (value?.__type === "Set") {
    return proxySet(value.value);
  }

  if (value?.__type === "Map") {
    return proxyMap(Object.entries(value.value));
  }

  return value;
}

export default App;
