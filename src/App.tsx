import { Fragment, useEffect, useState } from "react";
import "./App.css";
import { proxy, useSnapshot } from "valtio";
import { proxyMap, proxySet } from "valtio/utils";
import { HiPlus, HiCheck, HiChevronUpDown } from "react-icons/hi2";
import { Dialog, Transition, Combobox } from "@headlessui/react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from "@tanstack/react-query";
import usePlacesAutocomplete from "use-places-autocomplete";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="grid gap-4 grid-cols-[repeat(auto-fit,450px)] justify-center m-4">
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <Widget />
        <AddWidget />
      </div>
    </QueryClientProvider>
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

        <a className="block cursor-pointer text-sm mb-3">
          <span className="block hover:underline font-medium text-slate-700">
            Getting Covid in Singapore: after 6 days in isolation, I was free to
            leave
          </span>
          <span className="block text-slate-500 text-xs mt-0.5">
            Fri, 4th Feb 12:11 AM • South China Morning Post
          </span>
        </a>
        <a className="block cursor-pointer text-sm">
          <span className="block hover:underline font-medium text-slate-700">
            In Singapore, Lunar New Year is a Multicultural Feast
          </span>
          <span className="block text-slate-500 text-xs mt-0.5">
            Fri, 4th Feb 12:11 AM • South China Morning Post
          </span>
        </a>
      </div>
      <script
        async
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBmTvPsNH7RuaMEyngRvZzevapxHH331qg&libraries=places&callback=initMap"
      ></script>
    </div>
  );
}

function AddWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<null | typeof suggestions[0]>(null);

  function closeModal() {
    setIsModalOpen(false);
  }

  function openModal() {
    setIsModalOpen(true);
  }

  const {
    ready,
    suggestions: { status, data: suggestions },
    setValue: setSearchTerm,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)"],
    },
    callbackName: "initMap",
    debounce: 500,
  });

  useEffect(() => {
    loadPlacesScript();
  }, []);

  function handleAddCityClick() {
    closeModal();

    setTimeout(
      () => {
        setSelected(null);
        setSearchTerm("");
      },
      200 // time it takes for the modal close animation
    );
  }

  return (
    <>
      <button
        onClick={openModal}
        className="group rounded-lg border-2 border-dashed border-slate-200 px-6 py-5 flex flex-col items-center justify-center text-slate-500"
      >
        <HiPlus size={40} className="mb-4 transition-all" />
        <span className="h-0 opacity-0 group-hover:h-8 group-hover:opacity-100 transition-all">
          Add City
        </span>
      </button>
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Add a new city
                  </Dialog.Title>
                  <div className="relative w-full mt-6 mb-8">
                    <Combobox value={selected} onChange={setSelected}>
                      <div className="relative mt-1">
                        <div className="relative w-full overflow-hidden cursor-default border rounded-lg focus:outline-none">
                          <Combobox.Input
                            type="text"
                            className="w-full py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0 outline-none focus:outline-none rounded-lg"
                            placeholder="Search cities"
                            displayValue={(city?: typeof suggestions[0]) =>
                              city?.terms.map((t) => t.value).join(", ") ?? ""
                            }
                            onChange={(event) =>
                              setSearchTerm(event.target.value)
                            }
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <HiChevronUpDown
                              className="h-5 w-5 text-gray-400"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setSearchTerm("")}
                        >
                          {!suggestions.length && status !== "ZERO_RESULTS" ? (
                            <div></div>
                          ) : (
                            <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                              {status === "ZERO_RESULTS" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                  No results found.
                                </div>
                              ) : (
                                suggestions.map((s) => (
                                  <Combobox.Option
                                    key={s.place_id}
                                    className={({ active }) =>
                                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                        active
                                          ? "bg-teal-600 text-white"
                                          : "text-gray-900"
                                      }`
                                    }
                                    value={s}
                                  >
                                    {({ selected, active }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected
                                              ? "font-medium"
                                              : "font-normal"
                                          }`}
                                        >
                                          <span>{s.terms[0].value}</span>
                                          {s.terms.length < 2 ? null : (
                                            <span
                                              className={
                                                active ? "" : "text-slate-500"
                                              }
                                            >
                                              {", "}
                                              {s.terms
                                                .slice(1)
                                                .map((t) => t.value)
                                                .join(", ")}
                                            </span>
                                          )}
                                        </span>
                                        {selected ? (
                                          <span
                                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                              active
                                                ? "text-white"
                                                : "text-teal-600"
                                            }`}
                                          >
                                            <HiCheck
                                              className="h-5 w-5"
                                              aria-hidden="true"
                                            />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Combobox.Option>
                                ))
                              )}
                            </Combobox.Options>
                          )}
                        </Transition>
                      </div>
                    </Combobox>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <button
                      type="button"
                      disabled={!selected}
                      className="inline-flex justify-center rounded-md border border-transparent bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:text-slate-400 disabled:hover:bg-slate-100 disabled:cursor-not-allowed"
                      onClick={handleAddCityClick}
                    >
                      Add city
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

declare global {
  interface Window {
    placesScriptLoaded?: boolean;
  }
}

function loadPlacesScript() {
  return new Promise<void>((res) => {
    if (window.placesScriptLoaded) return res();

    window.placesScriptLoaded = true;

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${
      import.meta.env.VITE_GOOGLE_API_KEY
    }&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onload = () => res();
    document.body.appendChild(script);
  });
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
